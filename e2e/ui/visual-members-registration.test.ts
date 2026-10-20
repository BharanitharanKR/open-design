import { expect, test } from '@/playwright/suite';
import { captureRegistration, registrationHost } from '@/playwright/members-registration';
import { T } from '@/timeouts';
import type { Page } from '@playwright/test';

test.use({ actionTimeout: T.medium, navigationTimeout: T.long });
async function start(page: Page) {
  const host = await registrationHost(page);
  await host.begin();
  await expect(host.form).toBeVisible({ timeout: T.long });
  return host;
}
async function pauseSuccessTimer(page: Page) {
  await page.clock.install({ time: new Date('2026-10-20T03:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-20T03:00:01Z'));
}

test('[P1] B01 only the new-registration signal enters the real invitation host', async ({ page }) => {
  const host = await start(page);
  await expect(host.form.getByRole('heading')).toHaveText('免费邀请同事，一起做设计');
  await expect(host.form.locator('input[type=email]')).toHaveCount(1);
  await expect(host.form.getByRole('button', { name: '取消' })).toHaveCount(0);
  await expect(host.form.getByRole('button', { name: '暂时跳过' })).toBeVisible();
  expect(host.loginCalls).toBe(1);
  expect(host.invitationRequests).toEqual([]);
  await captureRegistration(page, 'B01');
});

test('[P1] B04 multiple rows retain independent roles and can be removed', async ({ page }) => {
  const host = await start(page);
  await host.form.getByRole('button', { name: '添加成员' }).click();
  const inputs = host.form.locator('input[type=email]');
  await inputs.nth(0).fill('mika@example.com'); await inputs.nth(1).fill('lee@example.com');
  await captureRegistration(page, 'B04');
  await host.form.locator('[aria-haspopup=listbox]').nth(0).click();
  await page.getByRole('option', { name: /管理员/ }).click();
  await expect(host.form.locator('[aria-haspopup=listbox]').nth(0)).toHaveText('管理员');
  await expect(host.form.locator('[aria-haspopup=listbox]').nth(1)).toHaveText('成员');
  await host.form.getByRole('button', { name: /移除/ }).nth(1).click();
  await expect(inputs).toHaveCount(1); await expect(inputs).toHaveValue('mika@example.com');
});

test('[P1] B05 invalid email is editable and never sent', async ({ page }) => {
  const host = await start(page);
  await host.form.locator('input[type=email]').fill('invalid-email');
  await host.form.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect(host.form.getByRole('alert')).toContainText('邮箱格式');
  await expect(host.form.locator('input[type=email]')).toHaveValue('invalid-email');
  expect(host.invitationRequests).toEqual([]);
  await captureRegistration(page, 'B05');
});

test('[P1] B06 only the later duplicate row is marked until corrected', async ({ page }) => {
  const host = await start(page);
  await host.form.getByRole('button', { name: '添加成员' }).click();
  const inputs = host.form.locator('input[type=email]');
  await inputs.nth(0).fill('lee@example.com'); await inputs.nth(1).fill('lee@example.com');
  await host.form.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect(inputs.nth(0)).toHaveAttribute('aria-invalid', 'false');
  await expect(inputs.nth(1)).toHaveAttribute('aria-invalid', 'true');
  expect(host.invitationRequests).toEqual([]);
  await captureRegistration(page, 'B06');
  await inputs.nth(1).fill('corrected@example.com');
  await expect(inputs.nth(1)).toHaveAttribute('aria-invalid', 'false');
});

test('[P1] B07 existing member error remains local to the editable row', async ({ page }) => {
  const host = await start(page);
  await host.invite(route => route.fulfill({ json: { results: [{ email: 'mika@example.com', ok: false, error: 'already_member' }] } }));
  await host.form.locator('input[type=email]').fill('mika@example.com');
  await host.form.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect(host.form.getByText('该邮箱已是团队成员。')).toBeVisible();
  await expect(host.form.locator('input[type=email]')).toBeEditable();
  await captureRegistration(page, 'B07');
  await host.form.locator('input[type=email]').fill('corrected@example.com');
  await expect(host.form.getByText('该邮箱已是团队成员。')).toHaveCount(0);
});

test('[P1] B08 pending request prevents repeat submits and skip', async ({ page }) => {
  const host = await start(page);
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await host.invite(async route => { await gate; await route.fulfill({ json: { results: [{ email: 'mika@example.com', ok: false, error: 'create_unreachable' }] } }); });
  try {
    await host.form.locator('input[type=email]').fill('mika@example.com');
    await host.form.getByRole('button', { name: '发送邀请', exact: true }).click();
    await expect(host.form.getByRole('button', { name: /正在发送/ })).toBeDisabled();
    await expect(host.form.getByRole('button', { name: '暂时跳过' })).toBeDisabled();
    expect(host.invitationRequests).toHaveLength(1);
    await captureRegistration(page, 'B08');
  } finally { release(); }
});

test('[P1] B09 B18 confirmed success waits before home and counts exactly two', async ({ page }) => {
  const host = await start(page);
  await host.invite(route => route.fulfill({ json: { results: [{ email: 'mika@example.com', ok: true }, { email: 'lee@example.com', ok: true }] } }));
  await host.form.getByRole('button', { name: '添加成员' }).click();
  await host.form.locator('input[type=email]').nth(0).fill('mika@example.com');
  await host.form.locator('input[type=email]').nth(1).fill('lee@example.com');
  await pauseSuccessTimer(page);
  await host.form.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect(host.form.getByRole('button', { name: '已发送邀请', exact: true })).toBeDisabled();
  await captureRegistration(page, 'B09', true);
  await page.clock.runFor(999);
  await expect(host.form).toBeVisible();
  await page.clock.runFor(1);
  await page.clock.resume();
  await expect(host.form).toHaveCount(0);
  await expect(page.getByTestId('home-view')).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: '已向 2 位同事发送邀请' })).toBeVisible();
  await expect(page.getByRole('region', { name: '邀请', exact: true })).toHaveCount(0);
  await captureRegistration(page, 'B18');
});

test('[P1] B11 failed batch preserves every recipient and retry sends only one request', async ({ page }) => {
  const host = await start(page);
  let attempts = 0;
  await host.invite(route => { attempts += 1; return route.fulfill({ status: 503, json: { error: 'fixture_unavailable' } }); });
  await host.form.getByRole('button', { name: '添加成员' }).click();
  const inputs = host.form.locator('input[type=email]');
  await inputs.nth(0).fill('mika@example.com'); await inputs.nth(1).fill('lee@example.com');
  await host.form.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect(host.form.getByRole('alert')).toContainText('邀请发送失败，请检查网络后重试');
  await expect(inputs).toHaveCount(2); await expect(inputs.nth(0)).toHaveValue('mika@example.com'); await expect(inputs.nth(1)).toHaveValue('lee@example.com');
  await expect(host.form.getByRole('button', { name: '发送邀请', exact: true })).toBeEnabled();
  expect(attempts).toBe(1);
  await captureRegistration(page, 'B11');
  await host.form.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect.poll(() => attempts).toBe(2);
});

test('[P1] B12 B19 partial success keeps only failure and skip reports actual cumulative count', async ({ page }) => {
  const host = await start(page);
  await host.invite(route => route.fulfill({ json: { results: [{ email: 'mika@example.com', ok: true }, { email: 'lee@example.com', ok: false, error: 'active_pending_invite' }] } }));
  await host.form.getByRole('button', { name: '添加成员' }).click();
  await host.form.locator('input[type=email]').nth(0).fill('mika@example.com'); await host.form.locator('input[type=email]').nth(1).fill('lee@example.com');
  await pauseSuccessTimer(page);
  await host.form.getByRole('button', { name: '发送邀请', exact: true }).click();
  await expect(host.form.locator('input[type=email]')).toHaveCount(1);
  await expect(host.form.locator('input[type=email]')).toHaveValue('lee@example.com');
  await expect(host.form.getByText('该邮箱已有待接受的邀请。')).toBeVisible();
  await expect(host.form.getByRole('button', { name: '已邀请 1 位同事' })).toBeDisabled();
  await captureRegistration(page, 'B12', true);
  await page.clock.runFor(650);
  await page.clock.resume();
  await host.form.getByRole('button', { name: '暂时跳过' }).click();
  await expect(host.form).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: '已向 1 位同事发送邀请' })).toBeVisible();
  await expect(page.getByRole('region', { name: '邀请', exact: true })).toHaveCount(0);
  await captureRegistration(page, 'B19');
});

test('[P1] B13 skip without confirmed success shows home banner and consumes onboarding once', async ({ page }) => {
  const host = await start(page);
  await host.form.getByRole('button', { name: '暂时跳过' }).click();
  await expect(host.form).toHaveCount(0);
  await expect(page.getByRole('region', { name: '邀请', exact: true })).toBeVisible();
  expect(host.invitationRequests).toEqual([]);
  await captureRegistration(page, 'B13');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('home-view')).toBeVisible();
  await expect(host.form).toHaveCount(0);
});

for (const existingSetup of [true, false]) {
  test(`[P1] existing account skips registration invitation with setup=${existingSetup}`, async ({ page }) => {
    const host = await registrationHost(page, { account: { id: 'existing-account' }, existingSetup });
    await host.begin();
    await expect(page.getByTestId('home-view')).toBeVisible({ timeout: T.long });
    await expect(host.form).toHaveCount(0);
    expect(host.invitationRequests).toEqual([]);
  });
}

test('[P1] mismatched registration receipt never grants another account the invitation step', async ({ page }) => {
  const host = await registrationHost(page, { account: { id: 'existing-account', receipt: { accountId: 'different-account', deviceAuthorizationId: 'different-authorization' } } });
  await host.begin();
  await expect(page.getByTestId('home-view')).toBeVisible({ timeout: T.long });
  await expect(host.form).toHaveCount(0);
});

test('[P1] completed registration does not leak or reappear across account switch and restart', async ({ page }) => {
  const host = await start(page);
  await host.form.getByRole('button', { name: '暂时跳过' }).click();
  await expect(page.getByTestId('home-view')).toBeVisible();
  await host.changeAccount({ id: 'second-existing-account' });
  await expect(page.getByTestId('home-view')).toBeVisible();
  await expect(host.form).toHaveCount(0);
  await host.changeAccount({ id: 'registration-new-account', receipt: { accountId: 'registration-new-account', deviceAuthorizationId: 'registration-authorization-one' } });
  await expect(page.getByTestId('home-view')).toBeVisible();
  await expect(host.form).toHaveCount(0);
  expect(host.invitationRequests).toEqual([]);
});
