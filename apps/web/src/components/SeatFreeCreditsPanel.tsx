// DEV-ONLY review mock (`?mock=seatfree`): the body of the top-right credits
// panel under the seat-free rules. Credits belong to the workspace and every
// member draws from them, so the panel reports the shared balance (and, on
// Pro, the chosen monthly tier). Reuses the CodingPlanUsage rows so it sits in
// the existing billing card unchanged.

import { useT } from '../i18n';
import { formatMockUsd, SEAT_FREE_TIER_CREDITS, type SeatFreeMockState } from '../mock/seat-free';
import styles from './CodingPlanUsage.module.css';
import ownStyles from './SeatFreeCreditsPanel.module.css';

export function SeatFreeCreditsPanelBody({ mock }: { mock: SeatFreeMockState }) {
  const t = useT();
  const isPro = mock.plan === 'pro';
  const percent = isPro
    ? Math.round(Math.max(0, Math.min(1, mock.balanceUsd / mock.quotaUsd)) * 100)
    : null;
  const price = (n: number) => formatMockUsd(n).replace('.00', '');
  // Pro: the tier and the credits it grants; Free: the one-off sign-up grant.
  const period = isPro
    ? `${t('seatFree.perMonth', { amount: price(mock.quotaUsd) })} · ${t('seatFree.tierCredits', { amount: price(SEAT_FREE_TIER_CREDITS[mock.quotaUsd]) })} · ${t('seatFree.sharedByAll')}`
    : `${t('seatFree.freeGrant')} · ${t('seatFree.sharedByAll')}`;
  return (
    <div className={styles.quota} data-testid="seatfree-credits-panel">
      <div className={styles.block}>
        <div className={styles.row}>
          <span className={styles.allowance}>{t('seatFree.workspaceCredits')}</span>
          <span className={styles.entry}>
            <bdi>{t('seatFree.creditsLeft', { amount: formatMockUsd(mock.balanceUsd) })}</bdi>
          </span>
        </div>
        {percent !== null ? (
          <div className={styles.track} aria-hidden>
            <span className={styles.fill} style={{ width: `${percent}%` }} />
          </div>
        ) : null}
        <div className={`${styles.row} ${ownStyles.caption}`}>
          <span className={ownStyles.captionText}>{period}</span>
        </div>
      </div>
    </div>
  );
}
