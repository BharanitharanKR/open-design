import type { PrepareCommentIdentityResponse, WorkspaceCollabContext } from '@open-design/contracts';
import { workspaceProjectHeaders } from '../collab/workspace-identity';

export interface CommentPreparationAttempt {
  projectId: string;
  fileName: string;
  context: WorkspaceCollabContext | null;
  authorized: boolean;
  settled: boolean;
  /** Monotonic view/input revision, not a local-source or publication version. */
  revision: number;
}
export class CommentPreparationClientError extends Error {
  constructor(public code: string, message: string) { super(message); }
}

/** Explicit authored-source write only. No DOM, preview endpoint, rollback or submission. */
export async function prepareCommentSource(
  attempt: CommentPreparationAttempt,
  isCurrent: () => boolean,
  transport: typeof fetch = fetch,
): Promise<PrepareCommentIdentityResponse> {
  const fail = (code: string): never => { throw new CommentPreparationClientError(code, code); };
  if (!attempt.authorized || !attempt.context) fail('WORKSPACE_CONTEXT_REQUIRED');
  if (!attempt.settled) fail('COMMENT_EDITING_UNSETTLED');
  const check = () => { if (!isCurrent()) fail('COMMENT_PREPARATION_STALE'); };
  const headers = workspaceProjectHeaders(attempt.context!);
  const path = attempt.fileName.split('/').map(encodeURIComponent).join('/');
  const url = `/api/projects/${encodeURIComponent(attempt.projectId)}/files/${path}`;
  check();
  const read = await transport(url, { headers, cache: 'no-store' });
  if (!read.ok) fail('COMMENT_SOURCE_READ_FAILED');
  // Response.text() strips an authored UTF-8 BOM. Preserve it in the source
  // expectation/readback rather than accidentally conflicting with on-disk bytes.
  const decoder = new TextDecoder('utf-8', { ignoreBOM: true });
  const expectedSource = decoder.decode(await read.arrayBuffer());
  check();
  const saved = await transport(`${url}/comment-identities/prepare`, {
    method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ expectedSource, editingSettled: true }),
  });
  const payload = await saved.json();
  if (!saved.ok) throw new CommentPreparationClientError(payload?.error?.code ?? 'COMMENT_PREPARATION_FAILED', payload?.error?.message ?? 'Comment preparation failed');
  check();
  const result = payload as PrepareCommentIdentityResponse;
  if (typeof result.source !== 'string' || !result.version?.id) fail('COMMENT_VERSION_UNCONFIRMED');
  // Another normal save after the server's readback must not be clobbered by this response.
  const readback = await transport(url, { headers, cache: 'no-store' });
  if (!readback.ok || decoder.decode(await readback.arrayBuffer()) !== result.source) fail('COMMENT_SOURCE_CONFLICT');
  check();
  return result;
}
