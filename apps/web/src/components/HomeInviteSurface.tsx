import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@open-design/components';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { useI18n } from '../i18n';
import { Icon } from './Icon';
import { InviteDialog } from './InviteDialog';
import styles from './HomeInviteSurface.module.css';

export const WORKSPACE_INVITES_SENT = 'od:workspace-invites-sent';
const OPEN_INVITE = 'od:workspace-invite-open';

export function HomeInviteTrigger({ context }: { context: WorkspaceCollabContext | null }) {
  const { t } = useI18n();
  if (!context || !context.permissions.canInviteMembers || context.memberStatus !== 'active' || context.lifecycleState !== 'active') return null;
  return <Button variant="ghost" className={styles.trigger} onClick={() => window.dispatchEvent(new CustomEvent(OPEN_INVITE, { detail: { workspaceId: context.workspaceId, workspaceMemberId: context.workspaceMemberId } }))}><InvitePersonIcon /> {t('homeInvite.invite')}</Button>;
}

function InvitePersonIcon() {
  return <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 5.5a3 3 0 0 1 0 5.5M17 14a4.5 4.5 0 0 1 3.5 4.4" /></svg>;
}

interface Props {
  accountId: string | null;
  context: WorkspaceCollabContext | null;
  active: boolean;
}

/** Account-scoped dismissal survives workspace changes without sharing it with
 * another account. Workspace membership IDs intentionally are not account IDs. */
export function HomeInviteSurface({ accountId, context, active }: Props) {
  const { t } = useI18n();
  const storageKey = accountId ? `od.invitation-banner.dismissed:${encodeURIComponent(accountId)}` : null;
  const [dismissal, setDismissal] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(0);
  const [sentGeneration, setSentGeneration] = useState(0);
  const principal = context ? `${context.workspaceId}:${context.workspaceMemberId}` : '';
  useEffect(() => {
    setOpen(false);
    setSent(0);
  }, [principal, accountId]);
  useEffect(() => {
    function onOpen(event: Event) {
      const detail = (event as CustomEvent).detail;
      if (context && detail?.workspaceId === context.workspaceId && detail?.workspaceMemberId === context.workspaceMemberId) setOpen(true);
    }
    window.addEventListener(OPEN_INVITE, onOpen);
    return () => window.removeEventListener(OPEN_INVITE, onOpen);
  }, [context]);
  useEffect(() => {
    if (!storageKey) return;
    try {
      setDismissal(window.localStorage.getItem(storageKey) === '1' ? storageKey : null);
    } catch {
      setDismissal(null);
    }
  }, [storageKey]);
  function dismiss() {
    if (!storageKey) return;
    setDismissal(storageKey);
    try { window.localStorage.setItem(storageKey, '1'); } catch { /* session state still applies */ }
  }
  useEffect(() => {
    function onSent(event: Event) {
      const detail = (event as CustomEvent).detail;
      if (!context || detail?.workspaceId !== context.workspaceId
        || detail?.workspaceMemberId !== context.workspaceMemberId
        || !Number.isInteger(detail?.count) || detail.count <= 0) return;
      setSentGeneration(previous => previous + 1);
      setSent(Number.isInteger(detail.totalCount) && detail.totalCount >= detail.count ? detail.totalCount : detail.count);
      if (storageKey) {
        setDismissal(storageKey);
        try { window.localStorage.setItem(storageKey, '1'); } catch { /* best effort */ }
      }
    }
    window.addEventListener(WORKSPACE_INVITES_SENT, onSent);
    return () => window.removeEventListener(WORKSPACE_INVITES_SENT, onSent);
  }, [active, context, storageKey]);
  useEffect(() => {
    if (!sent) return;
    const timer = window.setTimeout(() => setSent(0), 4000);
    return () => window.clearTimeout(timer);
  }, [sent, sentGeneration]);
  if (!context || context.memberStatus !== 'active'
    || context.lifecycleState !== 'active' || !context.permissions.canInviteMembers) return null;
  return (
    <>
      {active && storageKey && dismissal !== storageKey ? (
        <div className={styles.banner} role="region" aria-label={t('homeInvite.invite')}>
          <span className={styles.copy}>{t('homeInvite.banner')}</span>
          <Button variant="ghost" className={styles.invite} onClick={() => setOpen(true)}>{t('homeInvite.invite')}</Button>
          <Button variant="ghost" className={styles.close} aria-label={t('homeInvite.dismiss')} onClick={dismiss}><Icon name="close" size={12} /></Button>
        </div>
      ) : null}
      {sent ? createPortal(<div className={styles.toast} role="status">{t('homeInvite.sent', { n: sent })}</div>, document.body) : null}
      {open ? createPortal(<InviteDialog open={open} onClose={() => setOpen(false)} workspaceContext={context} canAssignRoles={context.role === 'owner'} />, document.body) : null}
    </>
  );
}
