import {
  updateVelaTaskLease,
  VelaTaskLeaseError,
  type VelaTaskLease,
  type VelaTaskLeaseInput,
} from '../integrations/vela-task-leases.js';

type Entry = {
  input: VelaTaskLeaseInput;
  configuredEnv?: Record<string, string> | undefined;
  receipt: VelaTaskLease | null;
  timer: ReturnType<typeof setTimeout> | null;
  starting: Promise<VelaTaskLease> | null;
  onLost: (code: string) => Promise<void>;
};

/** One live root per physical run/attempt. Backend time owns expiry; any failed
 * heartbeat stops the local process instead of extending an offline lease.
 * A daemon crash stops heartbeats; the server's TTL releases its slot. */
export function createWorkspaceTaskLeaseLifecycle(deps: {
  update?: typeof updateVelaTaskLease;
  onReleaseFailure?: (runId: string) => void;
} = {}) {
  const update = deps.update ?? updateVelaTaskLease;
  const entries = new Map<string, Entry>();
  const finishing = new Map<string, Promise<void>>();
  const current = (entry: Entry) => entries.get(entry.input.runId) === entry;
  const release = async (entry: Entry) => {
    if (!entry.receipt) return;
    try {
      await update('release', { ...entry.input, workspaceId: entry.receipt.workspaceId, leaseToken: entry.receipt.leaseToken }, { configuredEnv: entry.configuredEnv });
    } catch {
      // No heartbeat is retained. A lost release cannot grant further calls;
      // the durable server lease expires, so cleanup is bounded by its TTL.
      deps.onReleaseFailure?.(entry.input.runId);
    }
  };
  const finish = (runId: string, attempt: number): Promise<void> => {
    const entry = entries.get(runId);
    if (!entry || entry.input.attempt !== attempt) return Promise.resolve();
    entries.delete(runId);
    if (entry.timer) clearTimeout(entry.timer);
    const completion = (async () => {
      try { await entry.starting; } catch { /* Canceled admission may still have returned a receipt. */ }
      await release(entry);
    })();
    finishing.set(runId, completion);
    void completion.finally(() => {
      if (finishing.get(runId) === completion) finishing.delete(runId);
    });
    return completion;
  };
  const schedule = (entry: Entry) => {
    if (!current(entry) || !entry.receipt) return;
    entry.timer = setTimeout(async () => {
      entry.timer = null;
      if (!current(entry) || !entry.receipt) return;
      try {
        const receipt = await update('heartbeat', { ...entry.input, workspaceId: entry.receipt.workspaceId, leaseToken: entry.receipt.leaseToken }, { configuredEnv: entry.configuredEnv });
        if (!receipt) throw new VelaTaskLeaseError('workspace_task_lease_invalid_response');
        if (!current(entry)) return;
        entry.receipt = receipt;
        schedule(entry);
      } catch (error) {
        if (!current(entry)) return;
        entries.delete(entry.input.runId);
        try {
          await entry.onLost(error instanceof VelaTaskLeaseError ? error.code : 'workspace_task_lease_unavailable');
        } catch {
          deps.onReleaseFailure?.(entry.input.runId);
        } finally { await release(entry); }
      }
    }, entry.receipt.heartbeatIntervalMs);
    entry.timer.unref?.();
  };
  return {
    async start(input: VelaTaskLeaseInput, options: {
      configuredEnv?: Record<string, string> | undefined;
      onLost: (code: string) => Promise<void>;
    }): Promise<VelaTaskLease> {
      const previousFinish = finishing.get(input.runId);
      if (previousFinish) await previousFinish;
      const prior = entries.get(input.runId);
      if (prior) {
        if (prior.input.workspaceId !== input.workspaceId || prior.input.attempt !== input.attempt)
          throw new VelaTaskLeaseError('workspace_task_lease_identity_mismatch');
        if (!prior.starting) throw new VelaTaskLeaseError('workspace_task_lease_unavailable');
        return prior.starting;
      }
      const entry: Entry = {
        input, configuredEnv: options.configuredEnv, onLost: options.onLost,
        receipt: null, timer: null, starting: null,
      };
      entries.set(input.runId, entry);
      entry.starting = (async () => {
        try {
          const receipt = await update('admit', input, { configuredEnv: entry.configuredEnv });
          if (!receipt) throw new VelaTaskLeaseError('workspace_task_lease_invalid_response');
          entry.receipt = receipt;
          if (!current(entry)) throw new VelaTaskLeaseError('workspace_task_canceled_before_start');
          schedule(entry);
          return receipt;
        } catch (error) {
          if (current(entry)) entries.delete(input.runId);
          throw error;
        }
      })();
      return entry.starting;
    },
    finish,
  };
}
