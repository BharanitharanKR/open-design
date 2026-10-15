// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { useCommentPreparation } from '../../src/comments/use-comment-preparation';
const a = '<h2 data-od-comment-id="12345678-1234-4234-8234-123456789abc">A</h2>';
const b = a.replace('>A<', '>B<');
const receipt = { source: a, changed: true, preparedTargets: 1, version: { id: 'v2', version: 2 } };
const context = { workspaceId: 'ws', workspaceMemberId: 'owner', permissions: { canWriteSyncedFiles: true } } as WorkspaceCollabContext;
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
it('R6 current-source validation also blocks the in-flight preparation before a receipt exists', async () => {
  let release!: (value: Response) => void;
  vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('<h2>A</h2>'))
    .mockReturnValueOnce(new Promise(resolve => { release = resolve; })).mockResolvedValueOnce(new Response(a)));
  const initial = { projectId: 'p', fileName: 'index.html', context, authorized: true, settled: true, inputKey: 'a', confirm: () => true, apply: vi.fn(),
    document: { source: '<h2>A</h2>', key: 'a', ready: true } };
  const { result } = renderHook(() => useCommentPreparation(initial));
  let request!: Promise<boolean>;
  await act(async () => { request = result.current.prepare(); });
  expect(result.current.saved).toBeNull();
  act(() => expect(result.current.validatePublication(false)).toBe(false));
  await act(async () => { release(Response.json(receipt)); expect(await request).toBe(true); });
});
it.each(['outage', 'unknown', 'stale'] as const)('R5 %s revalidation keeps the transition pending, retires old A, and permits explicit retry', async failure => {
  let release!: (value: { prior: boolean; current: boolean; source: string }) => void;
  const held = new Promise<{ prior: boolean; current: boolean; source: string }>(resolve => { release = resolve; });
  const readCurrentProof = vi.fn().mockImplementationOnce(() => failure === 'outage' ? Promise.reject(new Error('COMMENT_PREPARATION_PROOF_UNAVAILABLE')) : held)
    .mockResolvedValue({ prior: true, current: true, source: b });
  const initial = { projectId: 'p', fileName: 'index.html', context, authorized: true, settled: true, inputKey: 'a', confirm: () => true, apply: vi.fn(), readCurrentProof,
    verifiedDocument: { source: a }, document: { source: a, key: 'a', ready: false } };
  const { result, rerender } = renderHook((props: typeof initial) => useCommentPreparation(props), { initialProps: initial });
  rerender({ ...initial, inputKey: 'b', document: { source: b, key: 'b', ready: true } });
  let request!: Promise<boolean>;
  await act(async () => { request = result.current.revalidateDocument(); });
  if (failure === 'stale') rerender({ ...initial, inputKey: 'new-draft', settled: false, document: { source: b, key: 'b', ready: true } });
  await act(async () => {
    if (failure !== 'outage') release({ prior: failure !== 'unknown', current: true, source: b });
    expect(await request).toBe(false);
  });
  // Even a subsequently delivered old A document cannot clear a failed retry.
  rerender({ ...initial, inputKey: 'late-a', document: { source: a, key: 'late-a', ready: true } });
  expect(result.current.documentPending()).toBe(true);
  rerender({ ...initial, inputKey: 'settled-b', document: { source: b, key: 'b', ready: true } });
  await act(async () => expect(await result.current.revalidateDocument()).toBe(true));
  expect(result.current.documentPending()).toBe(false);
  expect(initial.apply).not.toHaveBeenCalled();
});
it('R5 stale pending reads do not disable a newer explicit retry or overwrite its success', async () => {
  let release!: (value: { prior: boolean; current: boolean; source: string }) => void;
  const readCurrentProof = vi.fn().mockReturnValueOnce(new Promise(resolve => { release = resolve; }))
    .mockResolvedValue({ prior: true, current: true, source: b });
  const initial = { projectId: 'p', fileName: 'index.html', context, authorized: true, settled: true, inputKey: 'a', confirm: () => true, apply: vi.fn(), readCurrentProof,
    verifiedDocument: { source: a }, document: { source: a, key: 'a', ready: false } };
  const { result, rerender } = renderHook((props: typeof initial) => useCommentPreparation(props), { initialProps: initial });
  let oldRead!: Promise<boolean>;
  await act(async () => { oldRead = result.current.revalidateDocument(); });
  expect(result.current.busy).toBe(true);
  expect(result.current.revalidating).toBe(true);
  rerender({ ...initial, inputKey: 'b', document: { source: b, key: 'b', ready: true } });
  expect(result.current.busy).toBe(false);
  expect(result.current.revalidating).toBe(false);
  await act(async () => expect(await result.current.revalidateDocument()).toBe(true));
  expect(result.current.documentPending()).toBe(false);
  await act(async () => { release({ prior: true, current: true, source: a }); expect(await oldRead).toBe(false); });
  expect(result.current.documentPending()).toBe(false);
  expect(result.current.error).toBeNull();
  expect(initial.apply).not.toHaveBeenCalled();
});
it('R5 retains drafts without starting reads, then requires the current B frame and preserves deliberate loss', async () => {
  const readCurrentProof = vi.fn().mockResolvedValue({ prior: true, current: false, source: '<h2>Identity intentionally removed</h2>' });
  const initial = { projectId: 'p', fileName: 'index.html', context, authorized: true, settled: false, inputKey: 'draft', confirm: () => true, apply: vi.fn(), readCurrentProof,
    verifiedDocument: { source: a }, document: { source: b, key: 'b', ready: false } };
  const { result, rerender } = renderHook((props: typeof initial) => useCommentPreparation(props), { initialProps: initial });
  await act(async () => expect(await result.current.revalidateDocument()).toBe(false));
  expect(readCurrentProof).not.toHaveBeenCalled();
  rerender({ ...initial, settled: true, inputKey: 'settled' });
  await act(async () => expect(await result.current.revalidateDocument()).toBe(true));
  expect(result.current.documentPending()).toBe(true);
  rerender({ ...initial, settled: true, inputKey: 'lost-source', document: { source: '<h2>Identity intentionally removed</h2>', key: 'lost', ready: false } });
  expect(result.current.documentPending()).toBe(true);
  rerender({ ...initial, settled: true, inputKey: 'lost-source', document: { source: '<h2>Identity intentionally removed</h2>', key: 'lost', ready: true } });
  expect(result.current.documentPending()).toBe(false);
  expect(initial.apply).not.toHaveBeenCalled();
});
it.each(['api', 'reopened'] as const)('R5 %s preparation can explicitly revalidate B before A witness without writing or restoring A', async origin => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('<h2>A</h2>')).mockResolvedValueOnce(Response.json(receipt)).mockResolvedValueOnce(new Response(a));
  vi.stubGlobal('fetch', fetcher);
  const readCurrentProof = vi.fn().mockResolvedValue({ prior: true, current: true, source: b });
  const initial = { projectId: 'p', fileName: 'index.html', context, authorized: true, settled: true, inputKey: 'a', confirm: () => true, apply: vi.fn(), readCurrentProof,
    verifiedDocument: origin === 'reopened' ? { source: a } : null, document: { source: origin === 'api' ? '<h2>A</h2>' : a, key: 'a', ready: false } };
  const { result, rerender } = renderHook((props: typeof initial) => useCommentPreparation(props), { initialProps: initial });
  if (origin === 'api') await act(async () => expect(await result.current.prepare()).toBe(true));
  expect(result.current.documentPending()).toBe(true);
  rerender({ ...initial, inputKey: 'b', document: { source: b, key: 'b', ready: true } });
  expect(result.current.documentPending()).toBe(true);
  const writes = fetcher.mock.calls.length;
  await act(async () => expect(await result.current.revalidateDocument()).toBe(true));
  expect(result.current.documentPending()).toBe(false);
  expect(result.current.validatePublication()).toBe(true);
  expect(readCurrentProof).toHaveBeenCalledOnce();
  expect(fetcher).toHaveBeenCalledTimes(writes);
  expect(initial.apply).toHaveBeenCalledTimes(origin === 'api' ? 1 : 0);
  // Later deliberate loss stays a loss; no automatic revalidation/backfill.
  rerender({ ...initial, inputKey: 'lost', document: { source: '<h2>Lost identity</h2>', key: 'lost', ready: true } });
  expect(result.current.documentPending()).toBe(false);
  expect(readCurrentProof).toHaveBeenCalledOnce();
});
