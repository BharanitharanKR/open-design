import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createWorkspaceTaskLeaseLifecycle } from '../../src/services/workspace-task-lease-lifecycle.js';
import { VelaTaskLeaseError, type VelaTaskLease, type VelaTaskLeaseInput } from '../../src/integrations/vela-task-leases.js';

const receipt = (input: VelaTaskLeaseInput): VelaTaskLease => ({
  ...input, workspaceId: input.workspaceId || 'server-default',
  leaseToken: `token-${input.attempt}`, leaseExpiresAt: '2026-10-18T00:00:00Z', heartbeatIntervalMs: 30_000,
});
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('workspace root task lifecycle', () => {
  it('admits once before start and sends heartbeat and finish to the pinned server workspace', async () => {
    const update = vi.fn(async (action, input) => action === 'release' ? null : receipt(input));
    const lost = vi.fn(async () => {});
    const lifecycle = createWorkspaceTaskLeaseLifecycle({ update });
    const input = {runId:'root',workspaceId:'',attempt:0};
    const [a,b] = await Promise.all([lifecycle.start(input,{onLost:lost}),lifecycle.start(input,{onLost:lost})]);
    expect(a).toEqual(b);
    expect(update).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(update).toHaveBeenLastCalledWith('heartbeat',expect.objectContaining({workspaceId:'server-default',leaseToken:'token-0'}),expect.anything());
    await lifecycle.finish('root',0);
    expect(update).toHaveBeenLastCalledWith('release',expect.objectContaining({workspaceId:'server-default',leaseToken:'token-0'}),expect.anything());
    await vi.advanceTimersByTimeAsync(90_000);
    expect(update).toHaveBeenCalledTimes(3);
    expect(lost).not.toHaveBeenCalled();
  });
  it('stops a process on heartbeat rejection without permitting an offline renewal', async () => {
    const order:string[]=[];
    const update = vi.fn(async (action, input) => {
      order.push(action);
      if(action==='heartbeat') throw new VelaTaskLeaseError('workspace_task_forbidden');
      return action==='release'?null:receipt(input);
    });
    const lifecycle=createWorkspaceTaskLeaseLifecycle({update});
    await lifecycle.start({runId:'root',workspaceId:'A',attempt:0},{onLost:async(code)=>{order.push(`stop:${code}`);}});
    await vi.advanceTimersByTimeAsync(30_000);
    expect(order).toEqual(['admit','heartbeat','stop:workspace_task_forbidden','release']);
    await vi.advanceTimersByTimeAsync(90_000);
    expect(update).toHaveBeenCalledTimes(3);
  });
  it('a late old heartbeat or finish cannot schedule or release the new attempt', async () => {
    let completeHeartbeat!:(value:VelaTaskLease)=>void;
    const update=vi.fn(async(action,input)=> {
      if(action==='heartbeat' && input.attempt===0) return new Promise<VelaTaskLease>(resolve=>{completeHeartbeat=resolve;});
      return action==='release'?null:receipt(input);
    });
    const lifecycle=createWorkspaceTaskLeaseLifecycle({update});
    await lifecycle.start({runId:'root',workspaceId:'A',attempt:0},{onLost:async()=>{}});
    await vi.advanceTimersByTimeAsync(30_000);
    await lifecycle.finish('root',0);
    await lifecycle.start({runId:'root',workspaceId:'A',attempt:1},{onLost:async()=>{}});
    completeHeartbeat(receipt({runId:'root',workspaceId:'A',attempt:0}));
    await Promise.resolve();
    await lifecycle.finish('root',0);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(update).toHaveBeenLastCalledWith('heartbeat',expect.objectContaining({attempt:1,leaseToken:'token-1'}),expect.anything());
    expect(update.mock.calls.filter(([action])=>action==='release')).toHaveLength(1);
    await lifecycle.finish('root',1);
  });
  it('cancellation while admission is in flight releases the returned receipt and never starts heartbeat', async () => {
    let admit!:(value:VelaTaskLease)=>void;
    const update=vi.fn(async(action,input)=>action==='admit'?new Promise<VelaTaskLease>(resolve=>{admit=resolve;}):null);
    const lifecycle=createWorkspaceTaskLeaseLifecycle({update});
    const input={runId:'root',workspaceId:'A',attempt:0};
    const starting=lifecycle.start(input,{onLost:async()=>{}});
    const rejected=expect(starting).rejects.toThrow('workspace_task_canceled_before_start');
    const finishing=lifecycle.finish('root',0);
    admit(receipt(input));
    await rejected;await finishing;
    expect(update.mock.calls.map(([action])=>action)).toEqual(['admit','release']);
    expect(vi.getTimerCount()).toBe(0);
  });
});
