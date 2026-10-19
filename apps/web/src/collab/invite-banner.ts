export const INVITE_BANNER_DISMISSED_EVENT = 'od:invite-banner-dismissed';
export function inviteBannerStorageKey(accountId: string): string {
  return `od.invite-banner.dismissed:${encodeURIComponent(accountId)}`;
}
export function persistInviteBannerDismissal(accountId: string) {
  try { localStorage.setItem(inviteBannerStorageKey(accountId), '1'); } catch { /* Session-only fallback. */ }
  window.dispatchEvent(new Event(INVITE_BANNER_DISMISSED_EVENT));
}
