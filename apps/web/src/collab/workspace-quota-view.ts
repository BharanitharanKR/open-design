import type { WorkspaceBillingResponse, WorkspaceCollabContext } from '@open-design/contracts';
import { workspaceBillingBalanceUsd } from './useWorkspaceContext';

export type WorkspaceQuotaTier = 'free' | 'go' | 'plus' | 'pro' | 'max';

/** Presentation values, not a new daemon/CLI wire contract (CS-01, DD:1309). */
export interface WorkspaceQuotaView {
  tier: WorkspaceQuotaTier | null;
  planKnown: boolean;
  loading: boolean;
  balanceUsd: string | null;
  /** CS-07 / DD:1315: only a server status may populate this; never dates. */
  planStatus: string | null;
  windows: ReadonlyArray<{
    durationSeconds: number;
    remainingPercent: number;
    resetsAt: string | null;
  }> | null;
  breakdown: string | null;
  modelRestriction: string | null;
}

export function workspaceQuotaTier(raw: string | null | undefined): WorkspaceQuotaTier | null {
  const parts = raw?.trim().toLowerCase().split(/[_-]+/) ?? [];
  return (['free', 'go', 'plus', 'pro', 'max'] as const).find(tier => parts.includes(tier)) ?? null;
}

export function workspaceQuotaView({ context, response, tier, balanceUsd }: {
  context: WorkspaceCollabContext | null;
  response?: WorkspaceBillingResponse | null;
  tier: string | null;
  /** Existing host's explicitly workspace-scoped money, for callers without a raw response. */
  balanceUsd?: string | null;
}): WorkspaceQuotaView {
  // Division:65 / VIEW-012: a raw response must prove this workspace AND member.
  // Never fall through to the host's older amount after a scoped read rejects it.
  const balance = context?.workspaceId && context.workspaceMemberId
    ? response !== undefined
      ? workspaceBillingBalanceUsd(response, context)
      : balanceUsd ?? null
    : null;
  return {
    tier: workspaceQuotaTier(tier),
    planKnown: Boolean(tier?.trim()),
    loading: balance == null && !response?.workspaceBalance && !response?.workspaceSnapshot,
    balanceUsd: balance,
    // CS-06 / DD:1314: the current v1 snapshot parser does not expose these
    // optional fields. Account summary / personal Coding Plan are not substitutes.
    // Keep unavailable until the daemon exposes the agreed workspace schema.
    planStatus: null,
    windows: null,
    breakdown: null,
    modelRestriction: null,
  };
}
