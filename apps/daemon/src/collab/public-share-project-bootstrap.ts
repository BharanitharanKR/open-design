import type { ApiFailureReason, TeamProject } from '@open-design/contracts';
import { isUnmaterializedSharedPlaceholder } from './shared-project-placeholder.js';
import type { runVelaCommand } from '../integrations/vela-command.js';
import { projectResourceIdFor } from '../integrations/vela-team-projects.js';
import type { ResourceHubPrincipal } from './resource-principal.js';
import { createVelaCliResourceAdapter } from './vela-cli-resource-adapter.js';
import { createVelaCliTeamProjectCatalog } from './vela-cli-team-projects.js';
import { classifyVelaCommandFailure, type PublicShareBootstrapStage } from './public-file-failure.js';

class PublicShareProjectBootstrapError extends Error {
  constructor(readonly stage: PublicShareBootstrapStage,
    readonly failure: { reason: ApiFailureReason; upstreamStatus?: number },
    message: 'PUBLIC_SHARE_PROJECT_CONTENT_UNAVAILABLE' | 'PUBLIC_SHARE_PROJECT_ROOT_UNAVAILABLE'
      | 'PUBLIC_SHARE_PROJECT_CATALOG_UNAVAILABLE' | 'PUBLIC_SHARE_PROJECT_BOOTSTRAP_FAILED') {
    super(message);
  }
}

function bootstrapError(stage: PublicShareBootstrapStage, error: unknown, rootOutputEmpty: boolean, localReason?: ApiFailureReason) {
  const { reason, upstreamStatus } = classifyVelaCommandFailure('push', error);
  const failure = stage === 'bootstrap_content_preflight' || stage === 'bootstrap_directory_preflight'
    ? { reason: 'local_file' as const }
    : stage === 'bootstrap_root_version'
      ? { reason: rootOutputEmpty ? 'empty_response' as const : 'invalid_receipt' as const }
      : localReason || error instanceof SyntaxError
        ? { reason: localReason ?? 'invalid_receipt' as const }
        : { reason, ...(upstreamStatus !== undefined ? { upstreamStatus } : {}) };
  const message = stage === 'bootstrap_content_preflight' ? 'PUBLIC_SHARE_PROJECT_CONTENT_UNAVAILABLE'
    : stage === 'bootstrap_root_version' ? 'PUBLIC_SHARE_PROJECT_ROOT_UNAVAILABLE'
      : localReason ? 'PUBLIC_SHARE_PROJECT_CATALOG_UNAVAILABLE' : 'PUBLIC_SHARE_PROJECT_BOOTSTRAP_FAILED';
  return new PublicShareProjectBootstrapError(stage, failure, message);
}

/** Only daemon-log tokens cross this boundary. Never retain the child error,
 * cause, command output or even a token-shaped upstream code (which may be PII).
 * Unknown/injected ensureProject errors have no trusted bootstrap stage.
 */
export function publicShareProjectBootstrapDiagnostic(error: unknown) {
  return error instanceof PublicShareProjectBootstrapError
    ? { stage: error.stage, failure: error.failure }
    : { stage: 'bootstrap' as const, failure: { reason: 'unknown' as const } };
}

/** Called only for a proven local author. Reuse the project root transport and
 * catalog with one captured session; never republish a file alias here. */
export async function ensurePublicShareProject(input: {
  projectId: string;
  principal: ResourceHubPrincipal;
  run: typeof runVelaCommand;
  resolveProjectDir(projectId: string): string | Promise<string>;
  describeProject(projectId: string): Record<string, unknown> | null;
}): Promise<TeamProject> {
  const { projectId, principal, run } = input;
  let stage: PublicShareBootstrapStage = 'bootstrap_content_preflight';
  let rootOutputEmpty = false;
  let localReason: ApiFailureReason | undefined;
  try {
    const metadata = input.describeProject(projectId);
    // A hub-to-local shell must never be uploaded in the opposite direction.
    if (!metadata || isUnmaterializedSharedPlaceholder({ metadata: metadata.metadata })) {
      throw new Error('PUBLIC_SHARE_PROJECT_CONTENT_UNAVAILABLE');
    }
    const catalog = createVelaCliTeamProjectCatalog({
      run: args => run(['team-projects', ...args]),
      runResource: args => run(['resource', ...args]), supportsTeamProjects: () => true,
    });
    // The caller already established authoritative catalog absence. Do not repeat
    // that negative lookup through the pinned runner, which deliberately redacts
    // CLI error text (including 404); verify the positive registration below.
    const root = createVelaCliResourceAdapter({
      resolveProjectDir: project => {
        stage = 'bootstrap_directory_preflight';
        return input.resolveProjectDir(project);
      },
      describeProject: project => {
        stage = 'bootstrap_content_preflight';
        return input.describeProject(project);
      },
      hasTeamIdentity: candidate => candidate?.teamId === principal.teamId && candidate.memberId === principal.memberId,
      run: async args => {
        stage = 'bootstrap_root_push';
        const output = await run(['resource', ...args]);
        stage = 'bootstrap_root_version';
        rootOutputEmpty = !output.trim();
        return output;
      },
    });
    const version = await root.publish({ projectId, principal, reason: 'public-share-project-bootstrap' });
    if (!version?.versionId) throw new Error('PUBLIC_SHARE_PROJECT_ROOT_UNAVAILABLE');
    stage = 'bootstrap_catalog_upsert';
    await catalog.upsert({ projectId, resourceId: projectResourceIdFor(projectId, principal),
      displayName: typeof metadata?.name === 'string' ? metadata.name : projectId,
      syncState: 'synced', lastSyncedVersionId: version.versionId, metadata }, principal);
    stage = 'bootstrap_catalog_readback';
    const registered = await catalog.get(projectId, principal.teamId);
    if (!registered) {
      localReason = 'invalid_receipt';
      throw new Error('PUBLIC_SHARE_PROJECT_CATALOG_UNAVAILABLE');
    }
    return registered;
  } catch (error) {
    throw bootstrapError(stage, error, rootOutputEmpty, localReason);
  }
}
