// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InviteDialog } from '../../src/components/InviteDialog';
import { advanceWorkspaceAccountGeneration, resetWorkspaceAccountGeneration } from '../../src/collab/workspace-identity';
import { WORKSPACE_CONTEXT_REFRESH_EVENT } from '../../src/collab/workspace-context-events';
import { workspaceContextFixture } from '../helpers/workspace-context';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); resetWorkspaceAccountGeneration(); });
vi.mock('../../src/providers/daemon', () => ({ fetchVelaLoginStatus: vi.fn(async () => null) }));
const context = workspaceContextFixture({ workspaceId: 'workspace-team', workspaceMemberId: 'member-test', role: 'owner' });
const submit = () => fireEvent.click(screen.getByRole('button', { name: /发送邀请|send invitation/i }));
const fill = (index: number, value: string) => fireEvent.change(screen.getAllByRole('textbox')[index]!, { target: { value } });
describe('invitation submission', () => {
  it('retains only failed drafts, retries them, and accumulates delivered counts', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ results: [{ email: 'one@example.com', ok: true }, { email: 'two@example.com', ok: false, error: 'active_pending_invite' }] }))).mockResolvedValueOnce(new Response(JSON.stringify({ results: [{ email: 'two@example.com', ok: true }] })));
    vi.stubGlobal('fetch', fetch);
    const onSent = vi.fn(); const onClose = vi.fn();
    render(<InviteDialog open workspaceContext={context} onSent={onSent} onClose={onClose} />);
    fill(0, 'one@example.com');
    fireEvent.click(screen.getByRole('button', { name: /添加成员|add member/i }));
    fill(1, 'two@example.com'); submit();
    await waitFor(() => expect(screen.getAllByRole('textbox')).toHaveLength(1));
    expect(screen.getByRole('textbox')).toHaveValue('two@example.com');
    expect(onClose).not.toHaveBeenCalled();
    submit();
    await waitFor(() => expect(onSent).toHaveBeenCalledWith(2));
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('freezes draft edits and dismissal while submitting', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    const onClose = vi.fn();
    render(<InviteDialog open workspaceContext={context} onClose={onClose} />);
    fill(0, 'one@example.com'); submit();
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: /添加成员|add member/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /关闭|close/i }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
  it('ignores an old workspace response after switching context', async () => {
    let resolve!: (response: Response) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((done) => { resolve = done; })));
    const onSent = vi.fn(); const onClose = vi.fn();
    const view = render(<InviteDialog open workspaceContext={context} onClose={onClose} onSent={onSent} />);
    fill(0, 'one@example.com'); submit();
    view.rerender(<InviteDialog open workspaceContext={{ ...context, workspaceId: 'another-workspace' }} onClose={onClose} onSent={onSent} />);
    resolve(new Response(JSON.stringify({ results: [{ email: 'one@example.com', ok: true }] })));
    await waitFor(() => expect(screen.getByRole('textbox')).not.toBeDisabled());
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(onSent).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
  it('clears an old account draft even when workspace identity fields are unchanged', () => {
    const onClose = vi.fn();
    render(<InviteDialog open workspaceContext={context} onClose={onClose} />);
    fill(0, 'old-account@example.com');
    advanceWorkspaceAccountGeneration('new-account');
    fireEvent(window, new Event(WORKSPACE_CONTEXT_REFRESH_EVENT));
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('traps Tab, closes the role menu before the dialog, and restores the trigger', () => {
    const trigger = document.createElement('button'); document.body.append(trigger); trigger.focus();
    const onClose = vi.fn();
    const view = render(<InviteDialog open workspaceContext={context} onClose={onClose} />);
    const send = screen.getByRole('button', { name: /send invitation/i });
    // Empty send is disabled, so cancel is the final keyboard target.
    const cancel = screen.getByRole('button', { name: /cancel/i }); cancel.focus();
    expect(cancel).toHaveFocus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(screen.getByRole('button', { name: /^close$/i })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: /assign role/i }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull(); expect(onClose).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: 'Escape' }); expect(onClose).toHaveBeenCalledOnce();
    view.rerender(<InviteDialog open={false} workspaceContext={context} onClose={onClose} />);
    expect(trigger).toHaveFocus(); trigger.remove();
    expect(send).toBeDisabled();
  });
  it.each(['admin', 'member'] as const)('keeps %s role fixed to member', (role) => {
    render(<InviteDialog open workspaceContext={workspaceContextFixture({ workspaceId: 'workspace-team', workspaceMemberId: 'member-test', role })} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /默认身份|default role/i })).toBeDisabled();
  });
});
