import type { WorkspaceCollabContext } from '@open-design/contracts';
import { fetchVelaLoginStatus } from '../providers/daemon';
import { currentWorkspaceAccountGeneration } from './workspace-identity';

export const INVITATION_SENT_EVENT = 'od:workspace-invitation-sent';
export const INVITE_BANNER_DISMISSED_EVENT = 'od:invite-banner-dismissed';
export function inviteBannerStorageKey(accountId: string): string {
  return `od.invite-banner.dismissed:${encodeURIComponent(accountId)}`;
}
export function persistInviteBannerDismissal(accountId: string) {
  try { localStorage.setItem(inviteBannerStorageKey(accountId), '1'); } catch { /* Session-only fallback. */ }
  window.dispatchEvent(new Event(INVITE_BANNER_DISMISSED_EVENT));
}
export interface InvitationSentDetail {
  workspaceId: string;
  workspaceMemberId: string;
  accountGeneration: number;
  handled: boolean;
}

/** Let a mounted banner use its verified account; otherwise resolve identity only on delivery. */
export async function notifyWorkspaceInvitationSent(context: WorkspaceCollabContext, accountGeneration: number) {
  if (accountGeneration !== currentWorkspaceAccountGeneration()) return;
  const detail: InvitationSentDetail = {
    workspaceId: context.workspaceId, workspaceMemberId: context.workspaceMemberId,
    accountGeneration, handled: false,
  };
  window.dispatchEvent(new CustomEvent(INVITATION_SENT_EVENT, { detail }));
  if (detail.handled) return;
  const status = await fetchVelaLoginStatus();
  if (accountGeneration !== currentWorkspaceAccountGeneration() || !status?.loggedIn || !status.user?.id) return;
  persistInviteBannerDismissal(status.user.id);
}
