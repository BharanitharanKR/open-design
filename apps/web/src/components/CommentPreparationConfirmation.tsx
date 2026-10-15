import { useEffect, useId, useRef, useState } from 'react';
import { Button, Dialog, DialogDescription, DialogFooter, DialogTitle } from '@open-design/components';
import { useT } from '../i18n';

/** App-owned consent: native confirm can be suppressed by an embedded host.
 * Resolving this dialog grants intent only; the preparation controller must
 * recheck its captured live revision before it reads or writes authored source.
 */
export function useCommentPreparationConfirmation() {
  const t = useT();
  const titleId = useId();
  const descriptionId = useId();
  const [open, setOpen] = useState(false);
  const pending = useRef<{ resolve: (accepted: boolean) => void; opener: HTMLElement | null } | null>(null);
  useEffect(() => () => { pending.current?.resolve(false); pending.current = null; }, []);
  function finish(accepted: boolean) {
    const request = pending.current;
    pending.current = null;
    setOpen(false);
    request?.resolve(accepted);
    if (request?.opener?.isConnected) request.opener.focus();
  }
  function confirm(): Promise<boolean> {
    if (pending.current) return Promise.resolve(false);
    return new Promise(resolve => {
      pending.current = { resolve, opener: document.activeElement instanceof HTMLElement ? document.activeElement : null };
      setOpen(true);
    });
  }
  return { confirm, dialog: open ? (
    <Dialog className="modal-confirm" role="alertdialog" onClose={() => finish(false)} closeOnEscape
      ariaLabelledBy={titleId} ariaDescribedBy={descriptionId} data-testid="comment-preparation-confirm-dialog">
      <DialogTitle id={titleId}>{t('fileViewer.commentIdentityPrepare')}</DialogTitle>
      <DialogDescription id={descriptionId}>{t('fileViewer.commentIdentityConfirm')}</DialogDescription>
      <DialogFooter className="row">
        <Button autoFocus onClick={() => finish(false)}>{t('common.cancel')}</Button>
        <Button variant="primary" onClick={() => finish(true)}>{t('common.save')}</Button>
      </DialogFooter>
    </Dialog>
  ) : null };
}
