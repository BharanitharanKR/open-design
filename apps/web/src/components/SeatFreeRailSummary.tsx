// DEV-ONLY review mock (`?mock=seatfree`): the rail's workspace summary.
// Seats are gone, so the card reports what still matters to everyone in the
// workspace — the plan (Free / Pro), how many members there are, and how much
// of the shared workspace credit is left.

import { useT } from '../i18n';
import { formatMockUsd, type SeatFreeMockState } from '../mock/seat-free';
import { PlanBadge } from './PlanBadge';
import { RemixIcon } from './RemixIcon';
import styles from './SeatFreeRailSummary.module.css';

export function SeatFreeRailSummary({
  mock,
  onInvite,
}: {
  mock: SeatFreeMockState;
  onInvite: () => void;
}) {
  const t = useT();
  const isPro = mock.plan === 'pro';
  const ratio = isPro ? Math.max(0, Math.min(1, mock.balanceUsd / mock.quotaUsd)) : null;
  const low = mock.balanceUsd <= 0;
  return (
    <div className={styles.card} data-testid="seatfree-rail-summary">
      <div className={styles.head}>
        <PlanBadge plan={mock.plan} size="md" />
        <button type="button" className={styles.members} onClick={onInvite}>
          <RemixIcon name="team-line" size={13} />
          {t('seatFree.members', { count: mock.memberCount })}
        </button>
      </div>
      <div className={styles.creditRow}>
        <span className={styles.creditLabel}>
          <RemixIcon name="battery-charge-line" size={13} />
          {t('seatFree.railCreditsLeft')}
        </span>
        <span className={`${styles.creditValue}${low ? ` ${styles.empty}` : ''}`}>
          <bdi>{formatMockUsd(mock.balanceUsd)}</bdi>
        </span>
      </div>
      {ratio !== null ? (
        <div className={styles.meter} aria-hidden>
          <span className={styles.meterFill} style={{ width: `${Math.round(ratio * 100)}%` }} />
        </div>
      ) : null}
    </div>
  );
}
