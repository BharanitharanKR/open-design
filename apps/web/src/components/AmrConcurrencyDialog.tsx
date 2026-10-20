import { Button, Dialog } from '@open-design/components';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { useT } from '../i18n';
import type { AmrBalanceBranch } from '../runtime/amr-balance-branch';
import { workspaceUpgradeUrl } from './EntryNavRail';
import styles from './AmrConcurrencyDialog.module.css';

/** A real Link request rejection, never a local task-slot reservation. Closing
 * or changing plans only dismisses the notice; sending again is always manual. */
export function AmrConcurrencyDialog({ branch, workspaceContext, onClose }: {
  branch: AmrBalanceBranch;
  workspaceContext: WorkspaceCollabContext | null;
  onClose: () => void;
}) {
  const t = useT();
  const upgradeUrl = branch.audience === 'owner' && branch.tier !== 'max'
    ? workspaceUpgradeUrl(workspaceContext, null) : null;
  return (
    <Dialog className={styles.panel} onClose={onClose} closeOnEscape
      ariaLabelledBy="amr-concurrency-title" data-testid="amr-concurrency-dialog">
      <h2 id="amr-concurrency-title">{t('chat.runError.title.membershipConcurrencyLimit')}</h2>
      <p>{t(branch.audience === 'member'
        ? 'chat.runError.membershipConcurrencyLimitOwnerMessage'
        : 'chat.runError.membershipConcurrencyLimitMessageNoTime')}</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose} data-testid="amr-concurrency-close">{t('common.close')}</Button>
        {upgradeUrl ? <Button onClick={() => window.open(upgradeUrl, '_blank', 'noopener,noreferrer')}
          data-testid="amr-concurrency-upgrade">{t('entry.creditsUpgrade')}</Button> : null}
      </div>
    </Dialog>
  );
}
