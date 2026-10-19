import type { WorkspaceInviteCreateResult } from '@open-design/contracts';

export interface InviteFormRow { email: string; role: string; error?: string }

/** Ignore blank drafts; only later occurrences of a normalized email are duplicates. */
export function validateInviteRows(rows: InviteFormRow[]): InviteFormRow[] {
  const seen = new Set<string>();
  return rows.map((row) => {
    const email = row.email.trim().toLowerCase();
    let error: string | undefined;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) error = 'invalid_email';
    else if (email && seen.has(email)) error = 'duplicate_email';
    if (email) seen.add(email);
    return { ...row, error };
  });
}

/** A missing or malformed outcome remains retryable; never infer delivery from omission. */
export function reconcileInviteRows(rows: InviteFormRow[], results: WorkspaceInviteCreateResult[]) {
  const remaining: InviteFormRow[] = [];
  let succeeded = 0;
  rows.forEach((row, index) => {
    const result = results[index];
    const matches = results.length === rows.length && result && typeof result.email === 'string'
      && result.email.trim().toLowerCase() === row.email.trim().toLowerCase();
    if (matches && result.ok === true) succeeded++;
    else remaining.push({ ...row, error: matches ? result.error ?? 'request_failed' : 'request_failed' });
  });
  return { remaining, succeeded };
}
