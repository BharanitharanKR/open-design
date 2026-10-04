// DEV-ONLY review mock (`?mock=seatfree`): the closing onboarding step,
// "invite teammates". Same cloud onboarding layout (pane + art) as the steps
// before it: title, one line of body, the email field, one primary action and
// a quiet skip. Sends nothing — the invite is mock data.

import { useState } from 'react';
import { useT } from '../i18n';
import { Icon } from './Icon';
import { LanguageMenu } from './LanguageMenu';
import { SeatFreeEmailChips, isEmailLike } from './SeatFreeEmailChips';
import styles from './SeatFreeOnboardingInvite.module.css';

export function SeatFreeOnboardingInvite({ onDone }: { onDone: () => void }) {
  const t = useT();
  const [emails, setEmails] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const hasEmail = emails.some(isEmailLike);

  return (
    <section
      className="onboarding-view onboarding-view--cloud"
      aria-label={t('seatFree.onboardInviteTitle')}
      data-testid="seatfree-onboarding-invite"
    >
      <div className="onboarding-cloud__pane">
        <div className="onboarding-cloud__center">
          <h1 className="onboarding-cloud__title">{t('seatFree.onboardInviteTitle')}</h1>
          <p className="onboarding-cloud__body">{t('seatFree.onboardInviteBody')}</p>
          <div className={styles.form}>
            <SeatFreeEmailChips
              size="lg"
              emails={emails}
              onChange={(next) => {
                setEmails(next);
                setSent(false);
              }}
            />
            <button
              type="button"
              className="onboarding-cloud__primary"
              disabled={!hasEmail && !sent}
              onClick={() => (sent ? onDone() : setSent(true))}
            >
              {sent ? <Icon name="check" size={17} /> : null}
              <span>{sent ? t('seatFree.invitesSent') : t('seatFree.sendInvites')}</span>
            </button>
          </div>
          <button type="button" className="onboarding-cloud__cancel" onClick={onDone}>
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
