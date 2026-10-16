import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";

// CS02-local contract until CS01's registry/types land. No page-load event is
// a business Ready signal. OS click time is unavailable at this boundary.
export type StartupType = "cold" | "warm" | "reopen";
export type StartupEvent = "client_launch_attempt" | "client_business_ready" | "client_launch_result";
export type StartupPhase = "runtime_resolved" | "electron_ready" | "daemon_spawning" | "daemon_ready"
  | "web_spawning" | "web_ready" | "desktop_entry" | "window_creating" | "window_revealed" | "business_ready";
export type StartupReporter = (event: StartupEvent, properties: Record<string, unknown>) => Promise<unknown>;
const processSessionId = randomUUID();

export function createStartupTiming(input: {
  startupType: StartupType;
  appSessionId?: string;
  startTime?: number;
  startedAt?: string;
  now?: () => number;
  id?: () => string;
  report?: StartupReporter;
}): StartupTiming {
  const now = input.now ?? (() => performance.now());
  const id = input.id ?? randomUUID;
  // performance.timeOrigin is Node's process origin, before ESM evaluation.
  // A running-process activation has only an observed intent receipt time.
  const start = input.startTime ?? (input.startupType === "cold" ? 0 : now());
  const startedAt = input.startedAt ?? new Date(performance.timeOrigin + start).toISOString();
  const context = { launch_attempt_id: id(), app_session_id: input.appSessionId ?? processSessionId };
  const offsets: Partial<Record<StartupPhase, number>> = {};
  const durations: Partial<Record<StartupPhase, number>> = {};
  const pending: { event: StartupEvent; properties: Record<string, unknown> }[] = [];
  const sending = new Set<Promise<unknown>>();
  let report = input.report;
  let lastOffset = 0;
  let lastPhase: StartupPhase | null = null;
  let terminal = false;
  let dataReady = false;

  function dispatch(event: StartupEvent, properties: Record<string, unknown>) {
    if (!report) { pending.push({ event, properties }); return; }
    try {
      const task = Promise.resolve(report(event, properties)).catch(() => undefined);
      sending.add(task);
      void task.then(() => sending.delete(task));
    } catch { /* Telemetry cannot break the host lifecycle. */ }
  }
  function emit(event: StartupEvent, extra: Record<string, unknown> = {}, offset = Math.max(lastOffset, now() - start)) {
    dispatch(event, {
      ...context, event_id: id(), startup_type: input.startupType,
      started_at: startedAt, occurred_at: new Date(Date.parse(startedAt) + offset).toISOString(),
      measurement_start: input.startupType === "cold" ? "process_entry" : "activation_received",
      start_time_source: input.startupType === "cold" ? "node_performance_time_origin" : "main_process_monotonic_clock",
      os_launch_time_available: false,
      stage_offsets_ms: { ...offsets }, stage_durations_ms: { ...durations }, ...extra,
    });
  }
  function mark(phase: StartupPhase) {
    if (terminal || offsets[phase] !== undefined) return;
    const offset = Math.max(lastOffset, now() - start);
    offsets[phase] = offset;
    durations[phase] = offset - lastOffset;
    lastOffset = offset;
    lastPhase = phase;
    if (dataReady && offsets.window_revealed !== undefined) {
      terminal = true;
      emit("client_business_ready", { duration_ms: offset }, offset);
      emit("client_launch_result", { outcome: "ready", duration_ms: offset }, offset);
    }
  }
  emit("client_launch_attempt", {}, 0);
  return {
    context: () => ({ ...context }),
    mark,
    setReporter(next: StartupReporter) {
      report = next;
      for (const item of pending.splice(0)) dispatch(item.event, item.properties);
    },
    businessReady(value: unknown): boolean {
      if (terminal || !value || typeof value !== "object") return false;
      const signal = value as Record<string, unknown>;
      if (signal.launch_attempt_id !== context.launch_attempt_id || signal.app_session_id !== context.app_session_id
        || signal.required_data_ready !== true || signal.actions_ready !== true) return false;
      dataReady = true;
      mark("business_ready");
      return true;
    },
    finish(outcome: "failed" | "cancelled", reason: string) {
      if (terminal) return;
      terminal = true;
      emit("client_launch_result", { outcome, reason, failure_stage: lastPhase, duration_ms: Math.max(lastOffset, now() - start) });
    },
    isPending: () => !terminal,
    nextAttempt(startupType: "warm" | "reopen") {
      return createStartupTiming({ startupType, appSessionId: context.app_session_id, report, now: input.now, id: input.id });
    },
    async flush() { await Promise.all([...sending]); },
  };
}

export interface StartupTiming {
  context(): { launch_attempt_id: string; app_session_id: string };
  mark(phase: StartupPhase): void;
  setReporter(report: StartupReporter): void;
  businessReady(value: unknown): boolean;
  finish(outcome: "failed" | "cancelled", reason: string): void;
  isPending(): boolean;
  nextAttempt(startupType: "warm" | "reopen"): StartupTiming;
  flush(): Promise<void>;
}

/** Renderer/preload owner must supply the business readiness signal. Both
 * handlers are deliberately restricted to the owning window's main frame. */
export function attachStartupReadyIpc<Event>(input: {
  ipc: { handle(name: string, listener: (event: Event, value?: unknown) => unknown): void; removeHandler(name: string): void };
  timing: () => StartupTiming;
  authorize: (event: Event) => boolean;
}): () => void {
  const contextChannel = "od:startup:context";
  const readyChannel = "od:startup:business-ready";
  input.ipc.handle(contextChannel, event => input.authorize(event) ? input.timing().context() : null);
  input.ipc.handle(readyChannel, (event, value) => input.authorize(event) && input.timing().businessReady(value));
  return () => { input.ipc.removeHandler(contextChannel); input.ipc.removeHandler(readyChannel); };
}
