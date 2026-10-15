import { useEffect, useId, useRef, useState } from 'react';
import { Button, Dialog, DialogDescription, DialogFooter, DialogTitle } from '@open-design/components';
import { useT } from '../i18n';

/** App-owned consent: native confirm can be suppressed by an embedded host.
 * Resolving this dialog grants intent only; the preparation controller must
 * recheck its captured live revision before it reads or writes authored source.
 */
export function useCommentPreparationConfirmation() {
  const t = useT();
  const dialogId = useId();
  const cancelButton = useRef<HTMLButtonElement>(null);
  const saveButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [open, setOpen] = useState(false);
  const pending = useRef<{ resolve: (accepted: boolean) => void; opener: HTMLElement | null } | null>(null);
  useEffect(() => () => { pending.current?.resolve(false); pending.current = null; }, []);
  useEffect(() => {
    if (!open) return;
    const panel = document.getElementById(dialogId);
    const backdrop = panel?.parentElement;
    if (!panel || !backdrop) return;
    const opener = pending.current?.opener;
    const previousOverflow = document.body.style.overflow;
    const isolated = new Set<Element>();
    // The shared Dialog portals its backdrop to body. Isolate only this
    // consumer's background, preserving pre-existing inert attributes.
    const isolateBackground = () => {
      for (const sibling of Array.from(document.body.children)) {
        if (sibling !== backdrop && !sibling.hasAttribute('inert')) {
          sibling.setAttribute('inert', '');
          isolated.add(sibling);
        }
      }
    };
    isolateBackground();
    const observer = new MutationObserver(isolateBackground);
    observer.observe(document.body, { childList: true });
    document.body.style.overflow = 'hidden';
    const containFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !panel.contains(event.target)) {
        event.stopPropagation();
        cancelButton.current?.focus({ preventScroll: true });
      }
    };
    const cycleFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || event.ctrlKey || event.altKey || event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      // This consent has exactly two controls. Explicit cycling also keeps
      // focus out of browser chrome at either boundary.
      const first = cancelButton.current;
      const last = saveButton.current;
      const next = event.shiftKey
        ? (document.activeElement === last ? first : last)
        : (document.activeElement === first ? last : first);
      next?.focus({ preventScroll: true });
    };
    document.addEventListener('focusin', containFocus, true);
    document.addEventListener('keydown', cycleFocus, true);
    cancelButton.current?.focus({ preventScroll: true });
    return () => {
      observer.disconnect();
      document.removeEventListener('focusin', containFocus, true);
      document.removeEventListener('keydown', cycleFocus, true);
      for (const sibling of isolated) sibling.removeAttribute('inert');
      document.body.style.overflow = previousOverflow;
      // Restoration must follow isolation cleanup, including on unmount.
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, dialogId]);
  function finish(accepted: boolean) {
    const request = pending.current;
    pending.current = null;
    setOpen(false);
    request?.resolve(accepted);
  }
  function confirm(): Promise<boolean> {
    if (pending.current) return Promise.resolve(false);
    return new Promise(resolve => {
      pending.current = { resolve, opener: document.activeElement instanceof HTMLElement ? document.activeElement : null };
      setOpen(true);
    });
  }
  return { confirm, dialog: open ? (
    <Dialog id={dialogId} className="modal-confirm" role="alertdialog" onClose={() => finish(false)} closeOnEscape
      ariaLabelledBy={titleId} ariaDescribedBy={descriptionId} data-testid="comment-preparation-confirm-dialog">
      <DialogTitle id={titleId}>{t('fileViewer.commentIdentityPrepare')}</DialogTitle>
      <DialogDescription id={descriptionId}>{t('fileViewer.commentIdentityConfirm')}</DialogDescription>
      <DialogFooter className="row">
        <Button ref={cancelButton} autoFocus onClick={() => finish(false)}>{t('common.cancel')}</Button>
        <Button ref={saveButton} variant="primary" onClick={() => finish(true)}>{t('common.save')}</Button>
      </DialogFooter>
    </Dialog>
  ) : null };
}
