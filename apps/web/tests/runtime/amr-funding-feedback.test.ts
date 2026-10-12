import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkAmrFundingFeedback } from '../../src/runtime/amr-funding-feedback';
import { advanceWorkspaceAccountGeneration, resetWorkspaceAccountGeneration } from '../../src/collab/workspace-identity';

let sequence = 0;
function fixture(result: 'available' | 'insufficient' | 'unknown' | undefined) {
  const scope = { workspaceType: 'personal' as const, workspaceId: `ws-${++sequence}`, workspaceMemberId: 'member' };
  const preflight = { schemaVersion: 1, ...scope, modelId: 'model', generatedAt: new Date().toISOString(), fundingCheck: result };
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ preflight })));
  vi.stubGlobal('fetch', fetchMock);
  return { scope, preflight, fetchMock };
}

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); resetWorkspaceAccountGeneration(); });
describe('independent AMR funding feedback', () => {
  it('uses the dedicated read without fetching display billing or creating a run', async () => {
    const { scope, fetchMock } = fixture('insufficient');
    expect(await checkAmrFundingFeedback(scope, 'model')).toBe('insufficient');
    expect(fetchMock).toHaveBeenCalledWith(`/api/workspace/billing/preflight?workspaceId=${scope.workspaceId}&modelId=model`, expect.objectContaining({ cache: 'no-store' }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it.each([undefined, 'unknown'] as const)('does not turn an old or uncertain server result (%s) into a rejection', async (result) => {
    const { scope } = fixture(result);
    expect(await checkAmrFundingFeedback(scope, 'model')).toBe('unknown');
  });
  it.each(['member', 'workspace', 'model', 'stale', 'future'] as const)('rejects %s evidence', async (change) => {
    const { scope, preflight } = fixture('insufficient');
    if (change === 'member') preflight.workspaceMemberId = 'other';
    if (change === 'workspace') preflight.workspaceId = 'other';
    if (change === 'model') preflight.modelId = 'other';
    if (change === 'stale') preflight.generatedAt = new Date(Date.now() - 60_000).toISOString();
    if (change === 'future') preflight.generatedAt = new Date(Date.now() + 60_000).toISOString();
    expect(await checkAmrFundingFeedback(scope, 'model')).toBe('unknown');
  });
  it('deduplicates concurrent reads but never reuses a negative result for a new send', async () => {
    const { scope, fetchMock } = fixture('insufficient');
    expect(await Promise.all([checkAmrFundingFeedback(scope, 'model'), checkAmrFundingFeedback(scope, 'model')])).toEqual(['insufficient', 'insufficient']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await checkAmrFundingFeedback(scope, 'model');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it('briefly reuses positive evidence only for the same account, member and model', async () => {
    const { scope, fetchMock } = fixture('available');
    await checkAmrFundingFeedback(scope, 'model');
    await checkAmrFundingFeedback(scope, 'model');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    advanceWorkspaceAccountGeneration('another-account');
    await checkAmrFundingFeedback(scope, 'model');
    await checkAmrFundingFeedback({ ...scope, workspaceMemberId: 'another-member' }, 'model');
    await checkAmrFundingFeedback(scope, 'other-model');
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
  it('expires positive hints after five seconds and reads the server again', async () => {
    vi.useFakeTimers();
    const { scope, preflight, fetchMock } = fixture('available');
    await checkAmrFundingFeedback(scope, 'model');
    vi.advanceTimersByTime(5_001);
    preflight.fundingCheck = 'insufficient';
    expect(await checkAmrFundingFeedback(scope, 'model')).toBe('insufficient');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it('discards an in-flight result after the account changes', async () => {
    const { scope, preflight, fetchMock } = fixture('insufficient');
    let finish!: (response: Response) => void;
    fetchMock.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    const result = checkAmrFundingFeedback(scope, 'model');
    advanceWorkspaceAccountGeneration('new-account');
    finish(new Response(JSON.stringify({ preflight })));
    expect(await result).toBe('unknown');
  });
  it('leaves network failure unknown', async () => {
    const { scope, fetchMock } = fixture('insufficient');
    fetchMock.mockRejectedValue(new Error('offline'));
    expect(await checkAmrFundingFeedback(scope, 'model')).toBe('unknown');
  });
});
