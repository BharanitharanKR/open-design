import type { CommentFileFact, CommentFileMutation, CommentFileState } from '@open-design/contracts';
import type { runVelaCommand } from '../integrations/vela-command.js';
import { parseCommentFileState } from './comment-file-facts.js';

export interface CommentFileCatalog {
  resourceId: string;
  metadata?: Record<string, unknown>;
}

/** Existing catalog CAS transport only. Response state is never replayed as mutation input. */
export async function commitCommentFileFacts(input: {
  projectId: string;
  workspaceId: string;
  creatorMemberId: string;
  resourceId: string;
  versionId: string;
  files: CommentFileMutation['files'];
  run: typeof runVelaCommand;
}): Promise<CommentFileState> {
  const read = async () => {
    const row = JSON.parse(await input.run(['team-projects', 'get', input.projectId, '--json'])) as {
      projectId?: string; workspaceId?: string; ownerMemberId?: string; resourceId?: string; metadata?: Record<string, unknown>;
    };
    if (row.projectId !== input.projectId || row.workspaceId !== input.workspaceId
      || row.ownerMemberId !== input.creatorMemberId || !row.resourceId) throw new Error('COMMENT_FILE_AUTHORITY_UNAVAILABLE');
    const state = row.metadata?._commentFiles === undefined
      ? { schemaVersion: 1 as const, revision: 0, files: [] } : parseCommentFileState(row.metadata._commentFiles);
    if (!state) throw new Error('COMMENT_FILE_AUTHORITY_UNAVAILABLE');
    return { row, state };
  };
  const matches = (state: CommentFileState) => input.files.every(file => state.files.some(fact =>
    fact.sourceFileId === file.sourceFileId && fact.sourceFilePath === file.sourceFilePath
    && fact.entryPath === file.entryPath && fact.retired === file.retired
    && fact.resourceId === input.resourceId && fact.versionId === input.versionId));
  const { row, state } = await read();
  const rootResourceId = row.resourceId;
  if (!rootResourceId) throw new Error('COMMENT_FILE_AUTHORITY_UNAVAILABLE');
  if (matches(state)) return state; // Lost successful response / idempotent retry.
  for (const file of input.files) {
    const old = state.files.find(fact => fact.sourceFileId === file.sourceFileId);
    if (old && (old.sourceFilePath !== file.sourceFilePath || (old.retired && !file.retired))) {
      throw new Error('COMMENT_FILE_LIFETIME_CONFLICT');
    }
    if (file.retired && (!old || old.resourceId !== input.resourceId || old.versionId !== input.versionId
      || old.entryPath !== file.entryPath)) throw new Error('COMMENT_FILE_AUTHORITY_UNAVAILABLE');
  }
  const mutation: CommentFileMutation = { schemaVersion: 1, baseRevision: state.revision,
    resourceId: input.resourceId, versionId: input.versionId, files: input.files };
  let failure: unknown;
  try {
    await input.run(['team-projects', 'upsert', input.projectId, '--resource-id', rootResourceId,
      '--metadata-json', JSON.stringify({ ...row.metadata, _commentFiles: mutation })]);
  } catch (error) { failure = error; }
  const admitted = (await read()).state;
  if (!matches(admitted)) throw failure ?? new Error('COMMENT_FILE_AUTHORITY_UNAVAILABLE');
  return admitted;
}

export function retiredCommentFileMutation(fact: CommentFileFact): CommentFileMutation['files'] {
  return [{ sourceFileId: fact.sourceFileId, sourceFilePath: fact.sourceFilePath,
    entryPath: fact.entryPath, retired: true }];
}
