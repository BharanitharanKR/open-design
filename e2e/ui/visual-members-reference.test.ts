import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Page } from '@playwright/test';
import { expect, test } from '@/playwright/suite';
import { configureVisualPage, gotoVisualHome, mockSignedInVelaAccount, waitForVisualStable } from '@/playwright/visual';
import { ensureRailOpen } from '@/playwright/rail';

// Rendering/interaction witnesses only: real app browser and isolated tools-dev,
// controlled Workspace/AMR responses. No claim of real invitations or revocation.
test.use({ actionTimeout: 15_000, navigationTimeout: 20_000 });
const artifactRoot = process.env.OD_MEMBERS_VISUAL_ARTIFACT_DIR ?? path.resolve('.tmp/members-visual-qa');
async function setup(page: Page, role: 'owner' | 'admin' | 'member', openInvite = true, workspaceCount = 2, options: { workspaceName?: string; beforeHome?: (context: Record<string, unknown>) => Promise<void> } = {}) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await configureVisualPage(page);
  await mockSignedInVelaAccount(page, { email: 'designer@example.com' });
  const context = {
    workspaceId: 'members-visual-workspace', workspaceName: options.workspaceName ?? 'Xiaoyi’s Workspace', workspaceType: 'team',
    workspaceMemberId: `members-visual-${role}`, role, memberStatus: 'active', lifecycleState: 'active',
    billingState: 'active', planId: 'team-pro', workspaceSettingsUrl: 'https://console.example.test/settings?workspaceId=members-visual-workspace',
    seatSummary: { seatLimit: 3, usedSeats: 3, availableSeats: 0, isSeatFull: true },
    permissions: { canInviteMembers: true, canManageMembers: role === 'owner', canManageBilling: role === 'owner', canManageAutoRecharge: false, canShareProjects: true, canWriteSyncedFiles: true, canViewWorkspaceSettings: role === 'owner', canManageSharedResources: role === 'owner' },
  };
  await page.addInitScript((current) => {
    localStorage.setItem('open-design:locale', 'zh-CN');
    localStorage.setItem('open-design:locale-source', 'manual');
    sessionStorage.setItem('od.workspaceSelection.v1', JSON.stringify({ workspaceId: current.workspaceId, workspaceMemberId: current.workspaceMemberId }));
  }, context);
  await page.route('**/api/workspace/directory', route => route.fulfill({ json: { items: Array.from({ length: workspaceCount }, (_, i) => i === 0 ? context : { ...context, workspaceId: i === 1 ? 'members-visual-design-space' : `members-visual-space-${i}`, workspaceMemberId: i === 1 ? 'members-visual-design-member' : `members-visual-member-${i}`, workspaceName: i === 1 ? 'Design space' : `Workspace ${i + 1}` }), activeWorkspaceId: context.workspaceId } }));
  await page.route('**/api/workspace/context', route => {
    const selected = route.request().headers()['x-od-workspace-id'];
    return route.fulfill({ json: { context: selected === 'members-visual-design-space' ? { ...context, workspaceId: selected, workspaceMemberId: 'members-visual-design-member', workspaceName: 'Design space' } : context } });
  });
  await page.route('**/api/workspace/projects/team', route => route.fulfill({ json: { projects: [] } }));
  await page.route('**/api/workspaces/*/projects**', route => {
    const url = new URL(route.request().url());
    if (route.request().method() !== 'GET' || !url.pathname.endsWith('/projects')) return route.fallback();
    const workspaceId = url.pathname.split('/')[3]!;
    const memberId = workspaceId === 'members-visual-design-space' ? 'members-visual-design-member' : context.workspaceMemberId;
    const projects = [1, 2, 3].map(n => { const project = { id: `visual-reference-project-${n}`, name: `Mock project ${n}`, skillId: null, designSystemId: null, createdAt: 1700000000000, updatedAt: 1700000000000, metadata: {} }; return { ...project, project, workspaceId, visibility: 'personal', resourceState: 'active', createdByWorkspaceMemberId: memberId, updatedByWorkspaceMemberId: memberId, resourceHubResourceId: null, cloudTombstonedAt: null, syncState: 'local_only', currentUserAccess: { canOpen: true, canRename: true, canDelete: true, canDuplicate: true, canMoveToTeam: true, canMoveToPersonal: false, canExport: true, canSendTo: true, canRestoreVersion: true } }; });
    return route.fulfill({ json: { projects } });
  });
  await options.beforeHome?.(context);
  await gotoVisualHome(page);
  await ensureRailOpen(page);
  await page.getByTestId('workspace-switcher').click();
  if (!openInvite) return page.getByRole('menu');
  await page.getByRole('menu').getByRole('menuitem', { name: /邀请/ }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  return dialog;
}
async function capture(page: Page, state: string) {
  await mkdir(artifactRoot, { recursive: true });
  await waitForVisualStable(page);
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
  const metrics = await page.evaluate(() => Object.fromEntries(['card', 'banner', 'panel', 'heading', 'context', 'labels', 'row', 'close', 'add', 'footer', 'submit'].map(name => { const el = name === 'card' ? document.querySelector('[data-testid=entry-cloud-signin-tip]') : name === 'banner' ? document.querySelector('[role=region][aria-label="邀请"]') : document.querySelector(`[role=dialog] [class*=\"_${name}_\"], [role=dialog][class*=\"_${name}_\"]`); if (!el) return [name, null]; const r=el.getBoundingClientRect(); const css=getComputedStyle(el); return [name,{x:r.x,y:r.y,width:r.width,height:r.height,margin:css.margin,padding:css.padding,font:css.font,lineHeight:css.lineHeight,background:css.backgroundColor,color:css.color,opacity:css.opacity}]; })));
  await writeFile(path.join(artifactRoot, `${state}-metrics.json`), JSON.stringify(metrics, null, 2));
  const options = await page.getByRole('option').evaluateAll(items => items.map(item => { const r = item.getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height,scrollHeight:item.scrollHeight,clientHeight:item.clientHeight }; }));
  await writeFile(path.join(artifactRoot, `${state}-options.json`), JSON.stringify(options, null, 2));
  const toastMetrics = await page.locator('.od-toast').evaluateAll(items => items.map(el => { const css = getComputedStyle(el); return { rect: el.getBoundingClientRect().toJSON(), background: css.backgroundColor, borderRadius: css.borderRadius, closeButtons: el.querySelectorAll('button').length }; }));
  await writeFile(path.join(artifactRoot, `${state}-toast-metrics.json`), JSON.stringify(toastMetrics, null, 2));
  await page.screenshot({ path: path.join(artifactRoot, `${state}.png`), animations: 'disabled' });
}
for (const [state, role] of [['B02', 'owner'], ['B03', 'member'], ['B27', 'admin']] as const) {
  test(`[P1] ${state} reference viewport invitation role and layout`, async ({ page }) => {
    const dialog = await setup(page, role);
    await expect(dialog.locator('input[type="email"]')).toHaveCount(1);
    if (role !== 'owner') await expect(dialog.locator('[aria-haspopup="listbox"]:enabled')).toHaveCount(0);
    await capture(page, state);
  });
}
test('[P1] B20 owner multiple rows and role description', async ({ page }) => {
  const dialog = await setup(page, 'owner');
  await dialog.getByRole('button', { name: /添加成员/ }).click();
  await expect(dialog.locator('input[type="email"]')).toHaveCount(2);
  await dialog.locator('[aria-haspopup="listbox"]').first().click();
  await expect(page.getByRole('listbox')).toBeVisible();
  await capture(page, 'B20');
  await expect.poll(() => page.getByRole('option').evaluateAll(items => items.map(item => item.scrollHeight <= item.clientHeight))).toEqual([true, true]);
});
test('[P1] A06 workspace switcher shows the two reference identities', async ({ page }) => {
  const menu = await setup(page, 'owner', false);
  await expect(menu).toContainText('Xiaoyi’s Workspace');
  await expect(menu).toContainText('Design space');
  await expect(menu.getByTestId('entry-nav-create-team')).toBeVisible();
  await expect(menu.getByTestId('entry-nav-create-team')).toHaveAttribute('target', '_blank');
  await capture(page, 'A06');
});
test('[P1] B21 invalid email stays editable and unsent', async ({ page }) => {
  const dialog = await setup(page, 'owner');
  await dialog.locator('input[type="email"]').fill('invalid-email');
  await dialog.getByRole('button', { name: /发送邀请|确认并邀请/ }).click();
  await expect(dialog.locator('input[type="email"]')).toHaveValue('invalid-email');
  await expect(dialog.getByText(/邮箱格式/)).toBeVisible();
  await capture(page, 'B21');
});
test('[P1] B22 duplicate emails retain both rows for correction', async ({ page }) => {
  const dialog = await setup(page, 'owner');
  await dialog.getByRole('button', { name: /添加成员/ }).click();
  const inputs = dialog.locator('input[type="email"]');
  await inputs.nth(0).fill('lee@example.com');
  await inputs.nth(1).fill('lee@example.com');
  await dialog.getByRole('button', { name: /发送邀请|确认并邀请/ }).click();
  await expect(inputs).toHaveCount(2);
  await expect(dialog.getByText(/重复/)).toBeVisible();
  await capture(page, 'B22');
});
test('[P1] B24 pending request disables repeated sends', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const dialog = await setup(page, 'owner');
  await page.route('**/api/workspace/invite', async route => {
    await gate;
    await route.fulfill({ json: { results: [{ email: 'mika@example.com', ok: true, inviteId: 'visual-only-invite' }] } });
  });
  try {
    await dialog.getByRole('button', { name: /添加成员/ }).click();
    await dialog.locator('input[type="email"]').nth(0).fill('mika@example.com');
    await dialog.locator('input[type="email"]').nth(1).fill('lee@example.com');
    await dialog.getByRole('button', { name: /发送邀请|确认并邀请/ }).click();
    await expect(dialog.getByRole('button', { name: /正在发送/ })).toBeDisabled();
    await capture(page, 'B24');
  } finally { release(); }
});
test('[P1] B26 partial failure keeps only the failed recipient', async ({ page }) => {
  const dialog = await setup(page, 'owner');
  await page.route('**/api/workspace/invite', route => route.fulfill({ json: { results: [
    { email: 'mika@example.com', ok: true, inviteId: 'visual-only-sent' },
    { email: 'lee@example.com', ok: false, error: 'active_pending_invite' },
  ] } }));
  await dialog.getByRole('button', { name: /添加成员/ }).click();
  await dialog.locator('input[type="email"]').nth(0).fill('mika@example.com');
  await dialog.locator('input[type="email"]').nth(1).fill('lee@example.com');
  await dialog.getByRole('button', { name: /发送邀请|确认并邀请/ }).click();
  await expect(dialog.locator('input[type="email"]')).toHaveCount(1);
  await expect(dialog.locator('input[type="email"]')).toHaveValue('lee@example.com');
  await expect(dialog.getByText('该邮箱已有待接受的邀请。')).toBeVisible();
  await expect(dialog.getByRole('button', { name: '发送邀请', exact: true })).toBeEnabled();
  await expect(dialog.getByRole('button', { name: '发送邀请', exact: true })).toHaveCSS('background-color', 'rgb(32, 32, 32)');
  await capture(page, 'B26-hover');
  await page.mouse.move(1300, 800);
  await expect(dialog.getByRole('button', { name: '发送邀请', exact: true })).toHaveCSS('background-color', 'rgb(32, 32, 32)');
  await capture(page, 'B26');
});

test('[P1] A01 local identity shows cloud sign-in entry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await configureVisualPage(page, { velaLoggedIn: false });
  await page.addInitScript(() => { localStorage.setItem('open-design:locale', 'zh-CN'); localStorage.setItem('open-design:locale-source', 'manual'); });
  await gotoVisualHome(page);
  await ensureRailOpen(page);
  await expect(page.getByTestId('entry-cloud-signin-tip')).toBeVisible();
  await capture(page, 'A01');
});

test('[P1] A03 and A05 dismissal persists across reload while header invite remains', async ({ page }) => {
  await setup(page, 'owner', false);
  await page.locator('.entry-nav-rail__menu-backdrop').click({ position: { x: 10, y: 700 } });
  await expect(page.getByRole('menu')).toHaveCount(0);
  const banner = page.getByRole('region', { name: '邀请', exact: true });
  await expect(banner).toBeVisible();
  await capture(page, 'A03');
  await banner.getByRole('button', { name: '关闭邀请横条' }).click();
  await expect(banner).toHaveCount(0);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('workspace-switcher')).toBeVisible();
  await expect(banner).toHaveCount(0);
  await page.addInitScript(() => sessionStorage.setItem('od.workspaceSelection.v1', JSON.stringify({ workspaceId: 'members-visual-design-space', workspaceMemberId: 'members-visual-design-member' })));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('od.workspaceSelection.v1') ?? '{}').workspaceId)).toBe('members-visual-design-space');
  await expect(banner).toHaveCount(0);
  const persistentInvite = page.getByRole('banner', { name: 'Workspace tabs' }).getByRole('button', { name: '邀请', exact: true });
  await expect(persistentInvite).toBeVisible();
  await page.getByTestId('entry-nav-drafts').click();
  await expect(page).toHaveURL(/\/drafts$/);
  await expect(page.getByTestId('recent-projects-strip')).toBeVisible();
  await expect(persistentInvite).toBeVisible();
  await capture(page, 'A05');
  await persistentInvite.click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('[P1] banner dismissal is scoped to account identity', async ({ page }) => {
  await setup(page, 'owner', false);
  await page.locator('.entry-nav-rail__menu-backdrop').click({ position: { x: 10, y: 700 } });
  await expect(page.getByRole('menu')).toHaveCount(0);
  const banner = page.getByRole('region', { name: '邀请', exact: true });
  await banner.getByRole('button', { name: '关闭邀请横条' }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('od.invitation-banner.dismissed:u1'))).toBe('1');
  await page.route('**/api/integrations/vela/status', route => route.fulfill({ json: {
    loggedIn: true, loginInFlight: false, profile: 'test',
    user: { id: 'u2', email: 'second@example.com' }, account: { plan: 'plus', balanceUsd: '247.51' },
  } }));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(banner).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('od.invitation-banner.dismissed:u2'))).toBeNull();
});

test('[P1] A06 fifty workspace limit preserves scroll and disables create', async ({ page }) => {
  const menu = await setup(page, 'owner', false, 50);
  await expect(menu).toContainText('50/50');
  await expect(menu.getByRole('menuitem', { name: '新建工作空间' })).toBeDisabled();
  await expect(menu.getByText('已达 50 个上限')).toBeVisible();
  const list = page.getByTestId('workspace-switcher-list');
  await expect.poll(() => list.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await capture(page, 'A06-limit');
});

// HTTP-edge SSE witness, not a real AMR removal or provider task-stop proof.
for (const removal of ['exact', 'other-member', 'other-workspace'] as const) {
  const exact = removal === 'exact';
  test(`[P1] ${exact ? 'H01 H12 exact removal requires verified default recovery' : removal === 'other-workspace' ? 'H02 background workspace removal keeps current content' : 'different member removal preserves exact current authority'}`, async ({ page }) => {
    let deliver!: () => void;
    const gate = new Promise<void>(resolve => { deliver = resolve; });
    let delivered = false;
    let removed = false;
    let switched = false;
    let activeAttempts = 0;
    let contextReads = 0;
    const writes: unknown[] = [];
    try {
      await setup(page, 'owner', false, 2, { workspaceName: 'Xiaoyi’s Workspace', beforeHome: async current => {
        const fallback = { ...current, workspaceId: 'members-default', workspaceMemberId: 'members-default-owner', workspaceName: 'Xiaoyi’s Workspace', isDefault: true };
        await page.route('**/api/workspace/directory', route => route.fulfill({ json: { items: removed && exact ? [fallback] : removed && removal === 'other-workspace' ? [{ ...current, isDefault: false }] : [{ ...current, isDefault: false }, fallback], activeWorkspaceId: switched ? fallback.workspaceId : current.workspaceId } }));
        await page.route('**/api/workspace/context', route => {
          contextReads += 1;
          return route.fulfill({ json: { context: route.request().headers()['x-od-workspace-id'] === fallback.workspaceId ? fallback : current } });
        });
        await page.route('**/api/workspace/active', route => {
          const body = route.request().postDataJSON(); writes.push(body); activeAttempts += 1;
          if (activeAttempts === 1) return route.fulfill({ status: 503, json: { error: 'fixture_unavailable' } });
          switched = true;
          return route.fulfill({ json: { activeWorkspaceId: fallback.workspaceId, context: fallback } });
        });
        await page.route('**/api/workspace/events**', async route => {
          await gate;
          if (delivered) return route.fulfill({ status: 204 });
          delivered = true;
          const scope = { workspaceId: current.workspaceId, workspaceMemberId: current.workspaceMemberId };
          const payload = { type: 'workspace-context-changed', memberRemoval: { ...scope, workspaceId: removal === 'other-workspace' ? fallback.workspaceId : scope.workspaceId, workspaceMemberId: exact ? scope.workspaceMemberId : removal === 'other-workspace' ? fallback.workspaceMemberId : 'another-member', reason: 'member-removed' }, at: new Date().toISOString() };
          return route.fulfill({ contentType: 'text/event-stream', body: `event: ready\ndata: ${JSON.stringify(scope)}\n\nevent: workspace-context-changed\ndata: ${JSON.stringify(payload)}\n\n` });
        });
      } });
      await page.locator('.entry-nav-rail__menu-backdrop').click({ position: { x: 10, y: 700 } });
      await expect(page.getByTestId('home-hero')).toBeVisible();
      const before = contextReads;
      removed = true; deliver();
      if (!exact) {
        await expect.poll(() => contextReads).toBeGreaterThan(before);
        await expect(page.getByRole('alertdialog')).toHaveCount(0);
        await expect(page.getByTestId('workspace-switcher')).toContainText('Xiaoyi’s Workspace');
        await expect(page.getByTestId('home-hero')).toBeVisible();
        expect(writes).toEqual([]);
        if (removal === 'other-workspace') await capture(page, 'H02');
        return;
      }
      const dialog = page.getByRole('alertdialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading')).toContainText('Xiaoyi’s Workspace');
      await expect(page.getByTestId('home-hero')).toHaveCount(0);
      await capture(page, 'H01');
      await dialog.getByRole('button').click();
      await expect(dialog.getByRole('alert')).toBeVisible();
      await expect(page.getByTestId('home-hero')).toHaveCount(0);
      await dialog.getByRole('button').click();
      await expect(dialog).toHaveCount(0);
      await expect(page.getByTestId('workspace-switcher')).toContainText('Xiaoyi’s Workspace');
      await expect(page.getByTestId('home-hero')).toBeVisible();
      await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('od.workspaceSelection.v1') ?? '{}').workspaceId)).toBe('members-default');
      expect(writes).toEqual(Array.from({ length: 2 }, () => ({ workspaceId: 'members-default', workspaceMemberId: 'members-default-owner' })));
      await capture(page, 'H12');
    } finally { deliver?.(); }
  });
}

test('[P1] B23 existing member is a row error with editable email retained', async ({ page }) => {
  const dialog = await setup(page, 'owner');
  await page.route('**/api/workspace/invite', route => route.fulfill({ json: { results: [{ email: 'lee@example.com', ok: false, error: 'already_member' }] } }));
  const input = dialog.locator('input[type="email"]');
  await input.fill('lee@example.com');
  await dialog.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect(dialog.getByText('该邮箱已是团队成员。')).toBeVisible();
  await expect(input).toHaveValue('lee@example.com');
  await expect(input).toBeEditable();
  await page.mouse.move(1300, 800);
  await capture(page, 'B23');
  await input.fill('new@example.com');
  await expect(dialog.getByText('该邮箱已是团队成员。')).toHaveCount(0);
});

test('[P1] B25 whole request failure is inline and preserves retryable form', async ({ page }) => {
  const dialog = await setup(page, 'owner');
  let calls = 0;
  await page.route('**/api/workspace/invite', route => { calls += 1; return route.fulfill({ status: 503, json: { error: 'fixture_unavailable' } }); });
  const input = dialog.locator('input[type="email"]');
  await input.fill('lee@example.com');
  const submit = dialog.getByRole('button', { name: '发送邀请', exact: true });
  await submit.click();
  await expect(dialog.getByRole('alert')).toHaveText('邀请发送失败，请检查网络后重试。');
  await expect(input).toHaveValue('lee@example.com');
  await expect(input).toBeEditable();
  await expect(submit).toBeEnabled();
  expect(calls).toBe(1);
  await page.mouse.move(1300, 800);
  await capture(page, 'B25');
});

test('[P1] B10 partial success then corrected retry closes with actual cumulative count two', async ({ page }) => {
  const dialog = await setup(page, 'owner');
  let calls = 0;
  await page.route('**/api/workspace/invite', route => {
    calls += 1;
    return route.fulfill({ json: { results: calls === 1 ? [
      { email: 'mika@example.com', ok: true, inviteId: 'visual-one' },
      { email: 'lee@example.com', ok: false, error: 'active_pending_invite' },
    ] : [{ email: 'corrected@example.com', ok: true, inviteId: 'visual-two' }] } });
  });
  await dialog.getByRole('button', { name: /添加成员/ }).click();
  await dialog.locator('input[type="email"]').nth(0).fill('mika@example.com');
  await dialog.locator('input[type="email"]').nth(1).fill('lee@example.com');
  await dialog.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect(dialog.locator('input[type="email"]')).toHaveCount(1);
  await expect(dialog.getByText('该邮箱已有待接受的邀请。')).toBeVisible();
  await dialog.locator('input[type="email"]').fill('corrected@example.com');
  await dialog.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: '已向 2 位同事发送邀请' })).toBeVisible();
  await expect(page.getByRole('region', { name: '邀请', exact: true })).toHaveCount(0);
  expect(calls).toBe(2);
  await page.mouse.move(1300, 800);
  await capture(page, 'B10');
});

test('[P1] A07 create workspace hands off to a browser without adding a client form', async ({ page }) => {
  const menu = await setup(page, 'owner', false);
  const create = menu.getByTestId('entry-nav-create-team');
  const href = await create.getAttribute('href');
  expect(href).toBeTruthy();
  await page.context().route('https://console.example.test/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Controlled console handoff</title><p>External navigation witness only</p>' }));
  await capture(page, 'A07');
  const popupPromise = page.waitForEvent('popup');
  await create.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(href!);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByTestId('workspace-switcher')).toBeVisible();
  await popup.close();
});

test('[P1] C12 joined directory appears without account logout and switches by exact identity', async ({ page }) => {
  let deliver!: () => void;
  const gate = new Promise<void>(resolve => { deliver = resolve; });
  let delivered = false;
  let joined = false;
  let directoryReads = 0;
  let activeId = 'members-visual-workspace';
  const writes: unknown[] = [];
  const logoutRequests: string[] = [];
  page.on('request', request => { if (/\/(?:logout|signout|sign-out)(?:[/?]|$)/.test(request.url())) logoutRequests.push(request.url()); });
  try {
    const menu = await setup(page, 'owner', false, 2, { beforeHome: async current => {
      const added = { ...current, workspaceId: 'members-joined-design', workspaceMemberId: 'members-joined-owner', workspaceName: 'Design space' };
      await page.route('**/api/workspace/directory', route => {
        directoryReads += 1;
        return route.fulfill({ json: { items: joined ? [current, added] : [current], activeWorkspaceId: activeId } });
      });
      await page.route('**/api/workspace/context', route => route.fulfill({ json: { context: route.request().headers()['x-od-workspace-id'] === added.workspaceId ? added : current } }));
      await page.route('**/api/workspace/active', route => {
        writes.push(route.request().postDataJSON()); activeId = added.workspaceId;
        return route.fulfill({ json: { activeWorkspaceId: activeId, context: added } });
      });
      await page.route('**/api/workspace/events**', async route => {
        await gate;
        if (delivered) return route.fulfill({ status: 204 });
        delivered = true;
        return route.fulfill({ contentType: 'text/event-stream', body: `event: ready\ndata: {}\n\nevent: workspace-context-changed\ndata: ${JSON.stringify({ type: 'workspace-context-changed', at: new Date().toISOString() })}\n\n` });
      });
    } });
    await expect(menu.getByRole('menuitem', { name: 'Design space', exact: true })).toHaveCount(0);
    await page.locator('.entry-nav-rail__menu-backdrop').click({ position: { x: 10, y: 700 } });
    const before = directoryReads;
    joined = true; deliver();
    await expect.poll(() => directoryReads).toBeGreaterThan(before);
    await page.getByTestId('workspace-switcher').click();
    await page.getByRole('menuitem', { name: 'Design space', exact: true }).click();
    await expect(page.getByTestId('workspace-switcher')).toContainText('Design space');
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('od.workspaceSelection.v1') ?? '{}').workspaceId)).toBe('members-joined-design');
    expect(writes).toEqual([{ workspaceId: 'members-joined-design', workspaceMemberId: 'members-joined-owner' }]);
    expect(logoutRequests).toEqual([]);
    await page.getByTestId('workspace-switcher').click();
    await expect(page.getByRole('menuitem', { name: 'Design space', exact: true })).toHaveAttribute('aria-current', 'true');
    await capture(page, 'C12');
  } finally { deliver?.(); }
});

test('[P1] H04 rejoined workspace uses a new membership identity without a restoration dialog', async ({ page }) => {
  let deliver!: () => void;
  const gate = new Promise<void>(resolve => { deliver = resolve; });
  let delivered = false;
  let phase: 'before' | 'removed' | 'rejoined' = 'before';
  let directoryReads = 0;
  let activeId = 'members-visual-workspace';
  const writes: unknown[] = [];
  try {
    const menu = await setup(page, 'owner', false, 2, { beforeHome: async current => {
      const old = { ...current, workspaceId: 'members-rejoined-design', workspaceMemberId: 'members-rejoined-old', workspaceName: 'Design space' };
      const rejoined = { ...old, workspaceMemberId: 'members-rejoined-new' };
      await page.route('**/api/workspace/directory', route => {
        directoryReads += 1;
        const items = phase === 'before' ? [current, old] : phase === 'removed' ? [current] : [current, rejoined];
        return route.fulfill({ json: { items, activeWorkspaceId: activeId } });
      });
      await page.route('**/api/workspace/context', route => route.fulfill({ json: { context: route.request().headers()['x-od-workspace-member-id'] === rejoined.workspaceMemberId ? rejoined : current } }));
      await page.route('**/api/workspace/active', route => {
        writes.push(route.request().postDataJSON()); activeId = rejoined.workspaceId;
        return route.fulfill({ json: { activeWorkspaceId: activeId, context: rejoined } });
      });
      await page.route('**/api/workspace/events**', async route => {
        await gate;
        if (delivered) return route.fulfill({ status: 204 });
        delivered = true;
        const event = { type: 'workspace-context-changed', memberRemoval: { workspaceId: old.workspaceId, workspaceMemberId: old.workspaceMemberId, reason: 'member-removed' }, at: new Date().toISOString() };
        return route.fulfill({ contentType: 'text/event-stream', body: `event: ready\ndata: {}\n\nevent: workspace-context-changed\ndata: ${JSON.stringify(event)}\n\n` });
      });
    } });
    await expect(menu.getByRole('menuitem', { name: 'Design space', exact: true })).toBeVisible();
    await page.locator('.entry-nav-rail__menu-backdrop').click({ position: { x: 10, y: 700 } });
    const before = directoryReads;
    phase = 'removed'; deliver();
    await expect.poll(() => directoryReads).toBeGreaterThan(before);
    await page.getByTestId('workspace-switcher').click();
    await expect(page.getByRole('menuitem', { name: 'Design space', exact: true })).toHaveCount(0);
    await expect(page.getByRole('alertdialog')).toHaveCount(0);
    phase = 'rejoined';
    await page.reload({ waitUntil: 'domcontentloaded' });
    await ensureRailOpen(page);
    await page.getByTestId('workspace-switcher').click();
    await page.getByRole('menuitem', { name: 'Design space', exact: true }).click();
    await expect(page.getByTestId('workspace-switcher')).toContainText('Design space');
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('od.workspaceSelection.v1') ?? '{}').workspaceMemberId)).toBe('members-rejoined-new');
    expect(writes).toEqual([{ workspaceId: 'members-rejoined-design', workspaceMemberId: 'members-rejoined-new' }]);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('alertdialog')).toHaveCount(0);
    await page.getByTestId('workspace-switcher').click();
    await expect(page.getByRole('menuitem', { name: 'Design space', exact: true })).toHaveAttribute('aria-current', 'true');
    await capture(page, 'H04');
  } finally { deliver?.(); }
});
