import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { test, expect } from '@/playwright/suite';
import { seedBrowserConfig, expectWorkspaceReady, dismissPrivacyDialog, sendPrompt } from '@/playwright/amr';
import { warmPlaywrightDaemonRuntime, warmPlaywrightWebRuntime } from '@/playwright/runtime-lifecycle';
import { T } from '@/timeouts';

type Fixture = {
  name: string; sourceSha: string; fixtureUrl: string; fixtureToken: string;
  workspace: string; velaBin: string; opencodeBin: string;
  urls: { api: string; link: string }; profiles: { owner: { home: string; memberId: string } };
};
const fixturePath = process.env.OD_TASK_NETWORK_FIXTURE;

test('RUN-005: a real tool round continues with funds and cannot call the provider after exhaustion', async ({ page, toolsDev }, testInfo) => {
  test.skip(!fixturePath, 'Needs an exclusively owned task network sandbox');
  test.setTimeout(T.xlong * 4);
  const fixture = JSON.parse(readFileSync(fixturePath!, 'utf8')) as Fixture;
  expect(['shared-task-leases', 'shared-task-runtime-boundaries']).toContain(fixture.name);
  expect(new URL(fixture.fixtureUrl).hostname).toBe('127.0.0.1');
  const control = async (action: string, body: object = {}) => {
    const response = await fetch(`${fixture.fixtureUrl}/control/${action}`, {
      method: 'POST', headers: { authorization: `Bearer ${fixture.fixtureToken}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    expect(response.ok, await response.clone().text()).toBeTruthy();
    return response.json() as Promise<Record<string, unknown>>;
  };
  await toolsDev.stopWeb();
  await toolsDev.startWeb({
    AMR_HOME: fixture.profiles.owner.home, VELA_PROFILE: 'local',
    VELA_API_URL: fixture.urls.api, VELA_LINK_URL: fixture.urls.link, OD_NEXT_STRATEGY_ROLLOUT: 'off',
    OD_WORKSPACE_CONTEXT_SOURCE: 'vela',
  });
  await warmPlaywrightDaemonRuntime(toolsDev.url.daemon('/api/health'));
  await warmPlaywrightWebRuntime(toolsDev.url.web('/'));
  await page.unroute('**/api/integrations/vela/status*');
  const config = {
    mode: 'daemon', agentId: 'amr', skillId: null, designSystemId: null, onboardingCompleted: true,
    privacyDecisionAt: 1,
    agentModels: { amr: { model: 'deepseek-v4.1-flash', reasoning: 'default' } },
    agentCliEnv: { amr: { VELA_BIN: fixture.velaBin, VELA_OPENCODE_BIN: fixture.opencodeBin,
      OPENCODE_DISABLE_DEFAULT_PLUGINS: '1', OPENCODE_DISABLE_EXTERNAL_SKILLS: '1' } },
    telemetry: { artifactManifest: false, content: false, metrics: false },
  };
  const configured = await page.request.put(toolsDev.url.web('/api/app-config'), { data: config });
  expect(configured.ok(), await configured.text()).toBeTruthy();
  await seedBrowserConfig(page, config);
  const headers = { 'x-od-workspace-id': fixture.workspace, 'x-od-workspace-member-id': fixture.profiles.owner.memberId };
  const created = await page.request.post(toolsDev.url.web('/api/projects'), { headers, data: {
    id: randomUUID(), name: 'Tool round balance boundary', metadata: { kind: 'prototype' }, skillId: null, designSystemId: null,
  } });
  expect(created.ok(), await created.text()).toBeTruthy();
  const project = await created.json() as { project: { id: string } };

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  const walletEvents: { receivedAt: string; data: { workspaceId?: string; workspaceMemberId?: string; revision?: string; at?: number } }[] = [];
  const streamFrames: { receivedAt: string; eventName: string; data: string }[] = [];
  const streamRequests: { url: string; at: string }[] = [];
  cdp.on('Network.requestWillBeSent', event => {
    if (event.request.url.includes('/api/workspace/events')) streamRequests.push({ url: event.request.url, at: new Date().toISOString() });
  });
  cdp.on('Network.eventSourceMessageReceived', event => {
    if (['ready', 'wallet-balance-changed', 'billing-changed', 'source-status'].includes(event.eventName)) {
      streamFrames.push({ receivedAt: new Date().toISOString(), eventName: event.eventName, data: event.data });
    }
    if (event.eventName === 'wallet-balance-changed') {
      walletEvents.push({ receivedAt: new Date().toISOString(), data: JSON.parse(event.data) });
    }
  });
  const runs: string[] = [];
  const evidence: unknown[] = [];
  const readRun = async (runId: string) => {
    const response = await page.request.get(toolsDev.url.web(`/api/runs/${runId}`), { headers });
    expect(response.ok()).toBeTruthy();
    return response.json();
  };
  try {
    await control('hold', { hold: false });
    await page.goto(toolsDev.url.web(`/projects/${project.project.id}`), { waitUntil: 'domcontentloaded' });
    await dismissPrivacyDialog(page);
    await expectWorkspaceReady(page);
    for (const credits of [1000000, 1]) {
      await control('balance', { credits });
      await control('tool-round', { enabled: true });
      const before = await control('evidence');
      const queued = page.waitForResponse(response => response.request().method() === 'POST'
        && new URL(response.url()).pathname === '/api/runs');
      await sendPrompt(page, `Execute the controlled tool round ${randomUUID()}`);
      const accepted = await queued;
      expect(accepted.status()).toBe(202);
      const runId = (await accepted.json() as { runId: string }).runId;
      runs.push(runId);
      await expect.poll(async () => (await readRun(runId)).status, { timeout: T.xlong * 2 })
        .toMatch(/succeeded|failed|canceled/);
      const run = await readRun(runId);
      const after = await control('evidence');
      const rounds = (after.providerRounds as { call: number; finishReason: string; toolResultCount: number }[])
        .filter(round => round.call > Number(before.providerCalls));
      evidence.push({ credits, runId, workspace: fixture.workspace, run, before, after, walletEvents: [...walletEvents] });
      expect(rounds[0]?.finishReason).toBe('tool_calls');
      if (credits > 1) {
        expect(run.status).toBe('succeeded');
        expect(rounds).toHaveLength(2);
        expect(rounds[1]?.toolResultCount).toBeGreaterThan(0);
      } else {
        // A success after finish_reason=stop would prove nothing. The funded
        // control above must demonstrate the exact tool response reaches round 2.
        expect(rounds).toHaveLength(1);
        expect(run.status).toBe('failed');
        const usages = after.usage as { charge_credits: string; success: boolean }[];
        const prior = (before.usage as unknown[]).length;
        expect(usages.slice(prior).some(usage => usage.success && Number(usage.charge_credits) > credits)).toBe(true);
        const priorSeqs = new Set((before.sourceEvents as { seq: string }[]).map(event => event.seq));
        const sourceEvents = (after.sourceEvents as { transaction_id: string; seq: string; type: string; payload: {
          at: string; workspaceId: string; workspaceMemberId?: string; revision?: string;
        } }[]).filter(event => event.type === 'wallet-balance-changed' && !priorSeqs.has(event.seq));
        expect(sourceEvents, 'Actual settlement must publish a durable wallet event').not.toHaveLength(0);
        const wallet = after.wallet as { transaction_id: string; wallet_debt_credits: string; wallet_revision: string };
        expect(Number(wallet.wallet_debt_credits)).toBeGreaterThan(0);
        const settlements = after.settlements as { transaction_id: string; request_id: string; wallet_debt_incurred_credits: string }[];
        const debit = settlements.find(row => row.transaction_id === wallet.transaction_id
          && Number(row.wallet_debt_incurred_credits) > 0);
        expect(debit, 'Negative balance must belong to the actual settled usage transaction').toBeDefined();
        const ownerEvents = sourceEvents.filter(event => event.payload.workspaceMemberId === fixture.profiles.owner.memberId
          && event.transaction_id === wallet.transaction_id);
        expect(ownerEvents, 'Notification must target the current legal member').not.toHaveLength(0);
        for (const source of ownerEvents) {
          const matches = (event: typeof walletEvents[number]) => event.data.revision === source.payload.revision
            && event.data.workspaceId === fixture.workspace
            && event.data.workspaceMemberId === fixture.profiles.owner.memberId;
          // Wait for the actual delivery signal, then enforce the source-based
          // deadline below; waiting longer cannot make a late delivery pass.
          await expect.poll(() => walletEvents.some(matches), { timeout: T.short }).toBe(true);
          const received = walletEvents.find(matches);
          expect(received, 'The actual source event must reach the active workspace browser').toBeDefined();
          const latency = Date.parse(received!.receivedAt) - Date.parse(source.payload.at);
          expect(latency).toBeGreaterThanOrEqual(0);
          expect(latency).toBeLessThanOrEqual(1000);
        }
        expect(walletEvents.every(event => event.data.workspaceId === fixture.workspace
          && event.data.workspaceMemberId === fixture.profiles.owner.memberId), 'No wallet event may leak from another member or workspace').toBe(true);
        await expect(page.getByTestId('amr-balance-dialog')).toBeVisible();
        await testInfo.attach('RUN-005-exhausted-dialog', { body: await page.screenshot(), contentType: 'image/png' });
      }
    }
  } finally {
    await testInfo.attach('RUN-005-tool-boundary-evidence', { body: JSON.stringify({
      amrSha: fixture.sourceSha, source: 'real OD/CLI/Link/API; local model provider',
      evidence, walletEvents, streamFrames, streamRequests,
      notificationLatency: 'Negative money/usage/event xmin match; durable source at → browser receipt matched by revision/member/workspace; limit1000ms',
    }), contentType: 'application/json' });
    for (const runId of runs) await page.request.post(toolsDev.url.web(`/api/runs/${runId}/cancel`), { headers, data: {} }).catch(() => undefined);
    await control('tool-round', { enabled: false });
    await control('balance', { credits: 1000000 });
    await cdp.detach();
  }
});
