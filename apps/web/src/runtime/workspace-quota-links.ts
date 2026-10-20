import { amrConsoleUrlForWorkspace, amrPlansUrlForWorkspace } from './amr-guidance';

/** Balance is a view link; only the owner upgrade asks for plans. */
export function quotaPopoverConsoleUrl(
  profile: string | null | undefined,
  workspaceId: string | null | undefined,
  intent: 'console' | 'plans' = 'console',
): string | null {
  return intent === 'plans'
    ? amrPlansUrlForWorkspace(profile, workspaceId)
    : amrConsoleUrlForWorkspace(profile, workspaceId);
}
