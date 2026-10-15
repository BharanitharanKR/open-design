// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { readSourcePreparationProof } from '../../src/comments/source-preparation-proof';
import { useSourcePreparationProof } from '../../src/comments/use-source-preparation-proof';
import { advanceWorkspaceAccountGeneration, resetWorkspaceAccountGeneration } from '../../src/collab/workspace-identity';
vi.mock('../../src/comments/source-preparation-proof', () => ({ readSourcePreparationProof: vi.fn() }));
const context = { workspaceId: 'ws', workspaceMemberId: 'owner' } as WorkspaceCollabContext;
const options = { enabled: true, projectId: 'p', fileName: 'index.html', context, source: '<h2>Source</h2>', inputKey: 'settled' };
afterEach(() => { cleanup(); vi.clearAllMocks(); resetWorkspaceAccountGeneration(); });
it.each(['draft', 'source', 'file', 'project', 'account'])('late proof across %s revision is not promoted to prior/ready', async change => {
  let release!: (value: { prior: boolean; current: boolean; source: string }) => void;
  const held = new Promise<{ prior: boolean; current: boolean; source: string }>(resolve => { release = resolve; });
  vi.mocked(readSourcePreparationProof).mockReturnValueOnce(held).mockReturnValue(new Promise(() => {}));
  const { result, rerender } = renderHook((props: typeof options) => useSourcePreparationProof(props), { initialProps: options });
  expect(result.current.status).toBe('loading');
  await waitFor(() => expect(readSourcePreparationProof).toHaveBeenCalledOnce());
  if (change === 'account') advanceWorkspaceAccountGeneration('other-account');
  rerender({ ...options, inputKey: change, ...(change === 'source' ? { source: '<h2>New source</h2>' } : {}), ...(change === 'file' ? { fileName: 'other.html' } : {}), ...(change === 'project' ? { projectId: 'other' } : {}) });
  await act(async () => release({ prior: true, current: true, source: options.source }));
  expect(result.current.status).toBe('loading'); expect(result.current.prior).toBe(false);
});
it('verified prior source remains a fact after intentional loss, without re-preparation or a false current claim', async () => {
  vi.mocked(readSourcePreparationProof).mockResolvedValue({ prior: true, current: true, source: options.source });
  const { result, rerender } = renderHook((props: typeof options) => useSourcePreparationProof(props), { initialProps: options });
  await waitFor(() => expect(result.current.status).toBe('ready'));
  expect(result.current.current).toBe(true);
  rerender({ ...options, source: '<h2>Restored unprepared history</h2>', inputKey: 'intentional-loss' });
  expect(result.current.prior).toBe(true); expect(result.current.current).toBe(false);
  expect(readSourcePreparationProof).toHaveBeenCalledOnce();
});
it('explicit revalidation rereads established proof while retaining the prior fact on outage/unknown', async () => {
  vi.mocked(readSourcePreparationProof).mockResolvedValueOnce({ prior: true, current: true, source: options.source })
    .mockRejectedValueOnce(new Error('COMMENT_PREPARATION_PROOF_UNAVAILABLE'))
    .mockResolvedValueOnce({ prior: false, current: false, source: 'unknown' })
    .mockResolvedValue({ prior: true, current: true, source: '<h2>Edited B</h2>' });
  const { result, rerender } = renderHook((props: typeof options) => useSourcePreparationProof(props), { initialProps: options });
  await waitFor(() => expect(result.current.prior).toBe(true));
  rerender({ ...options, source: '<h2>Edited B</h2>', inputKey: 'edited-b' });
  await act(async () => { await expect(result.current.revalidate()).rejects.toThrow('COMMENT_PREPARATION_PROOF_UNAVAILABLE'); });
  expect(result.current.prior).toBe(true); expect(result.current.current).toBe(false);
  await act(async () => { expect((await result.current.revalidate()).prior).toBe(false); });
  expect(result.current.prior).toBe(true); expect(result.current.current).toBe(false);
  await act(async () => { expect((await result.current.revalidate()).source).toBe('<h2>Edited B</h2>'); });
  expect(result.current.current).toBe(true);
  expect(readSourcePreparationProof).toHaveBeenCalledTimes(4);
});
it.each(['file', 'account', 'unmount'])('explicit proof read cannot grant a stale %s result', async change => {
  let release!: (value: { prior: boolean; current: boolean; source: string }) => void;
  vi.mocked(readSourcePreparationProof).mockResolvedValueOnce({ prior: true, current: true, source: options.source })
    .mockReturnValueOnce(new Promise(resolve => { release = resolve; })).mockReturnValue(new Promise(() => {}));
  const { result, rerender, unmount } = renderHook((props: typeof options) => useSourcePreparationProof(props), { initialProps: options });
  await waitFor(() => expect(result.current.prior).toBe(true));
  let read!: Promise<unknown>;
  await act(async () => { read = result.current.revalidate().catch(error => error.message); });
  await waitFor(() => expect(readSourcePreparationProof).toHaveBeenCalledTimes(2));
  if (change === 'unmount') unmount();
  else if (change === 'account') advanceWorkspaceAccountGeneration('new-owner');
  else rerender({ ...options, fileName: 'other.html' });
  await act(async () => { release({ prior: true, current: true, source: 'old-result' }); expect(await read).toBe('COMMENT_PREPARATION_STALE'); });
  if (change === 'file') expect(result.current.prior).toBe(false);
});
it('outage remains error and can retry read-only proof, never a ready/legacy shortcut', async () => {
  vi.mocked(readSourcePreparationProof).mockRejectedValueOnce(new Error('COMMENT_PREPARATION_PROOF_UNAVAILABLE')).mockResolvedValue({ prior: false, current: false, source: options.source });
  const { result } = renderHook(() => useSourcePreparationProof(options));
  await waitFor(() => expect(result.current.status).toBe('error'));
  expect(result.current.prior).toBe(false);
  act(() => result.current.retry());
  await waitFor(() => expect(result.current.status).toBe('ready'));
  expect(result.current.prior).toBe(false);
});
