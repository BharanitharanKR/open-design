// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InviteDialog } from '../../src/components/InviteDialog';
import { workspaceContextFixture } from '../helpers/workspace-context';
const owner = workspaceContextFixture({ workspaceId: 'team-a', workspaceMemberId: 'owner-a', role: 'owner', workspaceName: 'Design team' });
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const sendButton = () => screen.getByRole('button', { name: /发送邀请|send invitations|确认并邀请|confirm and invite/i });
function email(value: string, index = 0) { fireEvent.change(screen.getAllByRole('textbox')[index]!, { target: { value } }); }
function response(results: unknown[]) { return new Response(JSON.stringify({ results }), { status: 200 }); }

describe('member-line invitation states', () => {
  it('does not gate free or full workspaces on purchased seats and closes immediately after actual success', async () => {
    const close = vi.fn(); const event = vi.fn(); window.addEventListener('od:workspace-invites-sent', event);
    vi.stubGlobal('fetch', vi.fn(async () => response([{ email: 'new@example.com', ok: true }])));
    try {
      render(<InviteDialog open workspaceContext={owner} availableSeats={0} freePlan onClose={close} />);
      email('new@example.com'); fireEvent.click(sendButton());
      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
      expect(event).toHaveBeenCalledTimes(1);
      expect((event.mock.calls[0]![0] as CustomEvent).detail).toEqual({ count: 1, totalCount: 1, workspaceId: 'team-a', workspaceMemberId: 'owner-a' });
    } finally { window.removeEventListener('od:workspace-invites-sent', event); }
  });
  it('does not present purchased seat usage as an authoritative member count', () => {
    const { container } = render(<InviteDialog open workspaceContext={{ ...owner, seatSummary: { ...owner.seatSummary, usedSeats: 77 } }} onClose={() => {}} />);
    expect(container.querySelector('p')?.textContent).toBe('Design team');
  });
  it.each(['admin', 'member'] as const)('does not allow %s to assign administrators even if the host requests a role menu', (role) => {
    render(<InviteDialog open workspaceContext={{ ...owner, role }} canAssignRoles onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: /分配角色|assign role|^角色$|^role$/i })).toBeNull();
  });
  it('marks invalid and subsequent duplicate emails inline without sending or clearing input', () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    render(<InviteDialog open workspaceContext={owner} onClose={() => {}} />);
    email('invalid'); fireEvent.click(sendButton()); expect(screen.getByRole('alert')).toBeTruthy();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('invalid');
    email('same@example.com'); fireEvent.click(screen.getByRole('button', { name: /添加成员|add member/i })); email('SAME@example.com', 1);
    fireEvent.click(sendButton());
    expect(screen.getAllByRole('textbox')[0]!.getAttribute('aria-invalid')).toBe('false');
    expect(screen.getAllByRole('textbox')[1]!.getAttribute('aria-invalid')).toBe('true');
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('removes only sent rows, retains failed roles and retries them once', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response([{ email: 'sent@example.com', ok: true }, { email: 'retry@example.com', ok: false, error: 'active_pending_invite' }]))
      .mockResolvedValueOnce(response([{ email: 'corrected@example.com', ok: true }]));
    const dispatch = vi.spyOn(window, 'dispatchEvent');
    vi.stubGlobal('fetch', fetcher); const close = vi.fn(); const submit = vi.fn();
    render(<InviteDialog open workspaceContext={owner} onClose={close} onSubmit={submit} />);
    email('sent@example.com'); fireEvent.click(screen.getByRole('button', { name: /添加成员|add member/i })); email('retry@example.com', 1); fireEvent.click(sendButton());
    await waitFor(() => expect(screen.getAllByRole('textbox')).toHaveLength(1));
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('retry@example.com'); expect(close).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    email('corrected@example.com'); fireEvent.click(sendButton()); await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
    expect(dispatch.mock.calls.map(([event]) => event).filter(event => event.type === 'od:workspace-invites-sent').map(event => (event as CustomEvent).detail.totalCount)).toEqual([1, 2]);
    expect(JSON.parse(fetcher.mock.calls[1]![1].body)).toEqual({ invites: [{ email: 'corrected@example.com', role: 'member' }] });
  });
  it('disables every editable control while sending and retains all inputs on transport failure', async () => {
    let reject!: (reason: unknown) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise((_resolve, fail) => { reject = fail; })));
    render(<InviteDialog open workspaceContext={owner} onClose={() => {}} />);
    email('member@example.com'); fireEvent.click(sendButton());
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: /添加成员|add member/i }) as HTMLButtonElement).disabled).toBe(true);
    reject(new TypeError('offline')); await screen.findByRole('alert');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('member@example.com');
  });
});
