// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useCommentPreparationConfirmation } from '../../src/components/CommentPreparationConfirmation';

afterEach(() => {
  cleanup();
  document.querySelectorAll('[data-consent-fixture]').forEach(node => node.remove());
  document.body.style.overflow = '';
  vi.restoreAllMocks();
});

function setup() {
  const onDecision = vi.fn();
  let request!: () => void;
  function Harness() {
    const confirmation = useCommentPreparationConfirmation();
    request = () => { void confirmation.confirm().then(onDecision); };
    return <>{confirmation.dialog}<button>Background action</button><iframe title="Preview" /></>;
  }
  const opener = document.createElement('button');
  opener.dataset.consentFixture = '';
  document.body.appendChild(opener);
  const view = render(<Harness />);
  opener.focus();
  act(() => request());
  const dialog = screen.getByRole('alertdialog');
  const cancel = within(dialog).getByRole('button', { name: 'Cancel' });
  const save = within(dialog).getByRole('button', { name: 'Save' });
  return { ...view, opener, dialog, cancel, save, onDecision };
}

it('keeps Cancel initial focus and wraps Tab and Shift+Tab within consent', () => {
  const { cancel, save, onDecision } = setup();
  expect(document.activeElement).toBe(cancel);
  expect(fireEvent.keyDown(cancel, { key: 'Tab' })).toBe(false);
  expect(document.activeElement).toBe(save);
  fireEvent.keyDown(save, { key: 'Tab' });
  expect(document.activeElement).toBe(cancel);
  fireEvent.keyDown(cancel, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(save);
  fireEvent.keyDown(save, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(cancel);
  expect(onDecision).not.toHaveBeenCalled();
});

it('isolates existing and newly portaled background controls, including the preview', async () => {
  const retained = document.createElement('div');
  retained.setAttribute('inert', 'retained');
  retained.dataset.consentFixture = '';
  document.body.appendChild(retained);
  const { container, opener, dialog, cancel } = setup();
  expect(container.hasAttribute('inert')).toBe(true);
  expect(opener.hasAttribute('inert')).toBe(true);
  expect(dialog.parentElement?.hasAttribute('inert')).toBe(false);
  screen.getByRole('button', { name: 'Background action' }).focus();
  expect(document.activeElement).toBe(cancel);
  screen.getByTitle('Preview').focus();
  expect(document.activeElement).toBe(cancel);
  const latePortal = document.createElement('button');
  latePortal.dataset.consentFixture = '';
  await act(async () => { document.body.appendChild(latePortal); });
  expect(latePortal.hasAttribute('inert')).toBe(true);
  latePortal.focus();
  expect(document.activeElement).toBe(cancel);
  fireEvent.click(cancel);
  expect(container.hasAttribute('inert')).toBe(false);
  expect(opener.hasAttribute('inert')).toBe(false);
  expect(latePortal.hasAttribute('inert')).toBe(false);
  expect(retained.getAttribute('inert')).toBe('retained');
  latePortal.focus();
  expect(document.activeElement).toBe(latePortal);
});

it.each(['cancel', 'escape', 'backdrop', 'save', 'unmount'] as const)(
  '%s restores connected opener and background state, resolving consent exactly once', async action => {
    document.body.style.overflow = 'auto';
    const { container, opener, dialog, cancel, save, unmount, onDecision } = setup();
    expect(document.body.style.overflow).toBe('hidden');
    if (action === 'cancel') fireEvent.click(cancel);
    if (action === 'escape') fireEvent.keyDown(cancel, { key: 'Escape' });
    if (action === 'backdrop') fireEvent.click(dialog.parentElement!);
    if (action === 'save') fireEvent.click(save);
    if (action === 'unmount') unmount();
    await act(async () => {});
    expect(onDecision).toHaveBeenCalledExactlyOnceWith(action === 'save');
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(container.hasAttribute('inert')).toBe(false);
    expect(opener.hasAttribute('inert')).toBe(false);
    expect(document.body.style.overflow).toBe('auto');
    expect(document.activeElement).toBe(opener);
  },
);

it('does not try restoring an opener removed while consent was open', () => {
  const { opener, cancel } = setup();
  opener.remove();
  const focus = vi.spyOn(opener, 'focus');
  fireEvent.click(cancel);
  expect(focus).not.toHaveBeenCalled();
});
