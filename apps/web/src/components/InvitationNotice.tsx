import { Toast } from './Toast';
import styles from './InvitationNotice.module.css';

/** Invitation feedback uses the same native toast as the supplied client HTML. */
export function InvitationNotice({ message, tone, onClose, portalToBody = true }: {
  message: string;
  tone: 'success' | 'error';
  onClose: () => void;
  portalToBody?: boolean;
}) {
  return <Toast message={message} tone={tone} role={tone === 'error' ? 'alert' : 'status'}
    placement="top" portalToBody={portalToBody} className={styles.notice} ttlMs={3200} onDismiss={onClose} />;
}
