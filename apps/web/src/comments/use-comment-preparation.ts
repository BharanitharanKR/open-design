import { useEffect, useMemo, useRef, useState } from 'react';
import type { PrepareCommentIdentityResponse, WorkspaceCollabContext } from '@open-design/contracts';
import { prepareCommentSource, CommentPreparationClientError } from './preparation';
import { workspaceIdentityCacheKey, currentWorkspaceAccountGeneration } from '../collab/workspace-identity';
import type { SourcePreparationProof } from './source-preparation-proof';

/** A saved receipt starts a one-way document transition. Matching source (or
 * explicitly revalidated current source) plus its real frame witness releases
 * it. Later intentional edits do not restart it or authorize identity backfill. Live revisions also invalidate
 * callbacks retained by a pending Share preflight.
 */
export function useCommentPreparation(options: {
  projectId: string; fileName: string; context: WorkspaceCollabContext | null;
  authorized: boolean; settled: boolean; inputKey: string;
  document?: { source: string | null; key: string; ready: boolean };
  verifiedDocument?: { source: string } | null;
  readCurrentProof?: () => Promise<SourcePreparationProof>;
  confirm: () => boolean; apply: (result: PrepareCommentIdentityResponse) => void;
}) {
  const accountGeneration = currentWorkspaceAccountGeneration();
  const scope = JSON.stringify([options.projectId, options.fileName, workspaceIdentityCacheKey(options.context), accountGeneration]);
  const key = useMemo(() => JSON.stringify([scope, options.authorized, options.settled, options.inputKey, options.document?.key, options.document?.ready]),
    [scope, options.authorized, options.settled, options.inputKey, options.document?.key, options.document?.ready]);
  const live = useRef({ key, scope, revision: 0 });
  if (live.current.key !== key) live.current = { key, scope, revision: live.current.revision + 1 };
  const renderRevision = live.current.revision;
  const pending = useRef<{ scope: string; source: string | null; previousKey: string | null } | null>(null);
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
    if (transition?.scope !== scope || transition.source === null || !document?.ready || document.source === null) return;
    if (transition.previousKey !== null && transition.previousKey === document.key) return;
    if (document.source.replace(/^\uFEFF/, '') !== transition.source.replace(/^\uFEFF/, '')) return;
    pending.current = null;
    setDocumentRevision(value => value + 1);
  }); // Pending may be installed imperatively; check every commit, not just prop changes.
  const running = useRef(false);
  const proofRead = useRef<{ revision: number } | null>(null);
  const proofBusy = () => proofRead.current?.revision === live.current.revision;
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
    if (running.current || proofBusy() || documentPending() || (requirePreparedDocument && !options.document?.ready)) { reportBlocked('COMMENT_PREVIEW_NOT_READY'); return false; }
    return true;
  }
  async function prepare() {
    if (running.current || proofBusy() || !alive.current) return false;
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
  async function revalidateDocument() {
    if (running.current || proofBusy() || !alive.current) return false;
    if (!currentAttempt()) { reportBlocked('COMMENT_PREPARATION_STALE'); return false; }
    if (!options.authorized || !options.settled) { reportBlocked('COMMENT_EDITING_UNSETTLED'); return false; }
    if (pending.current?.scope !== scope || !options.readCurrentProof) return false;
    // Retire A's witness before reading B. Failure/staleness must not let an
    // old A acknowledgment release this transition while retry is available.
    pending.current = { scope, source: null, previousKey: null };
    const request = { revision: renderRevision };
    proofRead.current = request;
    setDocumentRevision(value => value + 1); setError(null);
    try {
      const proof = await options.readCurrentProof();
      if (proofRead.current !== request) return false;
      if (!currentAttempt()) throw new Error('COMMENT_PREPARATION_STALE');
      if (!proof.prior) throw new Error('COMMENT_PREPARATION_PROOF_UNCONFIRMED');
      pending.current = { scope, source: proof.source, previousKey: null };
      setError(null);
      setDocumentRevision(value => value + 1);
      return true;
    } catch (failure) {
      if (proofRead.current === request) reportBlocked(!currentAttempt() ? 'COMMENT_PREPARATION_STALE' : failure instanceof Error ? failure.message : 'COMMENT_PREPARATION_PROOF_UNAVAILABLE');
      return false;
    } finally {
      if (proofRead.current === request) {
        proofRead.current = null;
        if (alive.current) setDocumentRevision(value => value + 1);
      }
    }
  }
  const canStartDocumentWitness = () => currentAttempt() && options.settled && !running.current && !proofBusy();
  return { prepare, revalidateDocument, validatePublication, validateLiveRevision, canStartDocumentWitness, documentPending, pendingDocument: pending.current?.scope === scope,
    reportBlocked, busy: busy || proofBusy(), revalidating: proofBusy(), error: error?.scope === scope ? error.code : null, saved: saved?.key === scope ? saved.result : null };
}
