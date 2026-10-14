import { useEffect, useMemo, useRef, useState } from 'react';
import type { PrepareCommentIdentityResponse, WorkspaceCollabContext } from '@open-design/contracts';
import { prepareCommentSource, CommentPreparationClientError } from './preparation';
import { workspaceIdentityCacheKey, currentWorkspaceAccountGeneration } from '../collab/workspace-identity';

/** Late completions never replace a newer draft, file, source or account. Saved IDs are
 * left on disk even when completion is obsolete; recovery is an explicit retry. */
export function useCommentPreparation(options: {
  projectId: string;
  fileName: string;
  context: WorkspaceCollabContext | null;
  authorized: boolean;
  settled: boolean;
  inputKey: string;
  confirm: () => boolean;
  apply: (result: PrepareCommentIdentityResponse) => void;
}) {
  const accountGeneration = currentWorkspaceAccountGeneration();
  const scope = JSON.stringify([options.projectId, options.fileName, workspaceIdentityCacheKey(options.context), accountGeneration]);
  const key = useMemo(() => JSON.stringify([scope, options.authorized, options.settled, options.inputKey]),
    [scope, options.authorized, options.settled, options.inputKey]);
  const live = useRef({ key, scope, revision: 0 });
  if (live.current.key !== key) live.current = { key, scope, revision: live.current.revision + 1 };
  const running = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; live.current.revision++; };
  }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ scope: string; code: string } | null>(null);
  const [saved, setSaved] = useState<{ key: string; result: PrepareCommentIdentityResponse } | null>(null);
  async function prepare() {
    if (running.current || !alive.current) return false;
    // A Share preflight can retain an older callback while the user edits.
    if (live.current.key !== key || currentWorkspaceAccountGeneration() !== accountGeneration) {
      if (live.current.scope === scope) setError({ scope, code: 'COMMENT_PREPARATION_STALE' });
      return false;
    }
    if (!options.authorized || !options.context) { setError({ scope, code: 'WORKSPACE_CONTEXT_REQUIRED' }); return false; }
    if (!options.settled) { setError({ scope, code: 'COMMENT_EDITING_UNSETTLED' }); return false; }
    if (!options.confirm()) return false;
    const revision = live.current.revision;
    const isCurrent = () => alive.current && live.current.key === key && live.current.revision === revision
      && currentWorkspaceAccountGeneration() === accountGeneration;
    running.current = true;
    setBusy(true);
    setError(null);
    try {
      const result = await prepareCommentSource({ ...options, revision }, isCurrent);
      if (!isCurrent()) return false;
      setSaved({ key: scope, result });
      options.apply(result);
      return true;
    } catch (failure) {
      if (alive.current && live.current.scope === scope) setError({ scope,
        code: !isCurrent() ? 'COMMENT_PREPARATION_STALE' : failure instanceof CommentPreparationClientError ? failure.code : 'COMMENT_PREPARATION_FAILED' });
      return false;
    } finally {
      running.current = false;
      if (alive.current) setBusy(false);
    }
  }
  const reportBlocked = (code: string) => setError({ scope, code });
  return { prepare, reportBlocked, busy, error: error?.scope === scope ? error.code : null, saved: saved?.key === scope ? saved.result : null };
}
