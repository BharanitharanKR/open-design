// @vitest-environment jsdom
// VIEW-001/002/003/010-CLIENT/012/017/021; JSON E/A11 state content is authority.
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkspaceQuotaPopover } from '../../src/components/WorkspaceQuotaPopover';
import { workspaceQuotaView, type WorkspaceQuotaTier, type WorkspaceQuotaView } from '../../src/collab/workspace-quota-view';
import { WORKSPACE_BILLING_REFRESH_EVENT } from '../../src/collab/useWorkspaceContext';
import { quotaPopoverConsoleUrl } from '../../src/runtime/workspace-quota-links';
import { I18nProvider } from '../../src/i18n';
import { workspaceContextFixture } from '../helpers/workspace-context';

const context = workspaceContextFixture({ workspaceId: 'workspace-a', workspaceMemberId: 'member-a', role: 'owner' });
function view(tier: WorkspaceQuotaTier, balanceUsd = '24', remainingPercent = 75): WorkspaceQuotaView {
  return {
    tier, planKnown: true, loading: false, balanceUsd, planStatus: null,
    windows: tier === 'free' ? [] : (tier === 'go' ? [18_000, 604_800] : [604_800]).map(durationSeconds => ({
      durationSeconds, remainingPercent, resetsAt: '2026-10-22T06:00:00Z',
    })),
    breakdown: null, modelRestriction: null,
  };
}
function panel(value: WorkspaceQuotaView, role: 'owner' | 'admin' | 'member' = 'owner') {
  return <I18nProvider initial="zh-CN"><WorkspaceQuotaPopover context={{ ...context, role }} view={value} profile="local" /></I18nProvider>;
}
beforeEach(() => { vi.spyOn(window, 'open').mockReturnValue(null); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

const cases: Array<[string, WorkspaceQuotaTier, string, number]> = [
  ['E01', 'free', '0.50', 75], ['E03', 'go', '24', 75], ['E04', 'pro', '24', 75],
  ['E06', 'pro', '24', 0], ['E07', 'go', '0', 0], ['E09', 'free', '24', 75],
  ['E13', 'plus', '24', 75], ['E14', 'max', '24', 75], ['E15', 'go', '0', 75],
  ['E16', 'plus', '0', 75], ['E17', 'pro', '0', 75], ['E18', 'max', '0', 75], ['A11', 'free', '0', 75],
];
describe('C-01 state and role matrix (VIEW-001/002/021)', () => {
  for (const [id, tier, balance, percent] of cases) {
    it.each(['owner', 'admin', 'member'] as const)(`${id} ${tier}: %s sees the shared amount and its role action`, role => {
      render(panel(view(tier, balance, percent), role));
      expect(screen.getByRole('region', { name: 'Design Plan' })).toBeTruthy();
      expect(screen.getByRole('region', { name: '按量额度' })).toBeTruthy();
      expect(screen.getByText(`$${Number(balance).toFixed(2)}`)).toBeTruthy();
      expect(screen.queryAllByRole('progressbar').length).toBe(tier === 'go' ? 2 : tier === 'free' ? 0 : 1);
      if (tier === 'free') expect(screen.getByText('未订阅')).toBeTruthy();
      else for (const bar of screen.getAllByRole('progressbar')) expect(bar.getAttribute('aria-valuenow')).toBe(String(percent));
      const action = tier === 'max' ? '管理' : '升级';
      if (role === 'owner') {
        fireEvent.click(screen.getByRole('button', { name: action }));
        expect(window.open).toHaveBeenLastCalledWith(quotaPopoverConsoleUrl('local', 'workspace-a', tier === 'max' ? 'console' : 'plans'), '_blank', 'noopener,noreferrer');
      } else {
        expect(screen.getByText('联系 Owner')).toBeTruthy();
        expect(screen.queryByRole('button', { name: /升级|管理/ })).toBeNull();
      }
      // VIEW-003: every role's arrow is a view link, never a recharge intent.
      fireEvent.click(screen.getByRole('button', { name: '查看余额' }));
      expect(window.open).toHaveBeenLastCalledWith(quotaPopoverConsoleUrl('local', 'workspace-a'), '_blank', 'noopener,noreferrer');
    });
  }
});

it.each(['free', 'go', 'plus', 'pro', 'max'] as const)('E12 %s retains header with only the required gray skeleton rows (VIEW-017)', tier => {
  render(panel({ ...view(tier), loading: true }));
  expect(screen.getByRole('img', { name: tier })).toBeTruthy();
  expect(screen.getByTestId('workspace-quota-skeleton').getAttribute('aria-busy')).toBe('true');
  expect(screen.queryAllByTestId('workspace-quota-window-skeleton')).toHaveLength(tier === 'free' ? 0 : tier === 'go' ? 2 : 1);
  expect(screen.queryByText(/加载|重试|刷新|错误|明细暂不可用|\$0/)).toBeNull();
  expect(screen.queryByRole('progressbar')).toBeNull();
  expect(screen.queryByRole('alert')).toBeNull();
});

it('E03 missing breakdown/modelRestriction/windows stays unavailable, never fake $0 (VIEW-012)', () => {
  render(panel({ ...view('go'), windows: null, balanceUsd: null }));
  expect(screen.getAllByText('明细暂不可用').length).toBeGreaterThan(0);
  expect(screen.getByText('5 小时')).toBeTruthy();
  expect(screen.getByText('7 天')).toBeTruthy();
  expect(screen.queryByText('$0.00')).toBeNull();
  expect(screen.queryByRole('progressbar')).toBeNull();
});
it('E09 displays server merged total without adding gift/recharge or expiring them (VIEW-021)', () => {
  render(panel({ ...view('free', '40.30'), breakdown: null }));
  expect(screen.getByText('$40.30')).toBeTruthy();
  expect(screen.queryByText('$0.50')).toBeNull();
});
it('E03 C-04 open, workspace/member change, reopen and manual refresh signal the existing reader', () => {
  const refresh = vi.fn();
  window.addEventListener(WORKSPACE_BILLING_REFRESH_EVENT, refresh);
  const mounted = render(panel(view('pro')));
  expect(refresh).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: '刷新' }));
  expect(refresh).toHaveBeenCalledTimes(2);
  mounted.rerender(<I18nProvider initial="zh-CN"><WorkspaceQuotaPopover view={view('pro')} context={{ ...context, workspaceId: 'workspace-b', workspaceMemberId: 'member-b' }} /></I18nProvider>);
  expect(refresh).toHaveBeenCalledTimes(3);
  mounted.unmount();
  render(panel(view('pro')));
  expect(refresh).toHaveBeenCalledTimes(4);
  window.removeEventListener(WORKSPACE_BILLING_REFRESH_EVENT, refresh);
});
it('E09 no workspace id hides links/actions and never fabricates a destination', () => {
  render(<I18nProvider initial="zh-CN"><WorkspaceQuotaPopover context={null} view={view('free', '0')} /></I18nProvider>);
  expect(screen.queryByRole('button')).toBeNull();
  expect(quotaPopoverConsoleUrl('local', null)).toBeNull();
});
it.each(['expired', 'canceled'])('E04 C-05 preserves neutral presentation for server status %s, never infers from reset dates', status => {
  render(panel({ ...view('pro'), planStatus: status }));
  expect(document.querySelector('[data-plan-status]')?.getAttribute('data-plan-status')).toBe(status);
  expect(screen.getByRole('img', { name: 'pro' })).toBeTruthy();
  expect(screen.queryByText(/已到期|已取消/)).toBeNull();
});

it('E03 adapter ignores account buckets and rejects foreign workspace/member balances (VIEW-012)', () => {
  const foreign = { summary: null, workspaceBalance: { workspaceId: 'b', workspaceMemberId: 'b-member', billingScopeVersion: 2 as const, balanceUsd: '99', expiresAt: null, updatedAt: null } };
  const state = workspaceQuotaView({ context: { ...context, planId: 'team_go' }, response: foreign, tier: 'team_go', balanceUsd: '88' });
  expect(state.balanceUsd).toBeNull();
  expect(state.tier).toBe('go');
  expect(state.windows).toBeNull();
  expect(state.planStatus).toBeNull();
  render(panel(state));
  expect(screen.queryByText(/\$99|\$88|\$0.00/)).toBeNull();
});
it('A11 adapter distinguishes explicit server zero from absent balance (VIEW-012)', () => {
  const response = { summary: null, workspaceBalance: { workspaceId: context.workspaceId, workspaceMemberId: context.workspaceMemberId, billingScopeVersion: 2 as const, balanceUsd: '0', expiresAt: null, updatedAt: null } };
  const state = workspaceQuotaView({ context: { ...context, planId: null, billingState: 'free' }, response, tier: 'free' });
  expect(state.balanceUsd).toBe('0');
  expect(state.loading).toBe(false);
  expect(workspaceQuotaView({ context: workspaceContextFixture({ ...context, planId: null, billingState: undefined }), response: null, tier: null }).tier).toBeNull();
  expect(workspaceQuotaView({ context, response: null, tier: null }).balanceUsd).toBeNull();
});

it('E09 current workspace Free overrides an account advisory Max tier (VIEW-012)', () => {
  const free = { ...context, planId: null, billingState: 'free' as const };
  const state = workspaceQuotaView({ context: free, response: { summary: null, workspaceBalance: null }, tier: 'team_max' });
  expect(state.tier).toBe('free');
  expect(state.balanceUsd).toBeNull();
});
it('E04 a matching workspace snapshot outranks an older context plan (VIEW-012)', () => {
  const state = workspaceQuotaView({ context: { ...context, planId: 'free' }, tier: 'free', response: {
    summary: null, workspaceBalance: null,
    workspaceSnapshot: { schemaVersion: 1, billingScopeVersion: 2, workspaceId: context.workspaceId, workspaceMemberId: context.workspaceMemberId,
      billing: { billingState: 'active', planId: 'team_pro' }, wallet: { balanceUsd: '24', expiresAt: null, updatedAt: null }, revisions: { billing: 'b1', wallet: 'w1' } },
  } });
  expect(state.tier).toBe('pro');
});
it('E04 preserves the existing readable locked-workspace billing entrance', () => {
  render(<I18nProvider initial="zh-CN"><WorkspaceQuotaPopover context={{ ...context, lifecycleState: 'locked' }} view={view('pro')} /></I18nProvider>);
  expect(screen.getByRole('button', { name: '升级' })).toBeTruthy();
  expect(screen.getByRole('button', { name: '查看余额' })).toBeTruthy();
});

it('E12 keeps a scoped host Go header and two skeletons while a directory-only read is pending', () => {
  const unknown = workspaceContextFixture({ ...context, workspaceType: 'personal', planId: null, billingState: undefined });
  const state = workspaceQuotaView({ context: unknown, response: null, tier: 'go' });
  render(panel(state));
  expect(screen.getByRole('img', { name: 'go' })).toBeTruthy();
  expect(screen.getAllByTestId('workspace-quota-window-skeleton')).toHaveLength(2);
});
