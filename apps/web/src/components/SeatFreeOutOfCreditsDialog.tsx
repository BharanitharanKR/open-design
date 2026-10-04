// DEV-ONLY review mock (`?mock=seatfree`): the "workspace credits are used up"
// dialog under the seat-free rules. Credits belong to the workspace, so the
// copy is about the workspace, and only the Owner can fix it:
//
//   owner          — pick a Pro monthly tier (one Pro plan, four credit tiers
//                    priced like today's Go / Plus / Pro / Max) and upgrade,
//                    or top up once.
//   admin / member — no upgrade or top-up button at all; they are told to
//                    contact the Owner.
//
// Reuses the existing balance-gate dialog chrome (AmrBalanceDialog.module.css)
// so it reads as the same surface. Nothing is purchased.

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Dialog } from '@open-design/components';
import { useT } from '../i18n';
import {
  formatMockUsd,
  SEAT_FREE_QUOTAS,
  type SeatFreeMockState,
  type SeatFreeQuota,
} from '../mock/seat-free';
import { Icon } from './Icon';
import { RemixIcon } from './RemixIcon';
import gateStyles from './AmrBalanceDialog.module.css';
import styles from './SeatFreeOutOfCreditsDialog.module.css';

function priceLabel(amount: number): string {
  return formatMockUsd(amount).replace('.00', '');
}

export function SeatFreeOutOfCreditsDialog({
  mock,
  onClose,
}: {
  mock: SeatFreeMockState;
  onClose: () => void;
}) {
  const t = useT();
  const isOwner = mock.role === 'owner';
  const isPro = mock.plan === 'pro';
  const nextQuota: SeatFreeQuota = isPro
    ? (SEAT_FREE_QUOTAS.find((q) => q > mock.quotaUsd) ?? mock.quotaUsd)
    : 20;
  const [quota, setQuota] = useState<SeatFreeQuota>(nextQuota);
  const title = t('seatFree.outTitle');
  const body = !isOwner
    ? t('seatFree.outBodyMember')
    : isPro
      ? t('seatFree.outBodyOwnerPro', {
          quota: t('seatFree.perMonth', { amount: priceLabel(mock.quotaUsd) }),
        })
      : t('seatFree.outBodyOwnerFree');

  const dialog = (
    <Dialog
      role="alertdialog"
      ariaLabel={title}
      onClose={onClose}
      closeOnEscape
      className={gateStyles.panel}
      data-testid="seatfree-out-of-credits"
      data-role={mock.role}
    >
      <button
        type="button"
        className={gateStyles.closeButton}
        onClick={onClose}
        aria-label={t('common.close')}
      >
        <Icon name="close" size={14} />
      </button>
      <div className={gateStyles.banner}>
        <img
          className={gateStyles.bannerImage}
          src="/upgrade/cloud-signin-aurora.jpg"
          alt=""
          width={1680}
          height={720}
          decoding="async"
          draggable={false}
        />
      </div>
      <h2 className={gateStyles.title}>{title}</h2>
      <p className={gateStyles.message}>{body}</p>

      <div className={styles.status}>
        <span className={styles.statusLabel}>
          <RemixIcon name="battery-charge-line" size={14} />
          {t('seatFree.workspaceCredits')}
        </span>
        <span className={styles.statusValue}>
          <bdi>{t('seatFree.creditsLeft', { amount: formatMockUsd(mock.balanceUsd) })}</bdi>
        </span>
        <span className={styles.statusMeta}>
          {mock.workspaceName} · {t('seatFree.members', { count: mock.memberCount })}
        </span>
      </div>

      {isOwner ? (
        <>
          <div className={styles.quota} role="radiogroup" aria-label={t('seatFree.chooseQuota')}>
            <span className={styles.quotaTitle}>{t('seatFree.chooseQuota')}</span>
            <div className={styles.quotaGrid}>
              {SEAT_FREE_QUOTAS.map((q) => {
                const current = isPro && q === mock.quotaUsd;
                const selected = q === quota;
                return (
                  <button
                    key={q}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`${styles.quotaOption}${selected ? ` ${styles.selected}` : ''}`}
                    disabled={isPro && q < mock.quotaUsd}
                    onClick={() => setQuota(q)}
                  >
                    <span className={styles.quotaPrice}>
                      {t('seatFree.perMonth', { amount: priceLabel(q) })}
                    </span>
                    {current ? (
                      <span className={styles.quotaCurrent}>{t('seatFree.currentQuota')}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={gateStyles.actions}>
            <Button variant="ghost" className={gateStyles.later} onClick={onClose}>
              {t('seatFree.laterCta')}
            </Button>
            <Button variant="secondary" className={styles.topUp} onClick={onClose}>
              {t('seatFree.topUpCta')}
            </Button>
            <Button
              variant="primary"
              className={gateStyles.cta}
              onClick={onClose}
              disabled={isPro && quota === mock.quotaUsd}
            >
              {isPro ? t('seatFree.upgradeCta') : t('seatFree.upgradeToProCta')}
              {' · '}
              {t('seatFree.perMonth', { amount: priceLabel(quota) })}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.owner}>
            <span className={styles.ownerAvatar} aria-hidden>
              {mock.ownerName.charAt(0).toUpperCase()}
            </span>
            <span className={styles.ownerText}>
              <span className={styles.ownerLabel}>{t('seatFree.ownerLabel')}</span>
              <span className={styles.ownerName}>{mock.ownerName}</span>
            </span>
          </div>
          <div className={gateStyles.actions}>
            <Button variant="primary" className={gateStyles.cta} onClick={onClose}>
              {t('seatFree.gotIt')}
            </Button>
          </div>
        </>
      )}
    </Dialog>
  );
  if (typeof document === 'undefined') return dialog;
  return createPortal(dialog, document.body);
}
