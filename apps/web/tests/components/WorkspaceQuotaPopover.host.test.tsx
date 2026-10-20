// @vitest-environment jsdom
// C-01 / E12, VIEW-001/017: real top-right host stays reachable before billing resolves.
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { EntryNavRail, resetWorkspaceDirectoryCache } from '../../src/components/EntryNavRail';
import { I18nProvider } from '../../src/i18n';
import { workspaceContextFixture } from '../helpers/workspace-context';

afterEach(() => { cleanup(); resetWorkspaceDirectoryCache(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it('E12 clicking the quota pill opens the skeleton without navigating or guessing zero', async () => {
  const open = vi.spyOn(window, 'open').mockReturnValue(null);
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({})));
  const context = workspaceContextFixture({ workspaceId: 'a', workspaceMemberId: 'member-a', role: 'owner', planId: 'pro' });
  await act(async () => { render(<I18nProvider initial="zh-CN"><EntryNavRail view="home" onViewChange={() => {}} onNewProject={() => {}} open context={context} billing={null} billingResponse={null} /></I18nProvider>); });
  fireEvent.click(screen.getByTestId('entry-top-right-credits'));
  expect(screen.getByTestId('workspace-quota-skeleton')).toBeTruthy();
  expect(screen.getByTestId('entry-top-right-credits').getAttribute('aria-expanded')).toBe('true');
  expect(screen.queryByText('$0.00')).toBeNull();
  expect(open).not.toHaveBeenCalled();
});
