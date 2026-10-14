import { useEffect, useMemo, useRef, useState } from 'react';
import type { PrepareCommentIdentityResponse, WorkspaceCollabContext } from '@open-design/contracts';
import { prepareCommentSource, CommentPreparationClientError } from './preparation';
import { workspaceIdentityCacheKey, currentWorkspaceAccountGeneration } from '../collab/workspace-identity';

/** A saved receipt starts a one-way document transition. Only matching source
 * plus the real current-frame witness releases it; later intentional edits do
 * not restart it or authorize identity backfill. Live revisions also invalidate
 * callbacks retained by a pending Share preflight.
 */
export function useCommentPreparation(options: {
  projectId: string; fileName: string; context: WorkspaceCollabContext | null;
  authorized: boolean; settled: boolean; inputKey: string;
  document?: { source: string | null; key: string; ready: boolean };
  verifiedDocument?: { source: string } | null;
  confirm: () => boolean; apply: (result: PrepareCommentIdentityResponse) => void;
}) {
  const accountGeneration = currentWorkspaceAccountGeneration();
  const scope = JSON.stringify([options.projectId, options.fileName, workspaceIdentityCacheKey(options.context), accountGeneration]);
  const key = useMemo(() => JSON.stringify([scope, options.authorized, options.settled, options.inputKey, options.document?.key, options.document?.ready]),
    [scope, options.authorized, options.settled, options.inputKey, options.document?.key, options.document?.ready]);
  const live = useRef({ key, scope, revision: 0 });
  if (live.current.key !== key) live.current = { key, scope, revision: live.current.revision + 1 };
  const renderRevision = live.current.revision;
  const pending = useRef<{ scope: string; source: string; previousKey: string | null } | null>(null);
  const adopted = useRef({ scope, done: false });
  if (adopted.current.scope !== scope) adopted.current = { scope, done: false };
  if (options.verifiedDocument && !adopted.current.done) {
    adopted.current.done = true;
    if (pending.current?.scope !== scope) pending.current = { scope, source: options.verifiedDocument.source, previousKey: null };
  }
  const [, setDocumentRevision] = useState(0);
  useEffect(() => {
    const transition = pending.current;
    const document = options.document;
    if (transition?.scope !== scope || !document?.ready || document.source === null) return;
    if (transition.previousKey !== null && transition.previousKey === document.key) return;
    if (document.source.replace(/^\uFEFF/, '') !== transition.source.replace(/^\uFEFF/, '')) return;
    pending.current = null;
    setDocumentRevision(value => value + 1);
  }); // Pending may be installed imperatively; check every commit, not just prop changes.
  const running = useRef(false);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; live.current.revision++; }; }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ scope: string; code: string } | null>(null);
  const [saved, setSaved] = useState<{ key: string; result: PrepareCommentIdentityResponse } | null>(null);
  const currentAttempt = () => alive.current && live.current.scope === scope && live.current.revision === renderRevision
    && currentWorkspaceAccountGeneration() === accountGeneration;
  const documentPending = () => !alive.current || live.current.scope !== scope || currentWorkspaceAccountGeneration() !== accountGeneration
    || pending.current?.scope === scope;
  const reportBlocked = (code: string) => { if (alive.current && live.current.scope === scope) setError({ scope, code }); };
  function validateLiveRevision() {
    if (!currentAttempt()) { reportBlocked('COMMENT_PREPARATION_STALE'); return false; }
    return true;
  }
  function validatePublication(requirePreparedDocument = true) {
    if (!currentAttempt()) { reportBlocked('COMMENT_PREPARATION_STALE'); return false; }
    if (!options.authorized || !options.settled) { reportBlocked('COMMENT_EDITING_UNSETTLED'); return false; }
    if (documentPending() || (requirePreparedDocument && !options.document?.ready)) { reportBlocked('COMMENT_PREVIEW_NOT_READY'); return false; }
    return true;
  }
  async function prepare() {
    if (running.current || !alive.current) return false;
    if (!currentAttempt()) { reportBlocked('COMMENT_PREPARATION_STALE'); return false; }
    if (!options.authorized || !options.context) { reportBlocked('WORKSPACE_CONTEXT_REQUIRED'); return false; }
    if (!options.settled) { reportBlocked('COMMENT_EDITING_UNSETTLED'); return false; }
    if (!options.confirm()) return false;
    running.current = true; setBusy(true); setError(null);
    try {
      const result = await prepareCommentSource({ ...options, revision: renderRevision }, currentAttempt);
      if (!currentAttempt()) return false;
      pending.current = { scope, source: result.source, previousKey: options.document?.key ?? null };
      adopted.current.done = true;
      setSaved({ key: scope, result });
      options.apply(result);
      return true;
    } catch (failure) {
      reportBlocked(!currentAttempt() ? 'COMMENT_PREPARATION_STALE' : failure instanceof CommentPreparationClientError ? failure.code : 'COMMENT_PREPARATION_FAILED');
      return false;
    } finally { running.current = false; if (alive.current) setBusy(false); }
  }
  const canStartDocumentWitness = () => currentAttempt() && options.settled && !running.current;
  return { prepare, validatePublication, validateLiveRevision, canStartDocumentWitness, documentPending, pendingDocument: pending.current?.scope === scope,
    reportBlocked, busy, error: error?.scope === scope ? error.code : null, saved: saved?.key === scope ? saved.result : null };
}
