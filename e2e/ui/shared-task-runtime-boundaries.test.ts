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
    expect(response.ok).toBeTruthy();
    return response.json() as Promise<Record<string, unknown>>;
  };
  await toolsDev.stopWeb();
  await toolsDev.startWeb({
    AMR_HOME: fixture.profiles.owner.home, VELA_PROFILE: 'local',
    VELA_API_URL: fixture.urls.api, VELA_LINK_URL: fixture.urls.link, OD_NEXT_STRATEGY_ROLLOUT: 'off',
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
  const walletEvents: { receivedAt: string; data: unknown }[] = [];
  cdp.on('Network.eventSourceMessageReceived', event => {
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
      }
    }
  } finally {
    await testInfo.attach('RUN-005-tool-boundary-evidence', { body: JSON.stringify({
      amrSha: fixture.sourceSha, source: 'real OD/CLI/Link/API; local model provider',
      evidence, walletEvents,
      notificationLatency: 'raw client receipt timestamps only; server emission correlation still required',
    }), contentType: 'application/json' });
    for (const runId of runs) await page.request.post(toolsDev.url.web(`/api/runs/${runId}/cancel`), { headers, data: {} }).catch(() => undefined);
    await control('tool-round', { enabled: false });
    await control('balance', { credits: 1000000 });
    await cdp.detach();
  }
});
