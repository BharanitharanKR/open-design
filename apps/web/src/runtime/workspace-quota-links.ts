import { amrConsoleUrlForWorkspace, amrPlansUrlForWorkspace } from './amr-guidance';

/** E01–E18 / division:65: balance is a view link; only the owner upgrade asks for plans. */
export function quotaPopoverConsoleUrl(
  profile: string | null | undefined,
  workspaceId: string | null | undefined,
  intent: 'console' | 'plans' = 'console',
): string | null {
  return intent === 'plans'
    ? amrPlansUrlForWorkspace(profile, workspaceId)
    : amrConsoleUrlForWorkspace(profile, workspaceId);
}
