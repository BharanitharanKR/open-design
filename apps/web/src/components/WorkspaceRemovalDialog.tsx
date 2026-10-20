import { flushSync } from 'react-dom';
import { useEffect, useId, useRef, useState } from 'react';
import { Button, Dialog } from '@open-design/components';
import type { WorkspaceActiveResponse } from '@open-design/contracts';
import { useT } from '../i18n';
import { notifyWorkspaceContextRefresh } from '../collab/useWorkspaceContext';
import { clearWorkspaceRemoval, currentWorkspaceRemoval, type WorkspaceRemovalNotice } from '../collab/workspace-removal';
import styles from './WorkspaceRemovalDialog.module.css';

export function WorkspaceRemovalDialog({ notice, onRecovered }: {
  notice: WorkspaceRemovalNotice;
  onRecovered: () => void;
}) {
  const t = useT();
  const titleId = useId();
  const dialogId = useId();
  const descriptionId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const panel = document.getElementById(dialogId);
    const backdrop = panel?.parentElement;
    if (!panel || !backdrop) return;
    const inertSiblings = new Set<Element>();
    const blockSiblings = () => {
      for (const element of Array.from(document.body.children)) {
        if (element === backdrop || element.hasAttribute('inert')) continue;
        inertSiblings.add(element);
        element.setAttribute('inert', '');
      }
    };
    blockSiblings();
    const observer = new MutationObserver(blockSiblings);
    observer.observe(document.body, { childList: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.tabIndex = -1;
    buttonRef.current?.focus();
    const keepFocus = (event: FocusEvent) => {
      if (!panel.contains(event.target as Node)) (buttonRef.current?.disabled ? panel : buttonRef.current)?.focus();
    };
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      (buttonRef.current?.disabled ? panel : buttonRef.current)?.focus();
    };
    document.addEventListener('focusin', keepFocus);
    document.addEventListener('keydown', handleTab);
    return () => {
      observer.disconnect();
      document.removeEventListener('focusin', keepFocus);
      document.removeEventListener('keydown', handleTab);
      for (const element of inertSiblings) element.removeAttribute('inert');
      document.body.style.overflow = previousOverflow;
    };
  }, [dialogId]);
  const confirm = async () => {
    if (pending) return;
    setPending(true);
    setFailed(false);
    try {
      const target = notice.defaultWorkspace;
      if (!target) throw new Error('default workspace unavailable');
      const response = await fetch('/api/workspace/active', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ workspaceId: target.workspaceId, workspaceMemberId: target.workspaceMemberId }),
      });
      if (!response.ok) throw new Error('workspace activation failed');
      const body = await response.json() as WorkspaceActiveResponse;
      if (body.context?.workspaceId !== target.workspaceId ||
          body.context.workspaceMemberId !== target.workspaceMemberId ||
          body.context.memberStatus !== 'active') throw new Error('workspace activation mismatch');
      if (currentWorkspaceRemoval() !== notice) return;
      flushSync(() => {
        notifyWorkspaceContextRefresh({ context: body.context });
        onRecovered();
      });
      clearWorkspaceRemoval();
    } catch {
      setFailed(true);
      setPending(false);
    }
  };
  return (
    <Dialog id={dialogId} role="alertdialog" ariaLabelledBy={titleId} ariaDescribedBy={descriptionId} closeOnBackdrop={false} closeOnEscape={false}
      className={styles.panel} backdropClassName={styles.backdrop} data-testid="workspace-removal-dialog">
      <h2 id={titleId}>{t('workspaceRemoval.title', { workspace: notice.context.workspaceName || notice.context.workspaceId })}</h2>
      <p id={descriptionId}>{t('workspaceRemoval.description')}</p>
      {failed ? <p className={styles.error} role="alert">{t('workspaceRemoval.recoveryError')}</p> : null}
      <div className={styles.actions}>
        <Button className={styles.confirm} ref={buttonRef} disabled={pending} aria-busy={pending} onClick={() => void confirm()}>{t('workspaceRemoval.confirm')}</Button>
      </div>
    </Dialog>
  );
}
