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

for (const phase of ['pre-admission', 'running-exhaustion'] as const) {
  test(`RUN-010: ${phase} reconnect never submits and manual retry retains its workspace`, async ({ page, toolsDev }, testInfo) => {
    test.skip(!fixturePath, 'Needs the explicitly owned shared-task-leases sandbox');
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
      VELA_API_URL: fixture.urls.api, VELA_LINK_URL: fixture.urls.link, OD_NEXT_STRATEGY_ROLLOUT: 'off', OD_WORKSPACE_CONTEXT_SOURCE: 'vela',
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
      id: randomUUID(), name: 'Final admission draft', metadata: { kind: 'prototype' }, skillId: null, designSystemId: null,
    } });
    expect(created.ok(), await created.text()).toBeTruthy();
    const project = await created.json() as { project: { id: string } };
    let runId: string | undefined;
    let queueStatus: number | undefined;
    let retryRunId: string | undefined;
    const submissions: { workspace: string | undefined; body: unknown }[] = [];
    page.on('request', request => {
      if (request.method() === 'POST' && new URL(request.url()).pathname === '/api/runs') {
        submissions.push({ workspace: request.headers()['x-od-workspace-id'], body: request.postDataJSON() });
      }
    });
    // This barrier only changes the owned fixture between the real preflight and
    // final admission. Both HTTP responses come from the actual daemon/API.
    if (phase === 'pre-admission') await page.route('**/api/runs', async route => {
      if (route.request().method() !== 'POST') return route.continue();
      await control('balance', { credits: 0 });
      const response = await route.fetch();
      queueStatus = response.status();
      runId = (await response.json() as { runId?: string }).runId;
      await route.fulfill({ response });
    });
    try {
      await control('hold', { hold: false });
      await control('tool-round', { enabled: phase === 'running-exhaustion' });
      await control('balance', { credits: phase === 'running-exhaustion' ? 10 : 1000000 });
      const before = await control('evidence');
      await page.goto(toolsDev.url.web(`/projects/${project.project.id}`), { waitUntil: 'domcontentloaded' });
      await dismissPrivacyDialog(page);
      await expectWorkspaceReady(page);
      await page.getByTestId('chat-file-input').setInputFiles({ name: 'draft-context.txt', mimeType: 'text/plain', buffer: Buffer.from('Retain this exact attachment when final admission rejects.') });
      await expect(page.getByTestId('staged-attachments').locator('.msg-att-doc[title="draft-context.txt"]')).not.toHaveClass(/is-up|is-fail/);
      const prompt = `Preserve this rejected draft ${randomUUID()}`;
      const firstQueued = page.waitForResponse(response => response.request().method() === 'POST' && new URL(response.url()).pathname === '/api/runs');
      await sendPrompt(page, prompt);
      const firstResponse = await firstQueued;
      queueStatus = firstResponse.status();
      runId = (await firstResponse.json() as { runId: string }).runId;
      await expect.poll(() => runId, { timeout: 30_000 }).toBeTruthy();
      expect(queueStatus).toBe(202);
      await expect.poll(async () => (await (await page.request.get(toolsDev.url.web(`/api/runs/${runId}`), { headers })).json()).status, { timeout: T.xlong }).toBe('failed');
      const run = await (await page.request.get(toolsDev.url.web(`/api/runs/${runId}`), { headers })).json();
      const after = await control('evidence');
      await testInfo.attach('initial-failure-evidence', { body: JSON.stringify({ phase, runId, run, before, after }), contentType: 'application/json' });
      if (phase === 'pre-admission') {
        expect(run).toMatchObject({ status: 'failed', errorCode: 'insufficient_balance', childPid: null });
        await expect(page.getByTestId('chat-composer-input')).toHaveText(prompt);
        await expect(page.getByTestId('staged-attachments')).toContainText('draft-context.txt');
        expect(after.providerCalls).toBe(before.providerCalls);
      } else {
        expect(Number(after.providerCalls) - Number(before.providerCalls)).toBe(1);
        expect(Number((after.wallet as { wallet_debt_credits: string }).wallet_debt_credits)).toBeGreaterThan(0);
        await expect(page.getByTestId('amr-balance-dialog')).toBeVisible();
      }
      await page.unroute('**/api/runs');
      // RUN-010: disconnect the real browser transport, restore funding while it
      // cannot receive events, then reconnect without clicking send/retry.
      const submissionCount = submissions.length;
      await page.context().setOffline(true);
      expect(await page.evaluate(() => navigator.onLine)).toBe(false);
      await control('balance', { credits: 1000000 });
      await page.context().setOffline(false);
      expect(await page.evaluate(() => navigator.onLine)).toBe(true);
      const reconnected = await page.request.get(toolsDev.url.web('/api/health'));
      expect(reconnected.ok()).toBeTruthy();
      // This real observation window protects browser reconnect/SSE scheduling;
      // a virtual clock cannot drive the separate daemon and browser transports.
      const reconnectDeadline = Date.now() + T.short;
      do {
        const snapshot = await control('evidence');
        expect(snapshot.providerCalls).toBe(after.providerCalls);
        expect(snapshot.runs).toEqual(after.runs);
        expect(submissions).toHaveLength(submissionCount);
        if (phase === 'pre-admission') {
          await expect(page.getByTestId('chat-composer-input')).toHaveText(prompt);
          await expect(page.getByTestId('staged-attachments')).toContainText('draft-context.txt');
        }
      } while (Date.now() < reconnectDeadline);
      await testInfo.attach('RUN-010-reconnect-without-submit', { body: JSON.stringify({
        amrSha: fixture.sourceSha, runId, workspace: fixture.workspace,
        phase, observationMs: T.short, submissions: submissionCount, providerCalls: after.providerCalls,
        scope: 'real offline/reconnect after final-admission rejection or running debt; manual retry in original workspace',
      }), contentType: 'application/json' });
      await control('tool-round', { enabled: false });
      const dialog = page.getByTestId('amr-balance-dialog');
      if (await dialog.isVisible()) await dialog.getByRole('button', { name: 'Not now', exact: true }).click();
      const queued = page.waitForResponse(response => response.request().method() === 'POST'
        && new URL(response.url()).pathname === '/api/runs');
      if (phase === 'pre-admission') await page.getByTestId('chat-composer-input').press('Enter');
      else await page.getByTestId('chat-error-retry').click();
      const accepted = await queued;
      expect(accepted.status()).toBe(202);
      retryRunId = (await accepted.json() as { runId: string }).runId;
      expect(retryRunId).not.toBe(runId);
      expect(submissions).toHaveLength(submissionCount + 1);
      expect(submissions.at(-1)?.workspace).toBe(fixture.workspace);
      await expect(page.getByTestId('chat-send-pending')).toHaveCount(0, { timeout: 30_000 });
      await expect(page.getByTestId('chat-composer-input')).toHaveText('');
      await expect(page.getByTestId('staged-attachments')).toHaveCount(0);
      await expect.poll(async () => (await (await page.request.get(toolsDev.url.web(`/api/runs/${retryRunId}`), { headers })).json()).status, { timeout: T.xlong }).toBe('succeeded');
      const final = await control('evidence');
      expect(Number(final.providerCalls) - Number(after.providerCalls)).toBe(1);
      const priorRequests = new Set((before.usage as { request_id: string }[]).map(row => row.request_id));
      const usage = (final.usage as { request_id: string; charge_credits: string; success: boolean }[]).filter(row => !priorRequests.has(row.request_id));
      const settlements = final.settlements as { request_id: string; amount: string }[];
      expect(new Set(usage.map(row => row.request_id)).size).toBe(usage.length);
      for (const row of usage.filter(row => row.success && Number(row.charge_credits) > 0)) {
        const records = settlements.filter(record => record.request_id === row.request_id);
        expect(records).toHaveLength(1);
        expect(records[0]?.amount).toBe(row.charge_credits);
      }
      const events = await page.request.get(toolsDev.url.web(`/api/runs/${retryRunId}/events`), { headers });
      expect((await events.text()).match(/^event: start$/gm)).toHaveLength(1);
      await testInfo.attach('successful-retry-evidence', { body: JSON.stringify({ phase, amrSha: fixture.sourceSha,
        initialRunId: runId, retryRunId, workspace: fixture.workspace, submissions, usage, final, starts: 1 }), contentType: 'application/json' });
    } finally {
      await page.context().setOffline(false);
      if (retryRunId) await page.request.post(toolsDev.url.web(`/api/runs/${retryRunId}/cancel`), { headers, data: {} }).catch(() => undefined);
      await control('hold', { hold: false });
      await control('tool-round', { enabled: false });
      await control('balance', { credits: 1000000 });
    }
  });

}
