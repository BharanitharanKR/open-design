import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { type WorkspaceCollabContext, type WorkspaceInviteRole } from '@open-design/contracts';
import { Button } from '@open-design/components';
import { Icon } from './Icon';
import { useI18n } from '../i18n';
import { workspaceInviteErrorMessageKey } from '../collab/invite-error-copy';
import { workspaceProjectHeaders } from '../collab/workspace-identity';
import { useAnalytics } from '../analytics/provider';
import { trackWorkspaceInviteClick, trackWorkspaceInviteResult, trackWorkspaceSurfaceView } from '../analytics/events';
import { countBucket, stableAnalyticsErrorCode, workspaceAnalyticsDimensions } from '../analytics/workspace';
import styles from './InviteDialog.module.css';

export interface InviteRow { email: string; role: string }
interface Row extends InviteRow { error?: string | undefined }
interface Props {
  open: boolean;
  onClose: () => void;
  workspaceContext: WorkspaceCollabContext | null;
  /** Legacy callers may still pass these; invitations no longer consume seats. */
  freePlan?: boolean;
  availableSeats?: number;
  onUpgrade?: () => void;
  onSubmit?: (rows: InviteRow[]) => void;
  canAssignRoles?: boolean;
  entryFrom?: 'workspace_switcher' | 'all_projects';
}
const emptyRow = (): Row => ({ email: '', role: 'member' });
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const canonicalRole = (role: string): WorkspaceInviteRole => role === 'admin' || role === '管理员' ? 'admin' : 'member';

/** The local form retains authoritative per-row results and never retries sent recipients. */
export function InviteDialog({ open, onClose, workspaceContext, onSubmit, canAssignRoles = true, entryFrom = 'workspace_switcher' }: Props) {
  const { t } = useI18n();
  const analytics = useAnalytics();
  const page = entryFrom === 'all_projects' ? 'all_projects' : 'home';
  const dimensions = workspaceAnalyticsDimensions(workspaceContext);
  const owner = workspaceContext?.role === 'owner' && canAssignRoles;
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentCount, setSentCount] = useState(0);
  const [openRoleIndex, setOpenRoleIndex] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<CSSProperties>({});
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);
  const menu = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const requestVersion = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const id = useId();
  const identity = `${workspaceContext?.workspaceId}:${workspaceContext?.workspaceMemberId}`;

  useEffect(() => {
    requestVersion.current += 1;
    controller.current?.abort();
    setRows([emptyRow()]); setError(null); setSentCount(0); setValidated(false); setSubmitting(false); setOpenRoleIndex(null);
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLInputElement>('input')?.focus();
    return () => { requestVersion.current += 1; controller.current?.abort(); previous?.focus(); };
  }, [open, identity]);
  useEffect(() => {
    if (open) trackWorkspaceSurfaceView(analytics.track, { page_name: page, area: 'workspace_invite_dialog', entry_from: entryFrom, ...dimensions });
  }, [open, analytics.track, page, entryFrom, dimensions.workspace_key]);
  useEffect(() => {
    if (!owner) { setRows(previous => previous.map(row => ({ ...row, role: 'member' }))); setOpenRoleIndex(null); }
  }, [owner]);
  useLayoutEffect(() => {
    if (openRoleIndex === null) return;
    const position = () => {
      const rect = triggers.current[openRoleIndex]?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(300, window.innerWidth - 24);
      const height = menu.current?.offsetHeight || 140;
      setMenuPos({ width, left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
        top: rect.bottom + 6 + height > window.innerHeight - 12 ? Math.max(12, rect.top - height - 6) : rect.bottom + 6 });
    };
    position();
    const outside = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node) && !triggers.current[openRoleIndex]?.contains(event.target as Node)) setOpenRoleIndex(null);
    };
    window.addEventListener('resize', position); window.addEventListener('scroll', position, true); window.addEventListener('mousedown', outside);
    return () => { window.removeEventListener('resize', position); window.removeEventListener('scroll', position, true); window.removeEventListener('mousedown', outside); };
  }, [openRoleIndex]);
  if (!open) return null;

  function rowErrors(values: Row[], includeServerErrors = true) {
    const seen = new Set<string>();
    return values.map(row => {
      const email = row.email.trim().toLowerCase();
      const message = !validEmail(email) ? t('workspaceInvite.errorInvalidEmail') : seen.has(email) ? t('workspaceInvite.errorDuplicateEmail') : includeServerErrors ? row.error : undefined;
      seen.add(email);
      return message;
    });
  }
  const errors = rowErrors(rows);
  function updateRow(index: number, patch: Partial<Row>) {
    setRows(previous => previous.map((row, i) => i === index ? { ...row, ...patch, error: undefined } : row));
    setError(null);
  }
  function click(element: 'submit' | 'close' | 'add_recipient_row' | 'remove_recipient_row' | 'role_select') {
    trackWorkspaceInviteClick(analytics.track, { page_name: page, area: 'workspace_invite_dialog', element, entry_from: entryFrom, ...dimensions });
  }
  function close() { if (!submitting) { click('close'); onClose(); } }
  async function submit() {
    setValidated(true);
    if (submitting || rowErrors(rows, false).some(Boolean)) return;
    if (!workspaceContext || workspaceContext.memberStatus !== 'active') { setError(t('workspaceInvite.submitFailed')); return; }
    const requestContext = workspaceContext;
    const version = ++requestVersion.current;
    const requested = rows.map(row => ({ email: row.email.trim(), role: owner ? canonicalRole(row.role) : 'member' as const }));
    const requestId = analytics.newRequestId();
    const startedAt = performance.now();
    const result = (succeeded: number, failed: number, code?: string) => trackWorkspaceInviteResult(analytics.track, {
      page_name: page, area: 'workspace_invite_dialog', entry_from: entryFrom,
      result: succeeded === requested.length ? 'success' : succeeded > 0 ? 'partial_success' : 'failed',
      requested_count: requested.length, succeeded_count: succeeded, failed_count: failed,
      duration_ms: Math.round(performance.now() - startedAt), ...(code ? { error_code: code } : {}), ...dimensions,
    }, { requestId });
    trackWorkspaceInviteClick(analytics.track, { page_name: page, area: 'workspace_invite_dialog', element: 'submit',
      entry_from: entryFrom, invite_count_bucket: countBucket(requested.length), ...dimensions }, { requestId });
    setSubmitting(true); setError(null); setOpenRoleIndex(null);
    const abort = new AbortController(); controller.current = abort;
    try {
      const response = await fetch('/api/workspace/invite', { method: 'POST', signal: abort.signal,
        headers: { 'content-type': 'application/json', ...workspaceProjectHeaders(requestContext) }, body: JSON.stringify({ invites: requested }) });
      if (version !== requestVersion.current) return;
      if (!response.ok) { result(0, requested.length, stableAnalyticsErrorCode(response.status)); throw new Error('request_failed'); }
      const body = await response.json() as { results?: Array<{ email?: string; ok?: boolean; error?: string | undefined }> };
      if (version !== requestVersion.current) return;
      const results = body.results;
      const succeeded: InviteRow[] = []; const failed: Row[] = [];
      requested.forEach((row, index) => {
        const match = results?.find(item => item.email?.trim().toLowerCase() === row.email.toLowerCase())
          ?? (results?.length === requested.length && results[index]?.email === undefined ? results[index] : undefined);
        if (match?.ok === true) succeeded.push(row);
        else failed.push({ ...row, error: t(workspaceInviteErrorMessageKey(match?.error)) });
      });
      result(succeeded.length, failed.length, failed.length ? 'invite_rejected' : undefined);
      if (succeeded.length) {
        setSentCount(previous => previous + succeeded.length);
        window.dispatchEvent(new CustomEvent('od:workspace-invites-sent', { detail: {
          count: succeeded.length, totalCount: sentCount + succeeded.length, workspaceId: requestContext.workspaceId, workspaceMemberId: requestContext.workspaceMemberId,
        } }));
      }
      if (!failed.length) { setSubmitting(false); onSubmit?.(succeeded); onClose(); return; }
      setRows(failed);
      setError(succeeded.length ? t('workspaceInvite.partialSummary').replace('{sent}', String(succeeded.length)).replace('{failed}', String(failed.length)) : null);
    } catch (caught) {
      if (version !== requestVersion.current) return;
      if (caught instanceof TypeError) result(0, requested.length, 'network_error');
      setError(t('workspaceInvite.submitFailed'));
    } finally { if (version === requestVersion.current) setSubmitting(false); }
  }

  const roleText = (role: string) => t(role === 'admin' ? 'invite.role.admin' : 'invite.role.member');
  return <div className={styles.root} role="dialog" aria-modal="true" aria-label={t('workspaceInvite.dialogAria')} ref={dialog}
    onKeyDown={event => {
      if (event.key === 'Escape') { event.stopPropagation(); if (openRoleIndex !== null) setOpenRoleIndex(null); else close(); }
      if (event.key === 'Tab') {
        const focusable = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)');
        const first = focusable?.[0]; const last = focusable?.[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
    <div className={styles.backdrop} onClick={close} />
    <section className={styles.panel} aria-busy={submitting}>
      <header className={styles.heading}><h2>{t('workspaceInvite.title')}</h2>
        <span className={styles.help}><Button className={styles.info} aria-label={t('workspaceInvite.helpLabel')} aria-describedby={`${id}-help`}><Icon name="info" size={16} /></Button>
          <span className={styles.tooltip} id={`${id}-help`} role="tooltip">{t('workspaceInvite.teamPlanBody')}</span></span>
        <Button className={styles.close} onClick={close} disabled={submitting} aria-label={t('workspaceInvite.cancel')}>✕</Button>
      </header>
      <p className={styles.context}>{workspaceContext?.workspaceName ?? workspaceContext?.teamName ?? ''}</p>
      <form onSubmit={event => { event.preventDefault(); void submit(); }} noValidate>
        <div className={`${styles.labels} ${rows.length === 1 ? styles.single : ''}`}><span>{t('workspaceInvite.emailLabel')}</span><span>{t('workspaceInvite.roleLabel')}</span></div>
        <div className={styles.rows} data-invite-rows>
          {rows.map((row, index) => <div className={`${styles.row} ${rows.length === 1 ? styles.single : ''}`} key={index}>
            <input type="email" className={styles.input} value={row.email} placeholder={t('workspaceInvite.emailPlaceholder')} aria-label={t('workspaceInvite.emailLabel')}
              disabled={submitting} aria-invalid={validated && !!errors[index]} aria-describedby={validated && errors[index] ? `${id}-error-${index}` : undefined}
              onChange={event => updateRow(index, { email: event.target.value })} onBlur={() => { if (row.email.trim()) setValidated(true); }} />
            {owner ? <Button ref={element => { triggers.current[index] = element; }} className={styles.role} disabled={submitting}
              aria-label={t('workspaceInvite.roleLabel')} aria-haspopup="listbox" aria-expanded={openRoleIndex === index} aria-controls={`${id}-roles`}
              onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpenRoleIndex(index); requestAnimationFrame(() => { const options = menu.current?.querySelectorAll<HTMLButtonElement>('button'); (event.key === 'ArrowUp' ? options?.[options.length - 1] : options?.[0])?.focus(); }); } }}
              onClick={() => { click('role_select'); setOpenRoleIndex(current => current === index ? null : index); }}>
              {roleText(row.role)}<Icon name="chevron-down" size={14} /></Button> : <span className={styles.fixedRole}>{roleText('member')}</span>}
            {rows.length > 1 ? <Button className={styles.remove} aria-label={t('workspaceInvite.removeRow')} disabled={submitting}
              onClick={() => { click('remove_recipient_row'); setRows(previous => previous.filter((_, i) => i !== index)); setOpenRoleIndex(null); }}><Icon name="close" size={15} /></Button> : null}
            {validated && errors[index] ? <p className={styles.lineError} id={`${id}-error-${index}`} role="alert">{errors[index]}</p> : null}
          </div>)}
        </div>
        <Button className={styles.add} disabled={submitting} onClick={() => { click('add_recipient_row'); setRows(previous => [...previous, emptyRow()]); }}><Icon name="plus" size={14} />{t('workspaceInvite.addMember')}</Button>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        {sentCount > 0 && !error ? <p className={styles.error} role="status">{t('workspaceInvite.sentCount').replace('{count}', String(sentCount))}</p> : null}
        <footer className={styles.footer}><Button className={styles.cancel} onClick={close} disabled={submitting}>{t('workspaceInvite.cancel')}</Button>
          <Button type="submit" className={styles.submit} disabled={submitting || !rows.some(row => row.email.trim())}>{submitting ? t('workspaceInvite.sending') : t('workspaceInvite.confirm')}</Button></footer>
      </form>
    </section>
    {owner && openRoleIndex !== null ? createPortal(<div className={styles.menu} ref={menu} style={menuPos} role="listbox" id={`${id}-roles`}
      onKeyDown={event => {
        if (event.key === 'Escape' || event.key === 'Tab') { event.preventDefault(); event.stopPropagation(); setOpenRoleIndex(null); triggers.current[openRoleIndex]?.focus(); }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); const buttons = Array.from(menu.current?.querySelectorAll('button') ?? []); const index = buttons.indexOf(document.activeElement as HTMLButtonElement); buttons[(index + (event.key === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length]?.focus(); }
      }}>
      {(['member', 'admin'] as const).map(role => <Button key={role} role="option" aria-selected={rows[openRoleIndex]?.role === role} className={styles.option}
        onClick={() => { updateRow(openRoleIndex, { role }); setOpenRoleIndex(null); triggers.current[openRoleIndex]?.focus(); }}>
        <span>{roleText(role)}<small>{t(role === 'admin' ? 'workspaceInvite.adminDescription' : 'workspaceInvite.memberDescription')}</small></span>{rows[openRoleIndex]?.role === role ? <Icon name="check" size={14} /> : null}
      </Button>)}
    </div>, document.body) : null}
  </div>;
}
