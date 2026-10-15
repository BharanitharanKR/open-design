import type Database from 'better-sqlite3';
import type { CommentFileFact } from '@open-design/contracts';
import { ensureWorkspaceArtifactForPath, getLiveWorkspaceArtifactByPath } from '../chat-artifacts/store.js';
import { getProject, getWorkspaceProjectByProjectId, updateProject } from '../db.js';
import type { runVelaCommand } from '../integrations/vela-command.js';
import { commitCommentFileFacts, retiredCommentFileMutation } from './comment-file-authority.js';
import { canonicalCommentFilePath, commentFilesAtReceipt, parseCommentFileState } from './comment-file-facts.js';

/** Paths whose current new-protocol lifetime must not be moved by managed rename.
 * Local pre-share comments carry a durable artifact UUID before catalog admission.
 * Join that exact UUID AND original path; never infer identities for historical rows.
 */
export function trackedCommentFilePaths(db: Database.Database, projectId: string): string[] {
  const facts = parseCommentFileState(getProject(db, projectId)?.metadata?._commentFiles)?.files ?? [];
  const retired = new Set(facts.filter(fact => fact.retired).map(fact => fact.sourceFileId));
  const local = db.prepare(`SELECT DISTINCT a.id, a.current_path AS path
    FROM workspace_artifacts a JOIN preview_comments c
      ON c.project_id = a.project_id AND c.source_file_id = a.id AND c.file_path = a.current_path
    WHERE a.project_id = ? AND a.deleted_at IS NULL AND a.current_path IS NOT NULL`)
    .all(projectId) as Array<{ id: string; path: string }>;
  return [...new Set([...facts.filter(fact => !fact.retired).map(fact => fact.sourceFilePath),
    ...local.filter(row => !retired.has(row.id)).map(row => row.path)])];
}

/** Creator-only producers use the existing artifact pointer; mirrors never remint it. */
export function createLocalCommentFiles(db: Database.Database) {
  function creator(projectId: string, workspaceId: string, memberId: string) {
    const binding = getWorkspaceProjectByProjectId(db, projectId);
    if (!binding || binding.workspaceId !== workspaceId || binding.createdByWorkspaceMemberId !== memberId
      || binding.resourceState !== 'active' || binding.cloudTombstonedAt != null) {
      throw new Error('COMMENT_FILE_AUTHORITY_UNAVAILABLE');
    }
    return binding;
  }
  function identity(projectId: string, filePath: string): string {
    if (!canonicalCommentFilePath(filePath)) throw new Error('COMMENT_FILE_AUTHORITY_UNAVAILABLE');
    const state = parseCommentFileState(getProject(db, projectId)?.metadata?._commentFiles);
    const admitted = state?.files.find(fact => !fact.retired && fact.sourceFilePath === filePath);
    if (admitted) return admitted.sourceFileId;
    // A restart or another creator device may already have committed retirement.
    // Only tombstone this exact old UUID; never replace a mirror's local card ID.
    for (const retired of state?.files.filter(fact => fact.retired && fact.sourceFilePath === filePath) ?? []) {
      db.prepare('UPDATE workspace_artifacts SET current_path = NULL, deleted_at = ?, updated_at = ? WHERE project_id = ? AND id = ? AND current_path = ? AND deleted_at IS NULL')
        .run(Date.now(), Date.now(), projectId, retired.sourceFileId, filePath);
    }
    return ensureWorkspaceArtifactForPath(db, { projectId, path: filePath, kind: 'html' }).id;
  }
  async function admit(input: {
    projectId: string; workspaceId: string; creatorMemberId: string; resourceId: string; versionId: string;
    paths: Array<{ sourceFilePath: string; entryPath: string }>; run: typeof runVelaCommand;
  }) {
    creator(input.projectId, input.workspaceId, input.creatorMemberId);
    const files = input.paths.map(file => ({ ...file, sourceFileId: identity(input.projectId, file.sourceFilePath), retired: false }));
    if (!files.length) return;
    const state = await commitCommentFileFacts({ ...input, files });
    creator(input.projectId, input.workspaceId, input.creatorMemberId);
    const adopted = commentFilesAtReceipt(parseCommentFileState(getProject(db, input.projectId)?.metadata?._commentFiles), state, input);
    updateProject(db, input.projectId, { metadata: { ...getProject(db, input.projectId)?.metadata, _commentFiles: adopted } });
  }
  async function retire(input: {
    projectId: string; workspaceId: string; creatorMemberId: string; fact: CommentFileFact; run: typeof runVelaCommand;
  }) {
    creator(input.projectId, input.workspaceId, input.creatorMemberId);
    // The original ID/receipt is captured before I/O. Never resolve by reused path after awaiting.
    const original = { ...input.fact };
    const current = parseCommentFileState(getProject(db, input.projectId)?.metadata?._commentFiles)
      ?.files.find(fact => !fact.retired && fact.sourceFilePath === original.sourceFilePath);
    const localArtifactId = current?.sourceFileId === original.sourceFileId
      ? getLiveWorkspaceArtifactByPath(db, input.projectId, original.sourceFilePath)?.id : null;
    const state = await commitCommentFileFacts({ ...input, resourceId: original.resourceId,
      versionId: original.versionId, files: retiredCommentFileMutation(original) });
    creator(input.projectId, input.workspaceId, input.creatorMemberId);
    db.transaction(() => {
      const previous = parseCommentFileState(getProject(db, input.projectId)?.metadata?._commentFiles);
      const retired = state.files.find(fact => fact.sourceFileId === original.sourceFileId && fact.retired);
      if (!previous || !retired) throw new Error('COMMENT_FILE_AUTHORITY_UNAVAILABLE');
      updateProject(db, input.projectId, { metadata: { ...getProject(db, input.projectId)?.metadata,
        _commentFiles: { schemaVersion: 1, revision: Math.max(previous.revision, state.revision),
          files: previous.files.map(fact => fact.sourceFileId === original.sourceFileId ? retired : fact) } } });
      // Conditional artifact tombstone cannot delete a concurrent F2 pointer.
      db.prepare('UPDATE workspace_artifacts SET current_path = NULL, deleted_at = ?, updated_at = ? WHERE project_id = ? AND id = ? AND deleted_at IS NULL')
        .run(Date.now(), Date.now(), input.projectId, localArtifactId ?? original.sourceFileId);
    })();
  }
  return { identity, admit, retire };
}
