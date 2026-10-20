import { useEffect, useState } from 'react';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { fetchVelaLoginStatus } from '../providers/daemon';
import { useI18n } from '../i18n';
import { currentWorkspaceAccountGeneration } from '../collab/workspace-identity';
import { INVITE_BANNER_DISMISSED_EVENT, inviteBannerStorageKey, persistInviteBannerDismissal } from '../collab/invite-banner';
import { InviteDialog } from './InviteDialog';
import { InvitationNotice } from './InvitationNotice';
import styles from './InviteEntry.module.css';
export { inviteBannerStorageKey } from '../collab/invite-banner';

export function InviteSuccessNotice({ count, onClose }: { count: number; onClose: () => void }) {
  const { t } = useI18n();
  return count > 0 ? <InvitationNotice message={t('workspaceInvite.sentCount', { count })} tone="success" onClose={onClose} /> : null;
}

/** Account-level dismissal survives workspace changes without affecting other accounts. */
export function InviteEntry({ context, banner = false, accountGeneration = 0 }: {
  context: WorkspaceCollabContext | null;
  banner?: boolean;
  accountGeneration?: number;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [sent, setSent] = useState(0);
  const canInvite = context?.memberStatus === 'active'
    && context.lifecycleState === 'active' && context.permissions.canInviteMembers;

  useEffect(() => {
    setOpen(false);
    setSent(0);
  }, [context?.workspaceId, context?.workspaceMemberId, accountGeneration]);

  useEffect(() => {
    setAccount(null);
    setDismissed(true);
    if (!banner || !canInvite) return;
    let cancelled = false;
    const generation = currentWorkspaceAccountGeneration();
    void fetchVelaLoginStatus().then((status) => {
      if (cancelled || generation !== currentWorkspaceAccountGeneration() || !status?.loggedIn || !status.user?.id) return;
      const id = status.user.id;
      setAccount(id);
      try { setDismissed(localStorage.getItem(inviteBannerStorageKey(id)) === '1'); }
      catch { setDismissed(false); }
    });
    return () => { cancelled = true; };
  }, [banner, canInvite, accountGeneration, context?.workspaceMemberId]);

  useEffect(() => {
    if (!banner || !account) return;
    const update = () => {
      try { setDismissed(localStorage.getItem(inviteBannerStorageKey(account)) === '1'); }
      catch { /* Keep the current state when storage is unavailable. */ }
    };
    window.addEventListener(INVITE_BANNER_DISMISSED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(INVITE_BANNER_DISMISSED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [banner, account]);

  if (!canInvite) return null;
  const dismiss = () => {
    setDismissed(true);
    if (account) persistInviteBannerDismissal(account);
  };
  return <>
    {banner ? (!dismissed && account ? <div className={styles.bannerSlot}><div className={styles.banner} data-testid="workspace-invite-banner">
      <span className={styles.copy}>{t('workspaceInvite.bannerBody')}</span>
      <button type="button" className={styles.action} onClick={() => { setSent(0); setOpen(true); }}>{t('workspaceInvite.inviteAction')}</button>
      <button type="button" className={styles.dismiss} onClick={dismiss} aria-label={t('workspaceInvite.dismissBanner')}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="m4.5 4.5 7 7m0-7-7 7"/></svg></button>
    </div></div> : null) : <button type="button" className={styles.entry} onClick={() => { setSent(0); setOpen(true); }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 5.5a3 3 0 0 1 0 5.5M17 14a4.5 4.5 0 0 1 3.5 4.4"/></svg>{t('workspaceInvite.inviteAction')}
    </button>}
    <InviteDialog open={open} onClose={() => setOpen(false)} workspaceContext={context}
      canAssignRoles={context?.role === 'owner'} onSent={setSent} />
    <InviteSuccessNotice count={sent} onClose={() => setSent(0)} />
  </>;
}
