import { randomUUID } from 'node:crypto';
import { createCollabCluster, type CollabCluster } from '@/playwright/collab-cluster';
import { startFakeCollabHub } from '@/playwright/fake-collab-hub';
import { applyStandardMocks } from '@/playwright/mock-factory';
import { clusterTest as test, expect } from '@/playwright/suite';

test('[P1] owner device offers page-entry and SSE updates with scoped 24h consent', async ({ browser }, testInfo) => {
  test.setTimeout(360_000);
  const workspaceId = 'ws-owner-device-ui';
  const owner = { controlKey: 'owner-device-ui-key', memberId: 'mem-owner-device-ui', name: 'Owner', role: 'owner' as const };
  const hub = await startFakeCollabHub({ root: testInfo.outputPath('hub'), workspaceId, workspaceName: 'Device sync', clients: [owner] });
  const velaBin = await hub.writeVelaBin(testInfo.outputPath('vela'));
  const env = { OD_COLLAB_TRANSPORT: 'vela-cli', OD_RESOURCE_TRANSPORT: 'vela-cli', OD_TEAM_PROJECTS_TRANSPORT: 'vela-cli', OD_WORKSPACE_CONTEXT_SOURCE: 'vela', VELA_API_URL: hub.url, VELA_BIN: velaBin, VELA_CONTROL_KEY: owner.controlKey, AMR_HOME: testInfo.outputPath('empty-amr-home') };
  const headers = { 'x-od-workspace-id': workspaceId, 'x-od-workspace-member-id': owner.memberId, 'x-od-workspace-type': 'team', 'x-od-workspace-role': 'owner', 'x-od-workspace-member-status': 'active', 'x-od-workspace-lifecycle-state': 'active', 'x-od-workspace-can-share-projects': 'true', 'x-od-workspace-can-write-synced-files': 'true' };
  const id = randomUUID();
  let cluster: CollabCluster | undefined;
  let failed = false;
  try {
    cluster = await createCollabCluster(browser, testInfo, [{ id: 'a', env }, { id: 'b', env }]);
    const a = cluster.clients.a!.page;
    const b = cluster.clients.b!.page;
    for (const page of [a, b]) {
      await applyStandardMocks(page);
      const pin = await page.request.put('/api/workspace/active', { data: { workspaceId, workspaceMemberId: owner.memberId } });
      expect(pin.ok(), await pin.text()).toBeTruthy();
      await page.request.get(`/api/workspace/billing?scope=workspace&workspaceId=${workspaceId}`, { headers });
    }
    await b.goto('/');
    await expect(b.getByText('Loading OpenDesign…')).toHaveCount(0, { timeout: 60_000 });
    const created = await a.request.post('/api/projects', { headers, data: { id, name: 'Owner device cloud update', skillId: null, designSystemId: null, metadata: { kind: 'prototype' } } });
    expect(created.ok(), await created.text()).toBeTruthy();
    async function writeAndPublish(heading: string, publish = true) {
      const written = await a.request.post(`/api/projects/${id}/files`, { headers, data: { name: 'index.html', content: `<!doctype html><html><body><h1>${heading}</h1></body></html>` } });
      expect(written.ok(), await written.text()).toBeTruthy();
      if (publish) {
        const published = await a.request.post(`/api/projects/${id}/collab/publish`, { headers });
        expect(published.ok(), await published.text()).toBeTruthy();
      }
    }
    await writeAndPublish('First version', false);
    const moved = await a.request.post(`/api/workspaces/${workspaceId}/projects/${id}/move`, { headers, data: { visibility: 'team' } });
    expect(moved.ok(), await moved.text()).toBeTruthy();
    await expect.poll(async () => {
      const r = await b.request.get(`/api/projects/${id}/collab/status`, { headers });
      return r.ok() && !(await r.json()).awaitingFirstMaterialization;
    }, { timeout: 30_000 }).toBe(true);
    const entryCheck = b.waitForRequest(request => request.url().endsWith(`/api/projects/${id}/collab/update`) && request.method() === 'POST' && request.postDataJSON()?.action === 'check');
    await b.goto(`/projects/${id}/files/index.html`);
    const controls = b.getByTestId('owned-content-update');
    await expect(controls).toBeVisible({ timeout: 60_000 });
    await entryCheck;
    await b.screenshot({ path: testInfo.outputPath('owner-update-check-entry.png'), animations: 'disabled' });
    await testInfo.attach('Owner manual check entrypoint', { path: testInfo.outputPath('owner-update-check-entry.png'), contentType: 'image/png' });
    await expect(b.getByRole('alertdialog')).toHaveCount(0);
    await expect.poll(() => hub.eventSubscriberCount(owner.memberId), { timeout: 20_000 }).toBeGreaterThanOrEqual(2);
    await writeAndPublish('SSE version');
    const dialog = b.getByRole('alertdialog', { name: 'Cloud update available' });
    await expect(dialog).toBeVisible({ timeout: 30_000 });
    await b.screenshot({ path: testInfo.outputPath('owner-update-entrypoint.png'), animations: 'disabled' });
    await testInfo.attach('Owner update entrypoint', { path: testInfo.outputPath('owner-update-entrypoint.png'), contentType: 'image/png' });
    await dialog.getByRole('button', { name: 'Not now', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await b.reload();
    await expect(controls).toBeVisible({ timeout: 60_000 });
    await expect(dialog).toHaveCount(0);
    await controls.getByRole('button', { name: 'Check cloud updates' }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('checkbox').check();
    await dialog.getByRole('button', { name: 'Replace with cloud version' }).click();
    await expect(dialog).toHaveCount(0, { timeout: 30_000 });
    await expect(controls.getByRole('button', { name: 'Ask before updates' })).toBeVisible();
    await writeAndPublish('Automatic version');
    await expect.poll(async () => (await b.request.get(`/api/projects/${id}/raw/index.html`, { headers })).text(), { timeout: 30_000 }).toContain('Automatic version');
    await expect(dialog).toHaveCount(0);
    await controls.getByRole('button', { name: 'Ask before updates' }).click();
    await expect(controls.getByRole('button', { name: 'Ask before updates' })).toHaveCount(0);
  } catch (error) { failed = true; throw error; }
  finally { await cluster?.close({ preserve: failed }); await hub.close(); }
});
