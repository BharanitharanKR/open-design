import { afterEach, describe, expect, it, vi } from 'vitest';
import { startMemorySampler, type ProcessMemorySample } from '../../src/main/memory-sampler.js';

const context = { app_session_id: 'session', app_version: '1.0', environment: 'test', platform: 'linux', arch: 'x64', os_version: 'test-os' };
const metric = (pid = 42, creationTime = Date.now() - 2000) => ({ pid, type: 'Tab', creationTime, memory: { workingSetSize: 2048 } });
afterEach(() => { vi.useRealTimers(); });

describe('desktop memory sampler', () => {
  it('samples main and only managed renderer processes, converts KiB, and deduplicates shared renderers', async () => {
    vi.useFakeTimers();
    const batches: ProcessMemorySample[][] = [];
    const sampler = startMemorySampler({ context, app: { getAppMetrics: () => [metric(), metric(77)] }, getManagedRendererPids: () => [42, 42], report: async (batch) => { batches.push(batch); } });
    await vi.advanceTimersByTimeAsync(60_000);
    expect(batches).toHaveLength(2);
    expect(batches[0]).toHaveLength(2);
    expect(batches[0]![0]).toMatchObject({ ...context, process_role: 'main', sampling_interval_ms: 60_000 });
    expect(batches[0]![0]!.rss_bytes).toBeGreaterThan(0);
    expect(batches[0]![1]).toMatchObject({ process_role: 'renderer', rss_bytes: 2048 * 1024, heap_used_bytes: null, external_bytes: null });
    expect(batches[1]![0]!.process_instance_id).toBe(batches[0]![0]!.process_instance_id);
    sampler.stop();
  });

  it('continues for more than two hours and stops idempotently', async () => {
    vi.useFakeTimers();
    const report = vi.fn(async (_batch: ProcessMemorySample[]) => {});
    const sampler = startMemorySampler({ context, intervalMs: 60_000, app: { getAppMetrics: () => [] }, getManagedRendererPids: () => [], report });
    await vi.advanceTimersByTimeAsync(121 * 60_000);
    expect(report).toHaveBeenCalledTimes(122);
    expect(report.mock.calls.at(-1)![0][0]!.uptime_ms).toBeGreaterThanOrEqual(121 * 60_000);
    sampler.stop(); sampler.stop();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(report).toHaveBeenCalledTimes(122);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('handles a disappearing renderer and PID reuse without retaining stale process samples', async () => {
    vi.useFakeTimers();
    let metrics = [metric(42, 100)];
    const batches: ProcessMemorySample[][] = [];
    const sampler = startMemorySampler({ context, intervalMs: 1000, app: { getAppMetrics: () => metrics }, getManagedRendererPids: () => [42], report: async (batch) => { batches.push(batch); } });
    await vi.advanceTimersByTimeAsync(0);
    metrics = [];
    await vi.advanceTimersByTimeAsync(1000);
    expect(batches[1]).toHaveLength(1);
    metrics = [metric(42, 200)];
    await vi.advanceTimersByTimeAsync(1000);
    expect(batches[2]![1]!.process_instance_id).not.toBe(batches[0]![1]!.process_instance_id);
    sampler.stop();
  });

  it('isolates metric and delivery errors; does not accumulate work behind a slow sink', async () => {
    vi.useFakeTimers();
    let release!: () => void;
    const report = vi.fn(() => new Promise<void>((resolve) => { release = resolve; }));
    const app = { getAppMetrics: vi.fn(() => { throw new Error('renderer exited'); }) };
    const sampler = startMemorySampler({ context, intervalMs: 1000, app, getManagedRendererPids: () => [42], report });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(report).toHaveBeenCalledTimes(1);
    expect(app.getAppMetrics).toHaveBeenCalledTimes(1);
    release();
    report.mockImplementation(async () => { throw new Error('offline'); });
    await vi.advanceTimersByTimeAsync(2000);
    expect(report.mock.calls.length).toBeGreaterThan(1);
    sampler.stop();
  });

  it('uses null for unavailable renderer RSS and rejects invalid timer intervals', async () => {
    vi.useFakeTimers();
    const report = vi.fn(async (_batch: ProcessMemorySample[]) => {});
    const options = { context, app: { getAppMetrics: () => [{ ...metric(), memory: { workingSetSize: NaN } }] }, getManagedRendererPids: () => [42], report };
    const sampler = startMemorySampler(options);
    await vi.advanceTimersByTimeAsync(0);
    expect(report.mock.calls[0]![0][1]!.rss_bytes).toBeNull();
    sampler.stop();
    for (const intervalMs of [0, -1, NaN, Infinity, 0.5, 2 ** 31]) expect(() => startMemorySampler({ ...options, intervalMs })).toThrow();
  });
});
