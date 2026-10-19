import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Page } from '@playwright/test';
import { expect, test } from '@/playwright/suite';
import { configureVisualPage, gotoVisualHome, mockSignedInVelaAccount } from '@/playwright/visual';
import { ensureRailOpen } from '@/playwright/rail';

// Rendering/interaction witnesses only: real app browser and isolated tools-dev,
// controlled Workspace/AMR responses. No claim of real invitations or revocation.
const artifactRoot = process.env.OD_MEMBERS_VISUAL_ARTIFACT_DIR ?? path.resolve('.tmp/members-visual-qa');
async function setup(page: Page, role: 'owner' | 'admin' | 'member', openInvite = true) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await configureVisualPage(page);
  await mockSignedInVelaAccount(page, { email: 'designer@example.com' });
  const context = {
    workspaceId: 'members-visual-workspace', workspaceName: 'Xiaoyi’s Workspace', workspaceType: 'team',
    workspaceMemberId: `members-visual-${role}`, role, memberStatus: 'active', lifecycleState: 'active',
    billingState: 'active', planId: 'team-pro',
    seatSummary: { seatLimit: 3, usedSeats: 3, availableSeats: 0, isSeatFull: true },
    permissions: { canInviteMembers: true, canManageMembers: role === 'owner', canManageBilling: role === 'owner', canManageAutoRecharge: false, canShareProjects: true, canWriteSyncedFiles: true, canViewWorkspaceSettings: role === 'owner', canManageSharedResources: role === 'owner' },
  };
  await page.addInitScript((current) => {
    localStorage.setItem('open-design:locale', 'zh-CN');
    localStorage.setItem('open-design:locale-source', 'manual');
    sessionStorage.setItem('od.workspaceSelection.v1', JSON.stringify({ workspaceId: current.workspaceId, workspaceMemberId: current.workspaceMemberId }));
  }, context);
  await page.route('**/api/workspace/directory', route => route.fulfill({ json: { items: [context, {...context,workspaceId:'members-visual-design-space',workspaceMemberId:'members-visual-design-member',workspaceName:'Design space'}], activeWorkspaceId: context.workspaceId } }));
  await page.route('**/api/workspace/context', route => route.fulfill({ json: { context } }));
  await page.route('**/api/workspace/projects/team', route => route.fulfill({ json: { projects: [] } }));
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
  await page.evaluate(async () => { await document.fonts.ready; });
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
});
test('[P1] A06 workspace switcher shows the two reference identities', async ({ page }) => {
  const menu = await setup(page, 'owner', false);
  await expect(menu).toContainText('Xiaoyi’s Workspace');
  await expect(menu).toContainText('Design space');
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
  await capture(page, 'B26');
});

test('[P1] A01 local identity shows cloud sign-in entry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await configureVisualPage(page);
  await gotoVisualHome(page);
  await ensureRailOpen(page);
  await expect(page.getByTestId('entry-cloud-signin-tip')).toBeVisible();
  await capture(page, 'A01');
});

test('[P1] A03 and A05 dismissal persists across reload while header invite remains', async ({ page }) => {
  await setup(page, 'owner', false);
  await page.keyboard.press('Escape');
  const banner = page.getByRole('region', { name: '邀请', exact: true });
  await expect(banner).toBeVisible();
  await capture(page, 'A03');
  await banner.getByRole('button', { name: '关闭邀请横条' }).click();
  await expect(banner).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId('workspace-switcher')).toBeVisible();
  await expect(banner).toHaveCount(0);
  await page.addInitScript(() => sessionStorage.setItem('od.workspaceSelection.v1', JSON.stringify({ workspaceId: 'members-visual-design-space', workspaceMemberId: 'members-visual-design-member' })));
  await page.reload();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('od.workspaceSelection.v1') ?? '{}').workspaceId)).toBe('members-visual-design-space');
  await expect(banner).toHaveCount(0);
  const persistentInvite = page.getByRole('button', { name: '邀请', exact: true });
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
  await page.keyboard.press('Escape');
  const banner = page.getByRole('region', { name: '邀请', exact: true });
  await banner.getByRole('button', { name: '关闭邀请横条' }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('od.invitation-banner.dismissed:u1'))).toBe('1');
  await page.route('**/api/integrations/vela/status', route => route.fulfill({ json: {
    loggedIn: true, loginInFlight: false, profile: 'test',
    user: { id: 'u2', email: 'second@example.com' }, account: { plan: 'plus', balanceUsd: '247.51' },
  } }));
  await page.reload();
  await expect(banner).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('od.invitation-banner.dismissed:u2'))).toBeNull();
});
