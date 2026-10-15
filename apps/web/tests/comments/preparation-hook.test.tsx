// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { advanceWorkspaceAccountGeneration, resetWorkspaceAccountGeneration } from '../../src/collab/workspace-identity';
import { useCommentPreparation } from '../../src/comments/use-comment-preparation';
const context = { workspaceId: 'ws', workspaceMemberId: 'owner', permissions: { canWriteSyncedFiles: true } } as WorkspaceCollabContext;
const saved = { source: '<h2 data-od-comment-id="12345678-1234-4234-8234-123456789abc">Target</h2>', changed: true, preparedTargets: 1, version: { id: 'source-version-2', version: 2 } };
const options = { projectId: 'p', fileName: 'index.html', context, authorized: true, settled: true, inputKey: 'no-drafts', confirm: () => true, apply: vi.fn() };
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); options.apply.mockClear(); resetWorkspaceAccountGeneration(); });
it.each(['cancel', 'new-draft', 'source', 'file', 'project', 'authority', 'account', 'frame', 'unmount'])('async confirmation keeps %s mutation-free and rejects obsolete consent', async change => {
  let decide!: (value: boolean) => void;
  const consent = new Promise<boolean>(resolve => { decide = resolve; });
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('<h2>Target</h2>'));
  vi.stubGlobal('fetch', fetcher);
  const initial = { ...options, confirm: () => consent, document: { source: '<h2>Target</h2>', key: 'a', ready: true } };
  const { result, rerender, unmount } = renderHook((props: typeof initial) => useCommentPreparation(props), { initialProps: initial });
  let pending!: Promise<boolean>;
  await act(async () => { pending = result.current.prepare(); });
  expect(fetcher).not.toHaveBeenCalled();
  if (change === 'account') advanceWorkspaceAccountGeneration('other-account');
  else if (change === 'unmount') unmount();
  else if (change !== 'cancel') rerender({ ...initial, inputKey: change,
    ...(change === 'new-draft' ? { settled: false } : {}), ...(change === 'file' ? { fileName: 'other.html' } : {}),
    ...(change === 'project' ? { projectId: 'other' } : {}), ...(change === 'authority' ? { authorized: false } : {}),
    ...(change === 'source' ? { document: { source: '<h2>New B</h2>', key: 'b', ready: true } } : {}),
    ...(change === 'frame' ? { document: { ...initial.document, ready: false } } : {}) });
  await act(async () => { decide(change !== 'cancel'); expect(await pending).toBe(false); });
  expect(fetcher).not.toHaveBeenCalled(); expect(options.apply).not.toHaveBeenCalled();
});
it('cancel never reads or mutates source', async () => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  const { result } = renderHook(() => useCommentPreparation({ ...options, confirm: () => false }));
  await act(async () => { expect(await result.current.prepare()).toBe(false); });
  expect(fetcher).not.toHaveBeenCalled(); expect(options.apply).not.toHaveBeenCalled();
});
it.each([{ settled: false }, { authorized: false }, { context: null }])('unsaved/generation/permission preconditions invoke nothing %j', overrides => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  const { result } = renderHook(() => useCommentPreparation({ ...options, ...overrides }));
  act(() => { void result.current.prepare(); });
  expect(fetcher).not.toHaveBeenCalled(); expect(options.apply).not.toHaveBeenCalled();
});
it.each(['new-draft','version-switch','file-switch','project-switch'])('late source save cannot clobber %s; no automatic retry, publish or comment', async change => {
  let release!: (response: Response) => void;
  const posted = new Promise<Response>(resolve => { release = resolve; });
  const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('<h2>Target</h2>')).mockReturnValueOnce(posted);
  vi.stubGlobal('fetch', fetcher);
  const { result, rerender } = renderHook((props: typeof options) => useCommentPreparation(props), { initialProps: options });
  let pending!: Promise<boolean>;
  await act(async () => { pending = result.current.prepare(); });
  expect(fetcher).toHaveBeenCalledTimes(2);
  rerender({ ...options, inputKey: change, ...(change === 'file-switch' ? { fileName: 'other.html' } : {}), ...(change === 'project-switch' ? { projectId: 'other' } : {}) });
  await act(async () => { release(Response.json(saved)); expect(await pending).toBe(false); });
  expect(options.apply).not.toHaveBeenCalled(); expect(fetcher).toHaveBeenCalledTimes(2);
  expect(result.current.saved).toBeNull();
  if (change === 'new-draft' || change === 'version-switch') expect(result.current.error).toBe('COMMENT_PREPARATION_STALE');
  else expect(result.current.error).toBeNull();
});
it('a stale callback retained by Share preflight cannot start preparation after a new draft', async () => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  const { result, rerender } = renderHook((props: typeof options) => useCommentPreparation(props), { initialProps: options });
  const retained = result.current.prepare;
  rerender({ ...options, settled: false, inputKey: 'new-unsaved-draft' });
  await act(async () => { expect(await retained()).toBe(false); });
  expect(fetcher).not.toHaveBeenCalled(); expect(options.apply).not.toHaveBeenCalled();
});
it('account generation changes invalidate a retained callback even before React rerenders', async () => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  const { result } = renderHook(() => useCommentPreparation(options));
  advanceWorkspaceAccountGeneration('new-account');
  await act(async () => { expect(await result.current.prepare()).toBe(false); });
  expect(fetcher).not.toHaveBeenCalled(); expect(options.apply).not.toHaveBeenCalled();
});
it('unmounted viewer completion cannot reload or notify the next file', async () => {
  let release!: (response: Response) => void;
  const posted = new Promise<Response>(resolve => { release = resolve; });
  const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('<h2>Target</h2>')).mockReturnValueOnce(posted);
  vi.stubGlobal('fetch', fetcher);
  const { result, unmount } = renderHook(() => useCommentPreparation(options));
  let pending!: Promise<boolean>;
  await act(async () => { pending = result.current.prepare(); });
  unmount();
  await act(async () => { release(Response.json(saved)); expect(await pending).toBe(false); });
  expect(options.apply).not.toHaveBeenCalled();
  expect(fetcher).toHaveBeenCalledTimes(2);
});
it('live-only publication validation preserves unsupported/resume semantics but rejects retained stale callbacks', () => {
  const initial = { ...options, authorized: false, settled: false, context: null as WorkspaceCollabContext | null };
  const { result, rerender } = renderHook((props: typeof initial) => useCommentPreparation(props), { initialProps: initial });
  expect(result.current.validateLiveRevision()).toBe(true);
  const queued = result.current.validateLiveRevision;
  rerender({ ...initial, inputKey: 'new-input-without-source-change' });
  act(() => expect(queued()).toBe(false));
  expect(result.current.validateLiveRevision()).toBe(true);
});
it('pending prepared document blocks old/null/nonmatching frames, then releases once without blocking intentional identity loss', async () => {
  vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('<h2>Target</h2>')).mockResolvedValueOnce(Response.json(saved)).mockResolvedValueOnce(new Response(saved.source)));
  const initial = { ...options, document: { source: '<h2>Target</h2>' as string | null, key: 'old-frame', ready: true } };
  const { result, rerender } = renderHook((props: typeof initial) => useCommentPreparation(props), { initialProps: initial });
  await act(async () => { expect(await result.current.prepare()).toBe(true); });
  expect(result.current.documentPending()).toBe(true);
  rerender({ ...initial, document: { source: null, key: 'reload-frame', ready: false } });
  expect(result.current.documentPending()).toBe(true);
  rerender({ ...initial, document: { source: '<h2>Other source</h2>', key: 'reload-frame', ready: true } });
  expect(result.current.documentPending()).toBe(true);
  rerender({ ...initial, document: { source: saved.source, key: 'reload-frame', ready: false } });
  expect(result.current.documentPending()).toBe(true);
  rerender({ ...initial, document: { source: saved.source, key: 'reload-frame', ready: true } });
  expect(result.current.documentPending()).toBe(false);
  expect(result.current.validatePublication()).toBe(true);
  const queued = result.current.validatePublication;
  rerender({ ...initial, settled: false, inputKey: 'new-comment-draft', document: { source: saved.source, key: 'reload-frame', ready: true } });
  act(() => expect(queued()).toBe(false));
  rerender({ ...initial, inputKey: 'intentional-history-restore', document: { source: '<h2>Identity deliberately removed</h2>', key: 'history-frame', ready: true } });
  expect(result.current.documentPending()).toBe(false);
  expect(result.current.validatePublication()).toBe(true);
  expect(options.apply).toHaveBeenCalledOnce();
});
it('successful source-version save applies once and remains a source version, not a cloud publication receipt', async () => {
  vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('<h2>Target</h2>')).mockResolvedValueOnce(Response.json(saved)).mockResolvedValueOnce(new Response(saved.source)));
  const { result } = renderHook(() => useCommentPreparation(options));
  await act(async () => { expect(await result.current.prepare()).toBe(true); });
  expect(options.apply).toHaveBeenCalledExactlyOnceWith(saved);
  expect(result.current.saved?.version.id).toBe('source-version-2');
});
