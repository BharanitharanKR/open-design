// DEV-ONLY review mock (`?mock=seatfree`): an email field where each address
// becomes its own chip once confirmed (Enter, comma, or leaving the field) and
// can be removed on its own. Backspace in the empty field removes the last
// chip; pasting a list splits it. Invalid addresses stay as a flagged chip so
// the user can see and remove them.

import { useRef, useState, type KeyboardEvent } from 'react';
import { useT } from '../i18n';
import { Icon } from './Icon';
import styles from './SeatFreeEmailChips.module.css';

export const isEmailLike = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function SeatFreeEmailChips({
  emails,
  onChange,
  size = 'md',
  autoFocus,
}: {
  emails: string[];
  onChange: (next: string[]) => void;
  /** `lg` matches the onboarding controls, `md` the invite dialog inputs. */
  size?: 'md' | 'lg';
  autoFocus?: boolean;
}) {
  const t = useT();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  function commit(raw: string) {
    const parts = raw
      .split(/[,，;\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...emails];
    for (const part of parts) {
      if (!next.some((e) => e.toLowerCase() === part.toLowerCase())) next.push(part);
    }
    onChange(next);
    setDraft('');
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' || e.key === '，') {
      e.preventDefault();
      commit(draft);
      return;
    }
    if (e.key === 'Backspace' && draft === '' && emails.length > 0) {
      onChange(emails.slice(0, -1));
    }
  }

  return (
    <div
      className={`${styles.field} ${size === 'lg' ? styles.lg : styles.md}`}
      onClick={() => inputRef.current?.focus()}
      data-testid="seatfree-email-chips"
    >
      {emails.map((email) => (
        <span
          key={email}
          className={`${styles.chip}${isEmailLike(email) ? '' : ` ${styles.invalid}`}`}
        >
          <span className={styles.chipText}>{email}</span>
          <button
            type="button"
            className={styles.chipRemove}
            aria-label={t('seatFree.removeEmail', { email })}
            onClick={(e) => {
              e.stopPropagation();
              onChange(emails.filter((x) => x !== email));
            }}
          >
            <Icon name="close" size={12} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        inputMode="email"
        autoFocus={autoFocus}
        value={draft}
        placeholder={emails.length === 0 ? t('seatFree.emailChipsPlaceholder') : ''}
        onChange={(e) => {
          const value = e.target.value;
          if (/[,，]/.test(value)) commit(value);
          else setDraft(value);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => commit(draft)}
        onPaste={(e) => {
          const text = e.clipboardData.getData('text');
          if (/[,，;\s]/.test(text.trim())) {
            e.preventDefault();
            commit(draft + text);
          }
        }}
      />
    </div>
  );
}
