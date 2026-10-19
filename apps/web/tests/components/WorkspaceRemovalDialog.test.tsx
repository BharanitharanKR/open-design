// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkspaceRemovalDialog } from '../../src/components/WorkspaceRemovalDialog';
import { clearWorkspaceRemoval, currentWorkspaceRemoval, publishWorkspaceRemoval } from '../../src/collab/workspace-removal';
import { workspaceContextFixture } from '../helpers/workspace-context';

const notify = vi.hoisted(() => vi.fn());
vi.mock('../../src/collab/useWorkspaceContext', () => ({ notifyWorkspaceContextRefresh: notify }));
const context = workspaceContextFixture({ workspaceId: 'team', workspaceMemberId: 'old', role: 'member' });
const target = { workspaceId: 'personal', workspaceMemberId: 'self', workspaceName: 'Personal', workspaceType: 'personal' as const, role: 'owner' as const, memberStatus: 'active' as const, lifecycleState: 'active' as const };
afterEach(() => { cleanup(); clearWorkspaceRemoval(); vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe('removed workspace recovery dialog', () => {
  it('keeps the notice and shows recovery failure when no owned default exists', async () => {
    const notice = { context, defaultWorkspace: null };
    publishWorkspaceRemoval(notice);
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    render(<WorkspaceRemovalDialog notice={notice} onRecovered={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible());
    expect(currentWorkspaceRemoval()).toBe(notice);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('ignores a default activation response after an account boundary clears the notice', async () => {
    const notice = { context, defaultWorkspace: target };
    publishWorkspaceRemoval(notice);
    let resolve!: (response: Response) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(done => { resolve = done; })));
    const recovered = vi.fn();
    render(<WorkspaceRemovalDialog notice={notice} onRecovered={recovered} />);
    fireEvent.click(screen.getByRole('button'));
    clearWorkspaceRemoval();
    resolve(new Response(JSON.stringify({ context: workspaceContextFixture({ workspaceId: 'personal', workspaceMemberId: 'self', role: 'owner' }) })));
    await new Promise(done => setTimeout(done, 0));
    expect(notify).not.toHaveBeenCalled();
    expect(recovered).not.toHaveBeenCalled();
  });
  it('activates the exact owned default before dismissing and returning home', async () => {
    const notice = { context, defaultWorkspace: target };
    publishWorkspaceRemoval(notice);
    const next = workspaceContextFixture({ workspaceId: 'personal', workspaceMemberId: 'self', role: 'owner' });
    const fetch = vi.fn<typeof globalThis.fetch>(async () => new Response(JSON.stringify({ context: next })));
    vi.stubGlobal('fetch', fetch);
    const recovered = vi.fn();
    render(<WorkspaceRemovalDialog notice={notice} onRecovered={recovered} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(recovered).toHaveBeenCalledOnce());
    expect(notify).toHaveBeenCalledWith({ context: next });
    expect(JSON.parse(fetch.mock.calls[0]![1]!.body as string)).toEqual({ workspaceId: 'personal', workspaceMemberId: 'self' });
    expect(currentWorkspaceRemoval()).toBeNull();
  });
});
