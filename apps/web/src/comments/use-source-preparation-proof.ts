import { useEffect, useMemo, useRef, useState } from 'react';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { currentWorkspaceAccountGeneration, workspaceIdentityCacheKey } from '../collab/workspace-identity';
import type { SourcePreparationProof } from './source-preparation-proof';

/** A verified prior source/version is a durable fact for this authorized scope,
 * not a claim that the current frame still contains any of those identities.
 * Unknown, stale or failed reads cannot turn into legacy permission/ready state.
 */
export function useSourcePreparationProof(options: { enabled: boolean; projectId: string; fileName: string; context: WorkspaceCollabContext | null; source: string | null; inputKey: string }) {
  const generation = currentWorkspaceAccountGeneration();
  const scope = JSON.stringify([options.projectId, options.fileName, workspaceIdentityCacheKey(options.context), generation]);
  const [retryKey, setRetryKey] = useState(0);
  const sourcePresent = options.source !== null;
  const key = useMemo(() => JSON.stringify([scope, options.enabled, sourcePresent, options.inputKey, retryKey]),
    [scope, options.enabled, sourcePresent, options.inputKey, retryKey]);
  const live = useRef({ key, revision: 0 });
  if (live.current.key !== key) live.current = { key, revision: live.current.revision + 1 };
  const [state, setState] = useState<{ scope: string; key: string; result?: SourcePreparationProof; error?: string } | null>(null);
  const established = state?.scope === scope && state.result?.prior === true;
  useEffect(() => {
    const context = options.context;
    if (!options.enabled || !context || options.source === null || established) return;
    let cancelled = false;
    const revision = live.current.revision;
    const isCurrent = () => !cancelled && live.current.revision === revision && currentWorkspaceAccountGeneration() === generation;
    // Load the real HTML parsers only for an enabled proof, not every FileViewer.
    void import('./source-preparation-proof').then(({ readSourcePreparationProof }) => {
      if (!isCurrent()) return;
      return readSourcePreparationProof(options.projectId, options.fileName, context, isCurrent);
    }).then(result => {
      if (result && isCurrent()) setState({ scope, key, result });
    }, failure => {
      if (isCurrent()) setState({ scope, key, error: failure instanceof Error ? failure.message : 'COMMENT_PREPARATION_PROOF_UNAVAILABLE' });
    });
    return () => { cancelled = true; };
  }, [key, established]);
  const current = state?.scope === scope && (established || state.key === key) ? state : null;
  const status = !options.enabled ? 'disabled' : current?.error ? 'error' : current?.result ? 'ready' : 'loading';
  return { status, prior: Boolean(current?.result?.prior), current: Boolean(current?.result?.current
    && options.source?.replace(/^\uFEFF/, '') === current.result.source.replace(/^\uFEFF/, '')), error: current?.error,
    verifiedDocument: current?.result?.prior ? { source: current.result.source } : null,
    retry: () => setRetryKey(value => value + 1) };
}
