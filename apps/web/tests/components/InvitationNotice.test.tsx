// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InvitationNotice } from '../../src/components/InvitationNotice';
afterEach(() => { cleanup(); vi.useRealTimers(); });
describe('InvitationNotice', () => {
  it.each(['success', 'error'] as const)('announces %s feedback and allows dismissal', (tone) => {
    const onClose = vi.fn();
    render(<InvitationNotice message="Delivery result" tone={tone} onClose={onClose} />);
    expect(screen.getByRole(tone === 'error' ? 'alert' : 'status')).toHaveTextContent('Delivery result');
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('keeps error feedback inside its dialog owner when portal is disabled', () => {
    render(<section data-testid="owner"><InvitationNotice message="Failed" tone="error" onClose={() => {}} portalToBody={false} /></section>);
    expect(screen.getByTestId('owner')).toContainElement(screen.getByRole('alert'));
  });
  it('dismisses after 3.2 seconds even when the parent renders again', async () => {
    vi.useFakeTimers(); const onClose = vi.fn();
    const view = render(<InvitationNotice message="Sent" tone="success" onClose={() => onClose()} />);
    await act(async () => { await vi.advanceTimersByTimeAsync(1600); });
    view.rerender(<InvitationNotice message="Sent" tone="success" onClose={() => onClose()} />);
    await act(async () => { await vi.advanceTimersByTimeAsync(1600); });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
