// DEV-ONLY review mock (`?mock=seatfree`): a dismissible strip at the top of
// Home, shown only while the workspace has a single member. Once closed it
// stays closed (remembered in localStorage; `?banner=reset` brings it back).

import { useState } from 'react';
import { useT } from '../i18n';
import {
  dismissSeatFreeInviteBanner,
  openSeatFreeInvite,
  readSeatFreeMock,
  seatFreeInviteBannerDismissed,
} from '../mock/seat-free';
import { Icon } from './Icon';
import styles from './SeatFreeInviteBanner.module.css';

export function SeatFreeInviteBanner() {
  const t = useT();
  const mock = readSeatFreeMock();
  const [dismissed, setDismissed] = useState(() => seatFreeInviteBannerDismissed());
  if (!mock || mock.memberCount !== 1 || dismissed) return null;
  return (
    <div className={styles.banner} role="region" aria-label={t('seatFree.bannerText')} data-testid="seatfree-invite-banner">
      <span className={styles.icon} aria-hidden>
        <Icon name="users" size={15} />
      </span>
      <span className={styles.text}>{t('seatFree.bannerText')}</span>
      <button type="button" className={styles.invite} onClick={openSeatFreeInvite}>
        {t('seatFree.inviteCta')}
      </button>
      <button
        type="button"
        className={styles.close}
        aria-label={t('seatFree.dismiss')}
        onClick={() => {
          dismissSeatFreeInviteBanner();
          setDismissed(true);
        }}
      >
        <Icon name="close" size={14} />
      </button>
    </div>
  );
}
