import { afterEach, describe, expect, it } from 'vitest';
import type { WorkspaceCollabContext, WorkspaceDirectoryItem } from '@open-design/contracts';
import { clearWorkspaceRemoval, currentWorkspaceRemoval, publishWorkspaceRemoval, removedCurrentWorkspace } from '../src/collab/workspace-removal';

const context = { workspaceId: 'team', workspaceMemberId: 'old-member', workspaceName: 'Design team' } as WorkspaceCollabContext;
const selection = { workspaceId: 'team', workspaceMemberId: 'old-member' };
const personal: WorkspaceDirectoryItem = { workspaceId: 'own', workspaceMemberId: 'own-member', workspaceName: 'My space', workspaceType: 'personal', role: 'owner', memberStatus: 'active', lifecycleState: 'active' };
afterEach(clearWorkspaceRemoval);

describe('confirmed workspace membership removal', () => {
  it('offers only the active owned personal workspace as default', () => {
    expect(removedCurrentWorkspace(context, selection, [personal])?.defaultWorkspace).toEqual(personal);
    expect(removedCurrentWorkspace(context, selection, [{ ...personal, workspaceType: 'team' }])?.defaultWorkspace).toBeNull();
    expect(removedCurrentWorkspace(context, selection, [{ ...personal, role: 'member' }])?.defaultWorkspace).toBeNull();
  });
  it('does not report deliberate workspace selection as removal', () => {
    expect(removedCurrentWorkspace(context, { ...selection, workspaceId: 'other' }, [])).toBeNull();
  });
  it('does not interrupt the current workspace when a different membership disappears', () => {
    const current = { ...personal, workspaceId: 'team', workspaceMemberId: 'old-member', workspaceType: 'team' as const };
    expect(removedCurrentWorkspace(context, selection, [current])).toBeNull();
  });
  it('treats a rejoined membership as a new principal', () => {
    expect(removedCurrentWorkspace(context, selection, [{ ...personal, workspaceId: 'team', workspaceMemberId: 'new-member' }])).not.toBeNull();
  });
  it('retains the first removal until acknowledged', () => {
    const notice = removedCurrentWorkspace(context, selection, [personal])!;
    publishWorkspaceRemoval(notice);
    publishWorkspaceRemoval({ ...notice, defaultWorkspace: null });
    expect(currentWorkspaceRemoval()).toBe(notice);
    clearWorkspaceRemoval();
    expect(currentWorkspaceRemoval()).toBeNull();
  });
});
