// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InviteEntry } from '../../src/components/InviteEntry';
import { inviteBannerStorageKey, notifyWorkspaceInvitationSent } from '../../src/collab/invite-banner';
import { advanceWorkspaceAccountGeneration, currentWorkspaceAccountGeneration, resetWorkspaceAccountGeneration } from '../../src/collab/workspace-identity';
import { workspaceContextFixture } from '../helpers/workspace-context';
const readStatus = vi.hoisted(() => vi.fn());
vi.mock('../../src/providers/daemon', () => ({ fetchVelaLoginStatus: readStatus }));
const context = workspaceContextFixture({ workspaceId: 'team', workspaceMemberId: 'member-a', role: 'owner', permissions: { canInviteMembers: true, canManageBilling: true, canManageMembers: true, canManageAutoRecharge: true, canShareProjects: true, canWriteSyncedFiles: true, canViewWorkspaceSettings: true, canManageSharedResources: true } });
const status = (id: string) => ({ loggedIn: true, user: { id } });
afterEach(() => { cleanup(); localStorage.clear(); readStatus.mockReset(); resetWorkspaceAccountGeneration(); });
describe('account-scoped invitation banner', () => {
  it('remembers dismissal across workspaces without hiding another account banner', async () => {
    readStatus.mockResolvedValue(status('account-a'));
    const view = render(<InviteEntry context={context} banner />);
    fireEvent.click(await screen.findByRole('button', { name: /dismiss invitation banner/i }));
    expect(localStorage.getItem(inviteBannerStorageKey('account-a'))).toBe('1');
    view.rerender(<InviteEntry context={{ ...context, workspaceId: 'other-team' }} banner />);
    expect(screen.queryByRole('button', { name: /dismiss invitation banner/i })).toBeNull();
    readStatus.mockResolvedValue(status('account-b'));
    advanceWorkspaceAccountGeneration('account-b');
    view.rerender(<InviteEntry context={{ ...context, workspaceMemberId: 'member-b' }} accountGeneration={1} banner />);
    expect(await screen.findByRole('button', { name: /dismiss invitation banner/i })).toBeVisible();
  });
  it('consumes delivery from another entry without another login status read', async () => {
    readStatus.mockResolvedValue(status('account-a'));
    render(<InviteEntry context={context} banner />);
    await screen.findByRole('button', { name: /dismiss invitation banner/i });
    await notifyWorkspaceInvitationSent(context, currentWorkspaceAccountGeneration());
    await waitFor(() => expect(screen.queryByRole('button', { name: /dismiss invitation banner/i })).toBeNull());
    expect(readStatus).toHaveBeenCalledOnce();
    expect(localStorage.getItem(inviteBannerStorageKey('account-a'))).toBe('1');
  });
  it('does not persist fallback identity after the account changes', async () => {
    let resolve!: (value: ReturnType<typeof status>) => void;
    readStatus.mockReturnValue(new Promise((done) => { resolve = done; }));
    const task = notifyWorkspaceInvitationSent(context, currentWorkspaceAccountGeneration());
    advanceWorkspaceAccountGeneration('next-account');
    resolve(status('account-b')); await task;
    expect(localStorage.getItem(inviteBannerStorageKey('account-b'))).toBeNull();
  });
  it('reads status only on delivered invitations when no banner is mounted', async () => {
    readStatus.mockResolvedValue(status('account-a'));
    render(<InviteEntry context={context} />);
    expect(readStatus).not.toHaveBeenCalled();
    await notifyWorkspaceInvitationSent(context, currentWorkspaceAccountGeneration());
    expect(readStatus).toHaveBeenCalledOnce();
    expect(localStorage.getItem(inviteBannerStorageKey('account-a'))).toBe('1');
  });
});
