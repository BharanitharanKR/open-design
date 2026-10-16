import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createStartupTiming, attachStartupReadyIpc } from "../../src/main/startup-timing.js";

function fixture() {
  let clock = 100;
  const events: { event: string; properties: Record<string, unknown> }[] = [];
  const timing = createStartupTiming({
    startupType: "cold", startedAt: "2026-10-16T00:00:00.000Z", startTime: 0,
    now: () => clock, id: (() => { let n = 0; return () => `id-${++n}`; })(),
    report: async (event, properties) => { events.push({ event, properties }); },
  });
  return { timing, events, advance: (ms: number) => { clock += ms; } };
}

describe("process entry to business Ready", () => {
  it("retains early stages, measures monotonically and requires business readiness AND window reveal", () => {
    const { timing, events, advance } = fixture();
    timing.mark("electron_ready");
    advance(50);
    timing.mark("daemon_ready");
    advance(25);
    timing.mark("web_ready");
    const context = timing.context();
    expect(timing.businessReady({ ...context, required_data_ready: true, actions_ready: true })).toBe(true);
    expect(events.map(e => e.event)).toEqual(["client_launch_attempt"]);
    advance(25);
    timing.mark("window_revealed");
    timing.mark("window_revealed");
    timing.businessReady({ ...context, required_data_ready: true, actions_ready: true });
    expect(events.map(e => e.event)).toEqual(["client_launch_attempt", "client_business_ready", "client_launch_result"]);
    expect(events[2]?.properties).toMatchObject({
      ...context, startup_type: "cold", outcome: "ready", duration_ms: 200,
      measurement_start: "process_entry", os_launch_time_available: false,
      stage_offsets_ms: { electron_ready: 100, daemon_ready: 150, web_ready: 175, business_ready: 175, window_revealed: 200 },
      stage_durations_ms: { electron_ready: 100, daemon_ready: 50, web_ready: 25, business_ready: 0, window_revealed: 25 },
    });
    expect(events[0]?.properties.event_id).not.toBe(events[1]?.properties.event_id);
  });

  it("never treats mount/load or stale/incomplete signals as Ready", () => {
    const { timing, events } = fixture();
    timing.mark("window_revealed");
    expect(timing.businessReady({ ...timing.context(), required_data_ready: false, actions_ready: true })).toBe(false);
    expect(timing.businessReady({ ...timing.context(), launch_attempt_id: "stale", required_data_ready: true, actions_ready: true })).toBe(false);
    expect(timing.businessReady(null)).toBe(false);
    expect(events).toHaveLength(1);
    timing.finish("cancelled", "quit_before_ready");
    expect(events.at(-1)?.properties).toMatchObject({ outcome: "cancelled", duration_ms: 100, failure_stage: "window_revealed" });
    expect(timing.businessReady({ ...timing.context(), required_data_ready: true, actions_ready: true })).toBe(false);
  });

  it("records one failure with missing phases absent rather than zero", () => {
    const { timing, events } = fixture();
    timing.mark("daemon_spawning");
    timing.finish("failed", "daemon-start");
    timing.finish("cancelled", "quit_before_ready");
    expect(events).toHaveLength(2);
    expect(events[1]?.properties).toMatchObject({ outcome: "failed", reason: "daemon-start", failure_stage: "daemon_spawning" });
    expect((events[1]?.properties.stage_offsets_ms as object)).not.toHaveProperty("web_ready");
  });

  it("does not let a rejected reporter affect launch or Ready", async () => {
    const timing = createStartupTiming({ startupType: "reopen", report: async () => { throw new Error("offline"); } });
    timing.mark("window_revealed");
    expect(timing.businessReady({ ...timing.context(), required_data_ready: true, actions_ready: true })).toBe(true);
    await timing.flush();
  });

  it("buffers early events until a reporter is armed without changing their time", async () => {
    const report = vi.fn(async (_event: string, _properties: Record<string, unknown>) => undefined);
    const timing = createStartupTiming({ startupType: "cold", startedAt: "2026-10-16T00:00:00.000Z", now: () => 500 });
    timing.finish("failed", "daemon-start");
    timing.setReporter(report);
    timing.setReporter(report);
    await timing.flush();
    expect(report).toHaveBeenCalledTimes(2);
    expect(report.mock.calls[0]).toEqual(["client_launch_attempt", expect.objectContaining({ occurred_at: "2026-10-16T00:00:00.000Z" })]);
    expect(report.mock.calls[1]).toEqual(["client_launch_result", expect.objectContaining({ duration_ms: 500 })]);
  });

  it("gives warm and reopened attempts fresh IDs in the same app session and excludes prior process uptime", () => {
    const { timing } = fixture();
    for (const type of ["warm", "reopen"] as const) {
      const next = timing.nextAttempt(type);
      expect(next.context().launch_attempt_id).not.toBe(timing.context().launch_attempt_id);
      expect(next.context().app_session_id).toBe(timing.context().app_session_id);
      const report = vi.fn(async (_event: string, _properties: Record<string, unknown>) => undefined);
      next.setReporter(report);
      next.finish("cancelled", "quit_before_ready");
      // Reporter is retained by nextAttempt; replace it for this result only.
      expect(report.mock.calls[0]).toEqual(["client_launch_result", expect.objectContaining({ measurement_start: "activation_received", startup_type: type })]);
      expect(report.mock.calls[0]?.[1].duration_ms).toBe(0);
    }
  });
});

it("the real IPC authorization rejects subframes, pets, foreign origins and destroyed senders", () => {
  const source = readFileSync(new URL("../../src/main/index.ts", import.meta.url), "utf8");
  const ast = ts.createSourceFile("index.ts", source, ts.ScriptTarget.Latest, true);
  let callback = "";
  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(ast) === "authorize") callback = node.initializer.getText(ast);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  expect(callback).not.toBe("");
  const js = ts.transpileModule(`const authorize = ${callback};`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const authorize = runInNewContext(`${js}\nauthorize`, {
    URL, BrowserWindow: { fromWebContents: (sender: unknown) => ({ webContents: sender }) },
    desktop: { status: () => ({ url: "od://app/" }) },
  }) as (event: unknown) => boolean;
  const mainFrame = {};
  const event = { sender: { mainFrame, isDestroyed: () => false, getURL: () => "od://app/" }, senderFrame: mainFrame };
  expect(authorize(event)).toBe(true);
  expect(authorize({ ...event, senderFrame: {} })).toBe(false);
  for (const url of ["od://app/pet", "https://foreign.invalid/", "not-a-url"]) {
    expect(authorize({ ...event, sender: { ...event.sender, getURL: () => url } })).toBe(false);
  }
  expect(authorize({ ...event, sender: { ...event.sender, isDestroyed: () => true } })).toBe(false);
});

it("the real desktop reveal callback records a phase without declaring business Ready", () => {
  const source = readFileSync(new URL("../../src/main/index.ts", import.meta.url), "utf8");
  const ast = ts.createSourceFile("index.ts", source, ts.ScriptTarget.Latest, true);
  let callback = "";
  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(ast) === "onMainWindowReady") callback = node.initializer.getText(ast);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  expect(callback).not.toBe("");
  const { timing, events } = fixture();
  const js = ts.transpileModule(`const reveal = ${callback}; reveal();`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  runInNewContext(js, { startupTiming: timing, recordIncomingUpdateLifecycle: vi.fn(), options: {}, updater: { config: {} } });
  timing.finish("cancelled", "quit_before_ready");
  expect(events.at(-1)?.properties.stage_offsets_ms).toHaveProperty("window_revealed");
  expect(events.some(e => e.event === "client_business_ready")).toBe(false);
});

it("exposes correlation and accepts Ready only from the authorized main frame, disposing both handlers", () => {
  const handlers = new Map<string, (event: unknown, payload?: unknown) => unknown>();
  const ipc = { handle: (name: string, fn: (event: unknown, payload?: unknown) => unknown) => { handlers.set(name, fn); }, removeHandler: vi.fn() };
  const { timing, events } = fixture();
  timing.mark("window_revealed");
  const allowed = {};
  const dispose = attachStartupReadyIpc({ ipc, timing: () => timing, authorize: event => event === allowed });
  expect(handlers.get("od:startup:context")?.({})).toBeNull();
  expect(handlers.get("od:startup:context")?.(allowed)).toEqual(timing.context());
  const signal = { ...timing.context(), required_data_ready: true, actions_ready: true };
  expect(handlers.get("od:startup:business-ready")?.({}, signal)).toBe(false);
  expect(events).toHaveLength(1);
  expect(handlers.get("od:startup:business-ready")?.(allowed, signal)).toBe(true);
  dispose();
  expect(ipc.removeHandler.mock.calls.flat()).toEqual(["od:startup:context", "od:startup:business-ready"]);
});
