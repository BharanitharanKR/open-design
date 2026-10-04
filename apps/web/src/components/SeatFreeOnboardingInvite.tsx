// DEV-ONLY review mock (`?mock=seatfree`): the closing onboarding step,
// "invite teammates". Reuses the cloud onboarding layout (pane + art) so it
// reads as one more page of the same flow. Sends nothing — the invite and the
// copied link are both mock data.

import { useState } from 'react';
import { useT } from '../i18n';
import { Icon } from './Icon';
import { LanguageMenu } from './LanguageMenu';
import { SEAT_FREE_MOCK_INVITE_LINK } from '../mock/seat-free';
import styles from './SeatFreeOnboardingInvite.module.css';

export function SeatFreeOnboardingInvite({ onDone }: { onDone: () => void }) {
  const t = useT();
  const [emails, setEmails] = useState('');
  const [sent, setSent] = useState(false);
  const hasEmail = /[^\s@,]+@[^\s@,]+\.[^\s@,]+/.test(emails);

  return (
    <section
      className="onboarding-view onboarding-view--cloud"
      aria-label={t('seatFree.onboardInviteTitle')}
      data-testid="seatfree-onboarding-invite"
    >
      <div className="onboarding-cloud__pane">
        <div className="onboarding-cloud__center">
          <span className={styles.eyebrow}>{t('seatFree.onboardStep')}</span>
          <h1 className="onboarding-cloud__title">{t('seatFree.onboardInviteTitle')}</h1>
          <p className="onboarding-cloud__body">{t('seatFree.onboardInviteBody')}</p>

          <div className={styles.form}>
            <div className={styles.emailRow}>
              <input
                className={styles.input}
                type="text"
                inputMode="email"
                placeholder={t('seatFree.emailPlaceholder')}
                value={emails}
                onChange={(e) => {
                  setEmails(e.target.value);
                  setSent(false);
                }}
              />
            </div>
            <button
              type="button"
              className="onboarding-cloud__primary"
              disabled={!hasEmail || sent}
              onClick={() => setSent(true)}
            >
              <Icon name={sent ? 'check' : 'send'} size={17} />
              <span>{sent ? t('seatFree.invitesSent') : t('seatFree.sendInvites')}</span>
            </button>

            <div className={styles.divider}>{t('seatFree.inviteLinkLabel')}</div>
            <SeatFreeInviteLink />
          </div>

          <button type="button" className={`onboarding-cloud__cancel ${styles.skip}`} onClick={onDone}>
            {t('seatFree.skip')}
          </button>
        </div>
        <footer className="onboarding-cloud__footer">
          <LanguageMenu placement="up" align="start" />
          <span>© {new Date().getFullYear()} OpenDesign · {t('settings.onboardingCloudRights')}</span>
        </footer>
      </div>
      <div className="onboarding-cloud__art" aria-hidden="true">
        <img src="/onboarding/onboarding-cloud-art.webp" alt="" />
      </div>
    </section>
  );
}

/** The shareable invite-link row (mock link), shared with the invite dialog. */
export function SeatFreeInviteLink({ className }: { className?: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  return (
    <div className={[styles.linkRow, className].filter(Boolean).join(' ')}>
      <span className={styles.link} title={SEAT_FREE_MOCK_INVITE_LINK}>
        <Icon name="link" size={15} />
        <span className={styles.linkText}>{SEAT_FREE_MOCK_INVITE_LINK}</span>
      </span>
      <button
        type="button"
        className={styles.copy}
        onClick={() => {
          void navigator.clipboard?.writeText(SEAT_FREE_MOCK_INVITE_LINK).catch(() => {});
          setCopied(true);
        }}
      >
        <Icon name={copied ? 'check' : 'copy'} size={14} />
        {copied ? t('seatFree.linkCopied') : t('seatFree.copyLink')}
      </button>
    </div>
  );
}
