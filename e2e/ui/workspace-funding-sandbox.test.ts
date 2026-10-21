import { clusterTest as test, expect } from '@/playwright/suite';
import { holdRealBilling, startFundingClient } from '@/playwright/workspace-funding-client';
import { fundingHeaders } from '@/playwright/workspace-funding-fixture';
import { T } from '@/timeouts';

// This file belongs exclusively to lib/playwright/funding.config.ts. It is a real
// local AMR integration lane, not a route-mocked substitute for QA VIEW-015.
test.use({ viewport: { width: 1280, height: 800 } });
test.describe.configure({ timeout: T.xlong * 5 });

for (const surface of ['project', 'home'] as const) {
  test(`[P0] VIEW-015 ${surface} keeps B draft and rejects stale funded A after B insufficient`, async ({ page }, info) => {
    const client = await startFundingClient(page, info);
    let timing: ReturnType<typeof holdRealBilling> | undefined;
    try {
      const { fixture, runtime } = client;
      const A = fixture.spaces.funded;
      const B = fixture.spaces.empty;
      const projectId = await client.createProject(B);
      // Visit once so the real Recent entry exists. Creating a project through
      // HTTP alone does not establish a browser navigation-history entry.
      await page.goto(runtime.url.web(`/projects/${projectId}`), { waitUntil: 'domcontentloaded', timeout: T.xlong });
      await expect(page.getByTestId('chat-composer-input')).toBeVisible({ timeout: T.xlong });
      await page.getByRole('button', { name: 'Home', exact: true }).click({ timeout: T.medium });
      await expect(page.getByTestId('home-hero-input')).toBeVisible({ timeout: T.xlong });
      await client.select(fixture.spaces.dp);
      timing = holdRealBilling(page, [A.workspaceId, B.workspaceId]);
      await timing.install;
      await client.select(A);
      await expect.poll(() => timing!.held.filter(row => row.workspaceId === A.workspaceId).length,
        { timeout: T.medium }).toBeGreaterThan(0);
      await client.select(B);
      await expect.poll(() => timing!.held.filter(row => row.workspaceId === B.workspaceId).length,
        { timeout: T.medium }).toBeGreaterThan(0);
      if (surface === 'project') {
        await page.locator(`[data-project-id="${projectId}"]`).getByTestId('entry-nav-recent-item').click({ timeout: T.medium });
        await expect(page.getByTestId('chat-composer-input')).toBeVisible({ timeout: T.xlong });
      }
      const input = page.getByTestId(surface === 'home' ? 'home-hero-input' : 'chat-composer-input');
      const send = page.getByTestId(surface === 'home' ? 'home-hero-submit' : 'chat-send');
      const draft = `VIEW015 ${surface} B must never borrow A funds`;
      await input.fill(draft);
      const originalPath = new URL(page.url()).pathname;
      const postStart = client.posts.length;
      const enabledWhilePending = await send.isEnabled();
      if (enabledWhilePending) await send.click({ timeout: T.medium });
      await client.attach('pending-B-after-submit', {
        surface, enabledWhilePending, originalPath, actualPath: new URL(page.url()).pathname,
        posts: client.posts.slice(postStart),
      });
      timing.stopHolding();
      // Network completion is awaited at the browser, not only route.fulfill.
      // The original response bodies are delivered without modifying bytes.
      await timing.release(B.workspaceId);
      if (!enabledWhilePending) {
        await expect(send).toBeEnabled({ timeout: T.medium });
        await send.click({ timeout: T.medium });
      }
      const dialog = page.getByTestId('amr-balance-dialog');
      await expect(dialog).toBeVisible({ timeout: T.medium });
      const bVisibleAt = Date.now();
      // Keep the Home red oracle. Optimistic bubbles/Queued1 do not satisfy
      // the original-page input-preservation requirement.
      expect.soft(new URL(page.url()).pathname, 'Rejected input remains on the originating page').toBe(originalPath);
      await expect.soft(input).toHaveText(draft, { timeout: T.short });
      // Modal implementations may legitimately lock the background composer.
      // Editability is required after dismissal, observed only while open.
      const backgroundInputEditable = await input.isEditable({ timeout: T.short }).catch(() => null);
      expect.soft(client.posts.slice(postStart).filter(row => row.path === '/api/runs'), 'Insufficient B cannot enqueue a run').toEqual([]);
      await timing.release(A.workspaceId);
      const aCompletedAt = Date.now();
      expect(aCompletedAt).toBeGreaterThanOrEqual(bVisibleAt);
      const aRows = timing.held.filter(row => row.workspaceId === A.workspaceId);
      const deliveredA = aRows.filter(row => row.browserStatus === 200 && row.browserCompletedAt !== null);
      expect(deliveredA.length, 'At least one original A HTTP200 must actually complete at the browser after B is visible').toBeGreaterThan(0);
      for (const row of aRows) {
        if (row.requestFailure) {
          expect(['net::ERR_ABORTED', 'ERR_ABORTED']).toContain(row.requestFailure);
          expect(row.browserCompletedAt).toBeNull();
        } else {
          expect(row.browserStatus).toBe(200);
          expect(row.browserCompletedAt).not.toBeNull();
          expect(row.browserCompletedAt!).toBeGreaterThanOrEqual(bVisibleAt);
        }
      }
      await expect(dialog).toBeVisible({ timeout: T.medium });
      await expect.soft(input).toHaveText(draft, { timeout: T.short });
      expect.soft(client.posts.slice(postStart).filter(row => row.path === '/api/runs')).toEqual([]);
      await client.attach('B-before-A-unchanged-real-responses', {
        surface, bVisibleAt, aCompletedAt,
        responses: timing.held.map(({ workspaceId, path, sha256, upstreamFetchedAt, browserCompletedAt, browserStatus, requestFailure }) =>
          ({ workspaceId, path, sha256, upstreamFetchedAt, browserCompletedAt, browserStatus, requestFailure })),
        responseBodiesModified: false, posts: client.posts.slice(postStart), wholeQaPassed: false,
        // Diagnostics, not extra QA requirements. A local project or an
        // internal queue alone does not establish model execution/input loss.
        queuedBannerVisible: await page.getByTestId('queued-send-banner').isVisible(),
        backgroundInputEditable,
      });
      await dialog.getByRole('button', { name: /Not now/i }).click({ timeout: T.medium });
      await expect.soft(input).toHaveText(draft, { timeout: T.short });
      await expect.soft(input).toBeEditable({ timeout: T.short });
      expect.soft(new URL(page.url()).pathname).toBe(originalPath);
    } finally {
      try { await timing?.dispose(); }
      finally { await client.close(); }
    }
  });
}

test('[P0] VIEW-015 cash0 with real available Design Plan completes one correctly scoped run', async ({ page }, info) => {
  const client = await startFundingClient(page, info);
  let runId: string | undefined;
  let terminal = false;
  try {
    await page.goto(client.runtime.url.web('/'), { waitUntil: 'domcontentloaded', timeout: T.xlong });
    await expect(page.getByTestId('home-hero-input')).toBeVisible({ timeout: T.xlong });
    await client.select(client.fixture.spaces.dp);
    await page.getByTestId('home-hero-input').fill('VIEW015 cash0 actual available Design Plan');
    await expect(page.getByTestId('home-hero-submit')).toBeEnabled({ timeout: T.medium });
    const before = client.posts.length;
    const created = page.waitForResponse(r => r.request().method() === 'POST'
      && new URL(r.url()).pathname === '/api/runs', { timeout: T.medium });
    await page.getByTestId('home-hero-submit').click({ timeout: T.medium });
    const response = await created;
    const body = await response.json() as { runId?: string; run?: { id: string }; id?: string };
    runId = body.runId ?? body.run?.id ?? body.id;
    expect(response.status()).toBe(202);
    expect(typeof runId).toBe('string');
    expect(client.posts.slice(before).filter(row => row.path === '/api/runs')).toEqual([
      { path: '/api/runs', workspaceId: client.fixture.spaces.dp.workspaceId },
    ]);
    await client.attach('cash0-DP-submit-boundary', {
      status: response.status(), runId, workspaceId: client.fixture.spaces.dp.workspaceId,
      modelExecutionVerified: false, wholeQaPassed: false,
    });
    const observations: Array<{ observedAt: string; status: string }> = [];
    let result: { status: string; exitCode?: number; error?: string; terminalAt?: number } | undefined;
    try {
      await expect.poll(async () => {
        const status = await fetch(client.runtime.url.web(`/api/runs/${runId}`), {
          headers: fundingHeaders(client.fixture.spaces.dp), signal: AbortSignal.timeout(T.short),
        });
        expect(status.ok, 'Read this actual client-created run').toBe(true);
        result = await status.json() as typeof result;
        observations.push({ observedAt: new Date().toISOString(), status: result!.status });
        terminal = ['succeeded', 'failed', 'canceled'].includes(result!.status);
        return terminal;
      }, { timeout: T.xlong, intervals: [250, 500, 1_000] }).toBe(true);
      expect(result!.status, 'A scoped HTTP202 alone does not prove a model completed').toBe('succeeded');
      const events = await fetch(client.runtime.url.web(`/api/runs/${runId}/events`), {
        headers: fundingHeaders(client.fixture.spaces.dp), signal: AbortSignal.timeout(T.short),
      });
      expect(events.ok, 'Capture actual completed-run events before owned runtime cleanup').toBe(true);
      const eventText = await events.text();
      await info.attach('cash0-DP-completed-run-events', { body: eventText, contentType: 'text/plain' });
      await client.attach('cash0-DP-stop-reason-observation', {
        runId, endTurnStringObserved: /["']stopReason["']\s*:\s*["']end_turn["']/.test(eventText),
        // Event shape is observed, not imposed as a new product requirement.
        wholeQaPassed: false,
      });
    } finally {
      await client.attach('cash0-DP-actual-run-terminal', {
        runId, workspaceId: client.fixture.spaces.dp.workspaceId, result, observations,
        // Final CLI end_turn + canonical usage/DP-window increase + zero cash
        // charge are independently reconciled by the AMR environment owner.
        independentAccountingReviewRequired: true, wholeQaPassed: false,
      });
    }
  } finally {
    try {
      if (runId && !terminal) {
        const canceled = await fetch(client.runtime.url.web(`/api/runs/${runId}/cancel`), { method: 'POST' });
        expect(canceled.ok, 'Clean only this test-created run').toBe(true);
      }
    } finally { await client.close(); }
  }
});
