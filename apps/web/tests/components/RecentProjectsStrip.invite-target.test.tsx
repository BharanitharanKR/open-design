// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { afterEach, describe, expect, it, vi } from 'vitest';

const workspaceState = vi.hoisted(() => ({
  context: null as WorkspaceCollabContext | null,
}));

vi.mock('../../src/collab/useTeamMembers', () => ({
  useTeamMembers: () => ({ resolve: () => null }),
}));

vi.mock('../../src/collab/useWorkspaceContext', () => ({
  notifyTeamProjectsChanged: vi.fn(),
  useWorkspaceBilling: () => null,
  useWorkspaceContext: () => ({ context: workspaceState.context }),
}));

vi.mock('../../src/collab/workspace-events', () => ({
  useWorkspaceInvalidation: vi.fn(),
}));

vi.mock('../../src/providers/registry', () => ({
  fetchProjectFiles: vi.fn(async () => []),
  fetchProjectFileText: vi.fn(async () => null),
  projectFileUrl: (projectId: string, fileName: string) =>
    `/api/projects/${projectId}/files/${fileName}`,
}));

import { RecentProjectsStrip } from '../../src/components/RecentProjectsStrip';

function teamContext(availableSeats: number): WorkspaceCollabContext {
  return {
    workspaceId: 'ws-team',
    workspaceType: 'team',
    workspaceMemberId: 'wm-owner',
    role: 'owner',
    memberStatus: 'active',
    lifecycleState: 'active',
    billingState: 'active',
    planId: 'team_plus',
    seatSummary: {
      seatLimit: 5,
      usedSeats: 5 - availableSeats,
      availableSeats,
      isSeatFull: availableSeats <= 0,
    },
    permissions: {
      canInviteMembers: true,
      canManageBilling: true,
      canShareProjects: true,
      canManageSharedResources: true,
    },
    teamId: 'team-1',
    workspaceSettingsUrl: 'https://web.example.com/console/settings?workspaceId=ws-team',
  } as unknown as WorkspaceCollabContext;
}

function renderTeamProjects() {
  return render(
    <RecentProjectsStrip
      projects={[]}
      heading="All projects"
      onOpen={() => {}}
      space="team"
    />,
  );
}

afterEach(() => {
  cleanup();
  workspaceState.context = null;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('RecentProjectsStrip invite target (recvqgbyLNk4eE)', () => {
  it('opens the local invitation dialog even when historical seats are full', () => {
    workspaceState.context = teamContext(0);
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    renderTeamProjects();
    fireEvent.click(screen.getByRole('button', { name: /Invite teammates|邀请同事/ }));

    expect(openSpy).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('keeps the local invite dialog for a team with available seats', () => {
    workspaceState.context = teamContext(3);
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    renderTeamProjects();

    fireEvent.click(screen.getByRole('button', { name: /Invite teammates|邀请同事/ }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it.each([
    [
      'explicitly revoked invitation capability',
      {
        ...teamContext(3),
        permissions: { ...teamContext(3).permissions, canInviteMembers: false },
      },
    ],
    ['departed member', { ...teamContext(3), memberStatus: 'removed' }],
    ['locked workspace', { ...teamContext(3), lifecycleState: 'locked' }],
  ] as const)('hides the invitation entry for %s', (_label, context) => {
    workspaceState.context = context as WorkspaceCollabContext;
    renderTeamProjects();

    fireEvent.click(screen.getByRole('button', { name: /Invite teammates|邀请同事/ }));

    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getAllByRole('textbox')[0]!, {
      target: { value: 'teammate@example.com' },
    });
    fireEvent.click(
      within(dialog).getByRole('button', { name: /Send invitations|发送邀请|Confirm and invite|确认并邀请/i }),
    );

    await vi.waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    const calls = fetchSpy.mock.calls as unknown[][];
    expect(String(calls[0]?.[0])).toContain('/api/workspace/invite');
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('keeps local invitations available without a console URL', () => {
    workspaceState.context = {
      ...teamContext(0),
      workspaceSettingsUrl: null,
    } as unknown as WorkspaceCollabContext;
    renderTeamProjects();

    expect(
      screen.queryByRole('button', { name: /Invite teammates|邀请同事/ }),
    ).toBeTruthy();
  });

  it('does not replace denied invitation permission with billing authority', () => {
    const context = teamContext(0);
    workspaceState.context = {
      ...context,
      permissions: { ...context.permissions, canInviteMembers: false },
    } as WorkspaceCollabContext;
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    renderTeamProjects();

    expect(screen.queryByRole('button', { name: /Invite teammates|邀请同事/ })).toBeNull();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('does not expose billing recovery to a Team admin without direct invite capability', () => {
    const context = teamContext(3);
    workspaceState.context = {
      ...context,
      role: 'admin',
      permissions: {
        ...context.permissions,
        canInviteMembers: false,
        canManageBilling: false,
      },
    } as WorkspaceCollabContext;
    renderTeamProjects();

    expect(
      screen.queryByRole('button', { name: /Invite teammates|邀请同事/ }),
    ).toBeNull();
  });

  it('lets a full Team admin invite members without buying seats', () => {
    const context = teamContext(0);
    workspaceState.context = {
      ...context,
      role: 'admin',
      permissions: { ...context.permissions, canManageBilling: false },
    } as WorkspaceCollabContext;
    renderTeamProjects();

    expect(
      screen.queryByRole('button', { name: /Invite teammates|邀请同事/ }),
    ).toBeTruthy();
  });

  it('exposes the invite entry to an authorized Team member', () => {
    const context = teamContext(3);
    workspaceState.context = {
      ...context,
      role: 'member',
      permissions: {
        ...context.permissions,
        canInviteMembers: true,
        canManageBilling: true,
      },
    } as WorkspaceCollabContext;
    renderTeamProjects();

    expect(
      screen.queryByRole('button', { name: /Invite teammates|邀请同事/ }),
    ).toBeTruthy();
  });
});
