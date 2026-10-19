// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InviteEntry } from '../../src/components/InviteEntry';
import { inviteBannerStorageKey } from '../../src/collab/invite-banner';
import { advanceWorkspaceAccountGeneration, resetWorkspaceAccountGeneration } from '../../src/collab/workspace-identity';
import { workspaceContextFixture } from '../helpers/workspace-context';
const readStatus = vi.hoisted(() => vi.fn());
vi.mock('../../src/providers/daemon', () => ({ fetchVelaLoginStatus: readStatus }));
const context = workspaceContextFixture({ workspaceId: 'team', workspaceMemberId: 'member-a', role: 'owner', permissions: { canInviteMembers: true, canManageBilling: true, canManageMembers: true, canManageAutoRecharge: true, canShareProjects: true, canWriteSyncedFiles: true, canViewWorkspaceSettings: true, canManageSharedResources: true } });
const status = (id: string) => ({ loggedIn: true, user: { id } });
afterEach(() => { cleanup(); localStorage.clear(); readStatus.mockReset(); resetWorkspaceAccountGeneration(); vi.unstubAllGlobals(); });
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
  it('keeps the homepage banner after a regular invitation is sent', async () => {
    readStatus.mockResolvedValue(status('account-a'));
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ results: [{ email: 'colleague@example.com', ok: true }] }))));
    render(<InviteEntry context={context} banner />);
    await screen.findByRole('button', { name: /dismiss invitation banner/i });
    fireEvent.click(screen.getByRole('button', { name: /^invite$/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'colleague@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send invitations/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByRole('status')).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: /dismiss invitation banner/i })).toBeVisible();
    expect(localStorage.getItem(inviteBannerStorageKey('account-a'))).toBeNull();
    expect(readStatus).toHaveBeenCalledOnce();
  });
  it('does not read account status or persist banner dismissal after a regular permanent-entry invitation', async () => {
    readStatus.mockResolvedValue(status('account-a'));
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ results: [{ email: 'colleague@example.com', ok: true }] }))));
    render(<InviteEntry context={context} />);
    fireEvent.click(screen.getByRole('button', { name: /^invite$/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'colleague@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send invitations/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(readStatus).not.toHaveBeenCalled();
    expect(localStorage.getItem(inviteBannerStorageKey('account-a'))).toBeNull();
  });
});
