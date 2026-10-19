import { describe, expect, it } from 'vitest';
import { reconcileInviteRows, validateInviteRows } from '../src/collab/invite-form-model';
const rows = [{ email: 'first@example.com', role: 'admin' }, { email: 'second@example.com', role: 'member' }];
describe('invitation drafts', () => {
  it('marks only later case-insensitive duplicates and rejects malformed input', () => {
    expect(validateInviteRows([rows[0]!, { email: ' FIRST@example.com ', role: 'member' }, { email: 'broken', role: 'member' }]).map(r => r.error)).toEqual([undefined, 'duplicate_email', 'invalid_email']);
  });
  it('removes successful rows while retaining failed emails and roles', () => {
    expect(reconcileInviteRows(rows, [{ email: rows[0]!.email, ok: true }, { email: rows[1]!.email, ok: false, error: 'active_pending_invite' }])).toEqual({ succeeded: 1, remaining: [{ ...rows[1], error: 'active_pending_invite' }] });
  });
  it('never counts omitted or mismatched outcomes as success', () => {
    expect(reconcileInviteRows(rows, []).succeeded).toBe(0);
    expect(reconcileInviteRows(rows, [{ ok: true }, { ok: true }] as never).succeeded).toBe(0);
    expect(reconcileInviteRows(rows, [{ email: rows[0]!.email, ok: true }, { email: rows[1]!.email, ok: true }, { email: 'extra@example.com', ok: true }]).succeeded).toBe(0);
    expect(reconcileInviteRows(rows, [{ email: 'other@example.com', ok: true }]).succeeded).toBe(0);
  });
});
