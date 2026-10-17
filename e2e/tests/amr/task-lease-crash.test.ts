import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { T } from '@/timeouts';
import { createToolsDevSuite } from '@/tools-dev/runtime';
import type { ToolsDevSuite } from '@/tools-dev/types';
import { requestJson } from '@/vitest/http';
import { createSmokeSuite } from '@/vitest/suite';

type LeaseRow = {
  open_design_run_id: string; admission_state: string;
  lease_expires_at: string; last_heartbeat_at: string; lease_attempt: string;
};
type Evidence = { providerCalls: number; pendingProvider: number; runs: LeaseRow[] };
type Fixture = {
  name: string; sourceSha: string; fixtureUrl: string; fixtureToken: string;
  workspace: string; velaBin: string; opencodeBin: string;
  urls: { api: string; link: string };
  profiles: { owner: { home: string; memberId: string; controlKey: string } };
};
const fixturePath = process.env.OD_TASK_NETWORK_FIXTURE;

test.skipIf(!fixturePath)('RUN-009: crashed host expires naturally while another host keeps its lease', async () => {
  const fixture = JSON.parse(readFileSync(fixturePath!, 'utf8')) as Fixture;
  expect(fixture.name).toBe('shared-task-runtime-boundaries');
  const suites = await Promise.all([createSmokeSuite('task-crash-a'), createSmokeSuite('task-crash-b')]);
  const hosts = suites.map(suite => createToolsDevSuite(suite));
  const headers = { 'x-od-workspace-id': fixture.workspace, 'x-od-workspace-member-id': fixture.profiles.owner.memberId };
  const env = { AMR_HOME: fixture.profiles.owner.home, VELA_PROFILE: 'local',
    VELA_API_URL: fixture.urls.api, VELA_LINK_URL: fixture.urls.link,
    OD_WORKSPACE_CONTEXT_SOURCE: 'vela', OD_NEXT_STRATEGY_ROLLOUT: 'off' };
  const control = async <R = Evidence>(action: string, body: object = {}): Promise<R> => {
    const response = await fetch(`${fixture.fixtureUrl}/control/${action}`, {
      method: 'POST', headers: { authorization: `Bearer ${fixture.fixtureToken}`, 'content-type': 'application/json' },
      body: JSON.stringify(body), signal: AbortSignal.timeout(T.long),
    });
    expect(response.ok, await response.clone().text()).toBe(true);
    return response.json() as Promise<R>;
  };
  const readRun = (host: ToolsDevSuite, runId: string) => requestJson<{ status: string; errorCode?: string }>(host.url.daemon(), `/api/runs/${runId}`, { headers });
  const createProject = (host: ToolsDevSuite) => requestJson<{ project: { id: string } }>(host.url.daemon(), '/api/projects', {
    headers, body: { id: randomUUID(), name: 'Natural lease expiry', skillId: null, designSystemId: null, metadata: { kind: 'prototype' } },
  });
  const startRun = (host: ToolsDevSuite, projectId: string) => requestJson<{ runId: string }>(host.url.daemon(), '/api/runs', {
    headers, body: { projectId, agentId: 'amr', model: 'deepseek-v4.1-flash', clientRequestId: randomUUID(), message: 'Hold this owned runtime task.' },
  });
  let success = false;
  let failure: unknown;
  const observations: unknown[] = [];
  const survivingRuns: string[] = [];
  try {
    await control('capacity', { limit: 2 });
    await control('balance', { credits: 1000000 });
    await control('hold', { hold: true });
    const starts = [];
    for (const host of hosts) {
      starts.push(await host.startWeb(env));
      await requestJson(host.url.daemon(), '/api/app-config', { method: 'PUT', body: {
        mode: 'daemon', agentId: 'amr', skillId: null, designSystemId: null, onboardingCompleted: true, privacyDecisionAt: 1,
        agentModels: { amr: { model: 'deepseek-v4.1-flash', reasoning: 'default' } },
        agentCliEnv: { amr: { VELA_BIN: fixture.velaBin, VELA_OPENCODE_BIN: fixture.opencodeBin,
          OPENCODE_DISABLE_DEFAULT_PLUGINS: '1', OPENCODE_DISABLE_EXTERNAL_SKILLS: '1' } },
        telemetry: { artifactManifest: false, content: false, metrics: false },
      } });
    }
    const projects = await Promise.all(hosts.map(createProject));
    const a = await startRun(hosts[0]!, projects[0]!.project.id);
    const b = await startRun(hosts[1]!, projects[1]!.project.id);
    survivingRuns.push(b.runId);
    await expect.poll(async () => (await control('evidence')).pendingProvider, { timeout: T.xlong }).toBe(2);
    const blockedProject = await createProject(hosts[1]!);
    const blocked = await startRun(hosts[1]!, blockedProject.project.id);
    await expect.poll(async () => (await readRun(hosts[1]!, blocked.runId)).status, { timeout: T.long }).toBe('failed');
    expect((await readRun(hosts[1]!, blocked.runId)).errorCode).toBe('workspace_task_concurrency_exceeded');
    const before = await control('evidence');
    const oldToken = await control<{ lease_token: string; lease_attempt: string }>('lease', { runId: a.runId });
    const aliveLease = before.runs.find(row => row.open_design_run_id === b.runId)!;
    const daemon = starts[0]!.daemon!;
    expect(daemon.created).toBe(true);
    const ownedPids = [...new Set([daemon.pid, daemon.status.pid])];
    expect(ownedPids.every(pid => Number.isInteger(pid) && pid! > 1 && pid !== process.pid)).toBe(true);
    // Both PIDs come from this suite's canonical start receipt. Kill supervisor
    // first so it cannot restart the owned daemon; no graceful terminal/release.
    for (const pid of ownedPids) {
      try { process.kill(pid!, 'SIGKILL'); } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
      }
    }
    const crashed = await control('evidence');
    const crashedLease = crashed.runs.find(row => row.open_design_run_id === a.runId)!;
    expect(Date.parse(crashedLease.lease_expires_at) - Date.parse(crashedLease.last_heartbeat_at)).toBe(90_000);
    observations.push({ phase: 'crashed', at: new Date().toISOString(), ownedPids, before, crashed });
    // Real 90s lease/30s heartbeat budget: never mutate lease_expires_at or use
    // a virtual clock in this cross-process acceptance witness.
    await expect.poll(async () => {
      const state = await control('evidence');
      const dead = state.runs.find(row => row.open_design_run_id === a.runId)!;
      const alive = state.runs.find(row => row.open_design_run_id === b.runId)!;
      expect(dead.last_heartbeat_at).toBe(crashedLease.last_heartbeat_at);
      expect(dead.admission_state).toBe('running');
      expect(state.providerCalls).toBe(before.providerCalls);
      expect((await readRun(hosts[1]!, blocked.runId)).status).toBe('failed');
      observations.push({ phase: 'waiting', at: new Date().toISOString(), dead, alive });
      return Date.parse(dead.lease_expires_at) <= Date.now()
        && Date.parse(alive.last_heartbeat_at) > Date.parse(aliveLease.last_heartbeat_at)
        && Date.parse(alive.lease_expires_at) > Date.now();
    }, { timeout: T.xlong * 2, interval: 1000 }).toBe(true);
    const stale = await fetch(`${fixture.urls.api}/api/v1/open-design/runs/${a.runId}/lease/heartbeat`, {
      method: 'POST', headers: { authorization: `Bearer ${fixture.profiles.owner.controlKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ workspaceId: fixture.workspace, leaseToken: oldToken.lease_token, attempt: Number(oldToken.lease_attempt) }),
      signal: AbortSignal.timeout(T.long),
    });
    expect(stale.status).toBe(409);
    const retried = await startRun(hosts[1]!, blockedProject.project.id);
    survivingRuns.push(retried.runId);
    await expect.poll(async () => (await control('evidence')).providerCalls, { timeout: T.xlong }).toBe(before.providerCalls + 1);
    const after = await control('evidence');
    const live = after.runs.filter(row => row.admission_state === 'running' && Date.parse(row.lease_expires_at) > Date.now());
    expect(live.map(row => row.open_design_run_id).sort()).toEqual([b.runId, retried.runId].sort());
    observations.push({ phase: 'manual-retry', retried: retried.runId, staleTokenStatus: stale.status, after });
    success = true;
  } catch (error) { failure = error; throw error; }
  finally {
    await suites[0]!.report.json('RUN-009.json', { amrSha: fixture.sourceSha, observations, success });
    const cleanupErrors: string[] = [];
    const cleanup = async (action: () => Promise<unknown>) => {
      try { await action(); } catch (error) { cleanupErrors.push(String(error)); }
    };
    for (const runId of survivingRuns) await cleanup(() => requestJson(hosts[1]!.url.daemon(), `/api/runs/${runId}/cancel`, { headers, body: {} }));
    await cleanup(() => control('release'));
    await cleanup(() => control('capacity', { limit: 1 }));
    for (const host of hosts) await cleanup(() => host.stopWeb());
    for (const suite of suites) {
      await suite.report.json('cleanup.json', { cleanupErrors });
      console.log(await suite.finalize({ success: success && cleanupErrors.length === 0, error: failure ?? cleanupErrors[0] }));
    }
    if (success) expect(cleanupErrors).toEqual([]);
  }
}, T.xlong * 7);
