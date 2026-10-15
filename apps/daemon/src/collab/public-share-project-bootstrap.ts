import type { PublicShareProjectRegistration, TeamProject } from '@open-design/contracts';
import { isUnmaterializedSharedPlaceholder } from './shared-project-placeholder.js';
import type { runVelaCommand } from '../integrations/vela-command.js';
import type { ResourceHubPrincipal } from './resource-principal.js';
import { ensurePrivateVelaTeamProject } from './vela-cli-team-projects.js';

/** Establish creator identity without uploading local metadata or root bytes.
 * Existing team policy and the server-generated root are never replaced. */
export async function ensurePublicShareProject(input: {
  projectId: string;
  principal: ResourceHubPrincipal;
  run: typeof runVelaCommand;
  describeProject(projectId: string): Record<string, unknown> | null;
  retainRoot?(registration: PublicShareProjectRegistration): void;
}): Promise<TeamProject & Omit<PublicShareProjectRegistration, 'createdAt'>> {
  const { projectId, principal, run } = input;
  const metadata = input.describeProject(projectId);
  if (!metadata || isUnmaterializedSharedPlaceholder({ metadata: metadata.metadata })) {
    throw new Error('PUBLIC_SHARE_PROJECT_CONTENT_UNAVAILABLE');
  }
  const registered = await ensurePrivateVelaTeamProject(projectId, principal, run);
  input.retainRoot?.(registered);
  return { ...registered, createdAt: Date.parse(registered.createdAt), sharedAt: registered.createdAt };
}
