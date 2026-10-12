import type { WorkspaceBillingPreflightResponse } from '@open-design/contracts';
import { currentWorkspaceAccountGeneration } from '../collab/workspace-identity';
import type { AmrBalanceGateScope } from './amr-balance-gate';

type FundingFeedback = 'available' | 'insufficient' | 'unknown';
const pending = new Map<string, Promise<FundingFeedback>>();
let positive: { key: string; expiresAt: number } | null = null;

/** Independent, read-only feedback. Cached negatives never open a dialog.
 * A short positive cache can suppress redundant reads; Link still admits runs. */
export function checkAmrFundingFeedback(
  scope: AmrBalanceGateScope | undefined,
  modelId: string | null,
): Promise<FundingFeedback> {
  if (!scope) return Promise.resolve('unknown');
  const generation = currentWorkspaceAccountGeneration();
  const key = JSON.stringify([generation, scope.workspaceId, scope.workspaceMemberId, modelId]);
  if (positive?.key === key && positive.expiresAt > Date.now()) return Promise.resolve('available');
  const existing = pending.get(key);
  if (existing) return existing;
  const request = (async (): Promise<FundingFeedback> => {
    try {
      const query = new URLSearchParams({ workspaceId: scope.workspaceId });
      if (modelId) query.set('modelId', modelId);
      const response = await fetch(`/api/workspace/billing/preflight?${query}`, {
        cache: 'no-store', signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) return 'unknown';
      const { preflight } = await response.json() as WorkspaceBillingPreflightResponse;
      const age = Date.now() - Date.parse(preflight?.generatedAt);
      if (generation !== currentWorkspaceAccountGeneration() || !preflight ||
        preflight.schemaVersion !== 1 || preflight.workspaceId !== scope.workspaceId ||
        preflight.workspaceMemberId !== scope.workspaceMemberId || preflight.modelId !== modelId ||
        !Number.isFinite(age) || age < -5_000 || age > 30_000) return 'unknown';
      if (preflight.fundingCheck === 'available') {
        positive = { key, expiresAt: Date.now() + 5_000 };
        return 'available';
      }
      return preflight.fundingCheck === 'insufficient' ? 'insufficient' : 'unknown';
    } catch {
      return 'unknown';
    }
  })();
  pending.set(key, request);
  void request.finally(() => pending.delete(key));
  return request;
}
