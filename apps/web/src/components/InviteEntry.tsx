import { useEffect, useRef, useState } from 'react';
import { Button } from '@open-design/components';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { fetchVelaLoginStatus } from '../providers/daemon';
import { useI18n } from '../i18n';
import { currentWorkspaceAccountGeneration } from '../collab/workspace-identity';
import { INVITE_BANNER_DISMISSED_EVENT, inviteBannerStorageKey, persistInviteBannerDismissal } from '../collab/invite-banner';
import { InviteDialog } from './InviteDialog';
import { Icon } from './Icon';
import styles from './InviteEntry.module.css';
export { inviteBannerStorageKey } from '../collab/invite-banner';

export function InviteSuccessNotice({ count, onClose }: { count: number; onClose: () => void }) {
  const { t } = useI18n();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (count <= 0) return;
    const timer = window.setTimeout(() => closeRef.current(), 3200);
    return () => window.clearTimeout(timer);
  }, [count]);
  return count > 0 ? <div className={styles.notice} role="status">{t('workspaceInvite.sentCount', { count })}
    <button type="button" className={styles.close} onClick={onClose} aria-label={t('common.close')}><Icon name="close" size={14} /></button>
  </div> : null;
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
    {banner ? (!dismissed && account ? <div className={styles.banner}>
      <Icon name="user-plus" size={20} />
      <span>{t('workspaceInvite.bannerBody')}</span>
      <button type="button" className={styles.action} onClick={() => setOpen(true)}>{t('workspaceInvite.inviteAction')}</button>
      <span className={styles.separator} />
      <button type="button" className={styles.close} onClick={dismiss} aria-label={t('workspaceInvite.dismissBanner')}><Icon name="close" size={14} /></button>
    </div> : null) : <Button variant="ghost" onClick={() => setOpen(true)}>
      <Icon name="user-plus" size={16} />{t('workspaceInvite.inviteAction')}
    </Button>}
    <InviteDialog open={open} onClose={() => setOpen(false)} workspaceContext={context}
      canAssignRoles={context?.role === 'owner'} onSent={setSent} />
    <InviteSuccessNotice count={sent} onClose={() => setSent(0)} />
  </>;
}
