import type Database from 'better-sqlite3';
import { getProject, getWorkspaceProjectByProjectId } from '../db.js';
import type { runVelaCommand } from '../integrations/vela-command.js';
import { parseCommentFileState } from './comment-file-facts.js';
import type { createLocalCommentFiles } from './local-comment-files.js';
import { matchesPublicFileDeleteTarget, type PublicFileDeleteTarget } from './project-public-file-stop.js';

/** Stop all original shares before a single all-or-nothing lifetime retirement.
 * Failed stops or authority checks leave identities active for ordinary retry;
 * routes remove bytes only after this preparation succeeds. */
export function createCommentFileDeletion(input: {
  db: Database.Database;
  localFiles: ReturnType<typeof createLocalCommentFiles>;
  hasActiveRun: (projectId: string) => boolean;
  runForWorkspace: (workspaceId: string) => typeof runVelaCommand;
  stopPublicFiles: (scope: { resourceTeamId: string; ownerMemberId: string; projectId: string }, target?: PublicFileDeleteTarget) => Promise<void>;
}) {
  return async (projectId: string, target?: PublicFileDeleteTarget) => {
    const binding = getWorkspaceProjectByProjectId(input.db, projectId);
    if (!binding?.workspaceId || !binding.createdByWorkspaceMemberId) {
      // An orphaned publication cannot borrow the current user's identity.
      const publication = (input.db.prepare('SELECT file_path FROM public_file_publications WHERE project_id = ?').all(projectId) as Array<{ file_path: string }>)
        .some(row => matchesPublicFileDeleteTarget(row.file_path, target));
      if (publication) throw new Error('PUBLIC_FILE_STOP_PENDING');
      return;
    }
    const facts = parseCommentFileState(getProject(input.db, projectId)?.metadata?._commentFiles)?.files
      .filter(fact => !fact.retired && matchesPublicFileDeleteTarget(fact.sourceFilePath, target)) ?? [];
    if (facts.length && input.hasActiveRun(projectId)) throw new Error('COMMENT_FILE_PROJECT_BUSY');
    await input.stopPublicFiles({ resourceTeamId: binding.workspaceId,
      ownerMemberId: binding.createdByWorkspaceMemberId, projectId }, target);
    await input.localFiles.retireMany({ projectId, workspaceId: binding.workspaceId,
      creatorMemberId: binding.createdByWorkspaceMemberId, facts, run: input.runForWorkspace(binding.workspaceId) });
  };
}
