import { expect, test } from '@/playwright/suite';
import { mockAmrPersonalWorkspace, AMR_PERSONAL_WORKSPACE_CONTEXT, AMR_PERSONAL_WORKSPACE_HEADERS } from '../lib/playwright/amr.js';

function gate() {
  let release!: () => void;
  const promise = new Promise<void>(resolve => { release = resolve; });
  return { promise, release };
}

test.use({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });

test('[P1] OPEND-3791 resource save reaches share checking and read-only retry through watcher/SSE', async ({ page }, testInfo) => {
  const projectId = `share-freshness-${testInfo.workerIndex}-${Date.now()}`;
  await page.addInitScript(() => {
    localStorage.setItem('open-design:locale', 'zh-CN');
    localStorage.setItem('open-design:locale-source', 'manual');
  });
  await mockAmrPersonalWorkspace(page, projectId);
  await page.route(`**/api/projects/${projectId}/collab/status`, route => route.fulfill({ json: {
    publishedVersion: null, materializedVersion: null, syncState: 'local_only',
    ownerMemberId: AMR_PERSONAL_WORKSPACE_CONTEXT.workspaceMemberId,
  } }));
  const project = await page.request.post('/api/projects', { headers: AMR_PERSONAL_WORKSPACE_HEADERS, data: {
    id: projectId, name: '分享新改动检查', skillId: null, designSystemId: null,
    metadata: { kind: 'prototype', nameSource: 'user' },
  } });
  expect(project.ok(), await project.text()).toBeTruthy();
  const html = '<!doctype html><html lang="zh-CN"><head><link rel="stylesheet" href="style.css"></head><body><main><h1>分享检查验收</h1><p>合成作品，未执行真实发布。</p></main></body></html>';
  const file = await page.request.post(`/api/projects/${projectId}/files`, { headers: AMR_PERSONAL_WORKSPACE_HEADERS, data: {
    name: 'index.html', content: html,
    artifactManifest: { version: 1, kind: 'html', title: '分享检查验收', entry: 'index.html', renderer: 'html', exports: ['html'] },
  } });
  expect(file.ok(), await file.text()).toBeTruthy();
  const saveCss = async (content: string) => {
    const saved = await page.request.post(`/api/projects/${projectId}/files`, {
      headers: AMR_PERSONAL_WORKSPACE_HEADERS, data: { name: 'style.css', content },
    });
    expect(saved.ok(), await saved.text()).toBeTruthy();
  };
  await saveCss('body{font-family:sans-serif;color:#333}');
  const shareUrl = `https://viewer.example.test/artifact/${projectId}/synthetic`;
  await page.route(`**/api/projects/${projectId}/share-state`, route => route.fulfill({ json: {
    projectId, bindingExists: true, hasEverShared: true,
    publications: [{ sourceFilePath: 'index.html', slug: 'synthetic', status: 'active' }],
  } }));
  await page.route(`**/api/projects/${projectId}/files/index.html/share-plan`, route => route.fulfill({ json: {
    fileCount: 2, totalBytes: html.length + 100, exceedsSizeLimit: false, exclusions: [],
  } }));
  // Only the share-service response is mocked. Save, file inventory, watcher,
  // project SSE, refresh-key commit, and the visible Share entry are real.
  let mode: 'ready' | 'held' | 'failed' = 'ready';
  let freshness: 'current' | 'outdated' = 'current';
  let readGate = gate();
  let readStarted = gate();
  let readStartedAt = 0;
  const mutationMethods: string[] = [];
  await page.route(`**/api/projects/${projectId}/files/index.html/publish-public`, async route => {
    const method = route.request().method();
    if (method !== 'GET') {
      mutationMethods.push(method);
      await route.abort();
      return;
    }
    if (mode === 'failed') {
      await route.fulfill({ status: 503, json: { error: 'SHARE_STATE_UNAVAILABLE' } });
      return;
    }
    if (mode === 'held') {
      readStartedAt = performance.now();
      readStarted.release();
      await readGate.promise;
    }
    await route.fulfill({ json: { status: 'active', freshness,
      publication: { slug: 'synthetic', url: shareUrl, fileName: 'index.html' } } });
  });
  try {
    const events = page.waitForResponse(response => new URL(response.url()).pathname === `/api/projects/${projectId}/events`);
    await page.goto(`/projects/${projectId}/files/index.html`);
    expect((await events).ok()).toBeTruthy();
    await page.getByTestId('file-workspace').getByRole('button', { name: '分享', exact: true }).click();
    const menu = page.locator('.share-menu-popover[role="menu"]');
    await expect(menu.locator('.chrome-publish-url')).toHaveText(shareUrl);
    await expect(menu.getByRole('button', { name: '更新链接', exact: true })).toHaveCount(0);
    mode = 'held';
    freshness = 'outdated';
    const saveStartedAt = performance.now();
    await saveCss('body{font-family:sans-serif;color:#246}');
    await readStarted.promise;
    const saveToShareReadStartedMs = readStartedAt - saveStartedAt;
    await expect(menu.getByText('正在检查新改动…', { exact: true })).toBeVisible();
    await expect(menu.getByRole('button', { name: '复制链接', exact: true })).toBeEnabled();
    await expect(menu.getByRole('button', { name: '更新链接', exact: true })).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath('checking.png') });
    const resumedAt = performance.now();
    readGate.release();
    await expect(menu.getByRole('button', { name: '更新链接', exact: true })).toBeEnabled();
    const responseToEntryMs = performance.now() - resumedAt;
    await page.screenshot({ path: testInfo.outputPath('outdated.png') });
    mode = 'failed';
    await saveCss('body{font-family:sans-serif;color:#357}');
    await expect(menu.getByText('暂时无法检查新改动。请重试。', { exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('read-failed.png') });
    mode = 'held';
    freshness = 'current';
    readGate = gate();
    readStarted = gate();
    await menu.getByRole('button', { name: '重试', exact: true }).click();
    await readStarted.promise;
    await expect(menu.getByText('正在检查新改动…', { exact: true })).toBeVisible();
    readGate.release();
    await expect(menu.getByText('正在检查新改动…', { exact: true })).toHaveCount(0);
    await expect(menu.getByText('暂时无法检查新改动。请重试。', { exact: true })).toHaveCount(0);
    await expect(menu.getByRole('button', { name: '更新链接', exact: true })).toHaveCount(0);
    expect(mutationMethods).toEqual([]);
    await testInfo.attach('freshness-boundary-measurement', { contentType: 'application/json', body: JSON.stringify({
      source: 'local tools-dev browser with mocked share-service response',
      saveToShareReadStartedMs,
      releaseToEntryAssertionMs: responseToEntryMs,
      note: 'Controlled cloud hold excluded; assertion observation includes browser/Playwright overhead. Not production latency.',
    }) });
  } finally {
    readGate.release();
    readStarted.release();
  }
});
