import { randomUUID } from 'node:crypto';

/** Local CS04 contract. CS01 owns promotion into packages/contracts and event admission. */
export type MemorySampleContext = {
  app_session_id: string;
  app_version: string | null;
  environment: string | null;
  platform: string;
  arch: string;
  os_version: string | null;
};

export type ProcessMemorySample = MemorySampleContext & {
  process_role: 'main' | 'renderer';
  process_instance_id: string;
  uptime_ms: number;
  rss_bytes: number | null;
  heap_used_bytes: number | null;
  external_bytes: number | null;
  /** UTC ISO-8601 event time, not upload time. */
  sampled_at: string;
  sampling_interval_ms: number;
};

type RendererMetric = {
  pid: number;
  type: string;
  /** Electron process creation time in milliseconds since epoch. */
  creationTime: number;
  memory: { workingSetSize: number };
};

export type MemorySamplerOptions = {
  context: MemorySampleContext;
  /** Electron app; invoke startMemorySampler only after app.whenReady(). */
  app: { getAppMetrics(): readonly RendererMetric[] };
  /** Current live, owned WebContents' getOSProcessId(); exclude destroyed contents. */
  getManagedRendererPids(): readonly number[];
  /** One bounded batch per tick, mapped to client_process_memory_sample by CS02. */
  report(samples: ProcessMemorySample[]): Promise<unknown> | void;
  intervalMs?: number;
};

export type MemorySampler = { stop(): void };
const MAIN_INSTANCE_ID = randomUUID();
const DEFAULT_INTERVAL_MS = 60_000;

/**
 * Immediate sample followed by periodic samples; no history or retry queue is
 * retained here. The telemetry owner handles durable delivery. A slow sink skips
 * ticks rather than accumulating work; stop does not wait for an in-flight sink.
 * No renderer JS execution, heap snapshots, new IPC listeners, or subprocesses.
 */
export function startMemorySampler(options: MemorySamplerOptions): MemorySampler {
  const intervalMs = options.intervalMs ?? DEFAULT_INTERVAL_MS;
  if (!Number.isInteger(intervalMs) || intervalMs < 1 || intervalMs > 2_147_483_647) {
    throw new RangeError('Memory sampling interval must be an integer from 1 to 2147483647 ms');
  }
  const context = { ...options.context };
  const startedAt = performance.now();
  const initialUptime = process.uptime() * 1000;
  let stopped = false;
  let busy = false;

  async function sample(): Promise<void> {
    if (stopped || busy) return;
    busy = true;
    try {
      const at = Date.now();
      const common = { ...context, sampled_at: new Date(at).toISOString(), sampling_interval_ms: intervalMs };
      const memory = process.memoryUsage();
      const samples: ProcessMemorySample[] = [{
        ...common,
        process_role: 'main',
        process_instance_id: MAIN_INSTANCE_ID,
        uptime_ms: Math.max(0, Math.round(initialUptime + performance.now() - startedAt)),
        rss_bytes: bytesOrNull(memory.rss),
        heap_used_bytes: bytesOrNull(memory.heapUsed),
        external_bytes: bytesOrNull(memory.external),
      }];
      try {
        const managed = new Set(options.getManagedRendererPids());
        for (const metric of options.app.getAppMetrics()) {
          if (metric.type !== 'Tab' || !managed.delete(metric.pid)) continue;
          // A missing creation time cannot safely identify PID reuse.
          if (!Number.isFinite(metric.creationTime) || metric.creationTime <= 0) continue;
          samples.push({
            ...common,
            process_role: 'renderer',
            process_instance_id: `${context.app_session_id}:renderer:${metric.pid}:${metric.creationTime}`,
            uptime_ms: Math.max(0, Math.round(at - metric.creationTime)),
            // Electron MemoryInfo uses KiB. Never substitute privateBytes for RSS.
            rss_bytes: bytesOrNull(metric.memory.workingSetSize * 1024),
            heap_used_bytes: null,
            external_bytes: null,
          });
        }
      } catch {
        // A renderer can disappear between enumeration and metrics collection.
      }
      if (!stopped) await options.report(samples);
    } catch {
      // Neither sampling nor telemetry failures may affect host lifecycle.
    } finally {
      busy = false;
    }
  }

  const timer = setInterval(() => { void sample(); }, intervalMs);
  timer.unref?.();
  void sample();
  return {
    stop(): void {
      stopped = true;
      clearInterval(timer);
    },
  };
}

function bytesOrNull(value: number): number | null {
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
}
