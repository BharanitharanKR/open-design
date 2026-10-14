// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { createHash, webcrypto } from 'node:crypto';
import { buildWorkspacePermissions, buildWorkspaceSeatSummary, type WorkspaceCollabContext } from '@open-design/contracts';
import { FileViewer } from '../../src/components/FileViewer';
import { invalidateHtmlSourceSnapshotProject } from '../../src/components/html-source-snapshot-cache';
import { CollabProvider, type CollabContextValue } from '../../src/collab/collab-context';
import type { PreviewComment } from '../../src/types';
vi.mock('../../src/components/BoardComposerPopover', async importOriginal => {
  const original = await importOriginal<typeof import('../../src/components/BoardComposerPopover')>();
  return { ...original, BoardComposerPopover: (props: { draft: string; onDraft: (value: string) => void; onSaveComment: () => void }) => <div>
    <input data-testid="probe-draft" value={props.draft} onChange={event => props.onDraft(event.target.value)} />
    <button data-testid="probe-save" onClick={props.onSaveComment}>Save</button>
  </div> };
});
const uuid = '12345678-1234-4234-8234-123456789abc';
const original = '<html><body><h2 data-od-id="tool">Target</h2></body></html>';
const prepared = original.replace('<h2 ', `<h2 data-od-comment-id="${uuid}" `);
const version = { id: 'prepared-source', fileName: 'index.html', contentDigest: createHash('sha256').update(prepared).digest('hex'), version: 2 };
const context: WorkspaceCollabContext = { workspaceId: 'ws', workspaceType: 'team', workspaceMemberId: 'owner', role: 'owner', memberStatus: 'active', lifecycleState: 'active', billingState: 'active', planId: null, providerMode: 'platform_credits', seatSummary: buildWorkspaceSeatSummary({ seatLimit: 3, usedSeats: 1 }), permissions: buildWorkspacePermissions({ role: 'owner', lifecycleState: 'active' }) };
const collab: CollabContextValue = { workspaceContext: context, workspaceContextLoading: false, enabled: false, member: null, present: [], publishedVersion: null, syncState: null, viewerOnly: false, writerAuthority: 'allowed', isOwner: true, isEffectiveOwner: true, isSharedNonOwner: false, ownerDisplayName: null, ownerRole: null, downloadPending: false, reportChange() {}, requestPublish() {}, refreshPresence() {}, checkStatusNow() {} };
const target = { elementId: 'tool', selector: '[data-od-id="tool"]', label: 'h2', text: 'Target', htmlHint: '<h2>', position: { x: 20, y: 30, width: 100, height: 40 } };
function setup(options: { reload?: 'old' | 'failed' | 'held'; history?: PreviewComment[]; prior?: boolean; currentPrepared?: boolean } = {}) {
  let saved = false;
  let delayedPlan = false;
  let releasePlan!: () => void;
  const plan = new Promise<void>(resolve => { releasePlan = resolve; });
  const writes = vi.fn();
  const saveComment = vi.fn();
  const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const path = new URL(url, 'http://localhost').pathname;
    if (path.endsWith('/share-plan')) { if (delayedPlan) await plan; return Response.json({ blockers: [], exceedsSizeLimit: false }); }
    if (init?.method === 'POST') writes(path);
    if (path.endsWith('/comment-identities/prepare')) { saved = true; return Response.json({ source: prepared, version, preparedTargets: 1, changed: true }); }
    if (path.endsWith('/versions')) return Response.json({ versions: saved || options.prior ? [version] : [] });
    if (path.endsWith('/versions/prepared-source')) return Response.json({ version, content: prepared });
    if (path.endsWith('/files/index.html')) return new Response(saved || options.currentPrepared ? prepared : original);
    if (path.endsWith('/raw/index.html')) {
      if (saved && options.reload === 'held') return new Promise<Response>(() => {});
      if (saved && options.reload === 'failed') return new Response('', { status: 500 });
      return new Response((saved && !options.reload) || options.currentPrepared ? prepared : original);
    }
    if (path.endsWith('/publish-public')) return Response.json({ status: 'none', freshness: 'unknown' });
    if (path.endsWith('/integrations/vela/status')) return Response.json({ loggedIn: true, user: { id: 'owner' } });
    return Response.json({});
  });
  vi.stubGlobal('fetch', fetcher); vi.stubGlobal('crypto', webcrypto);
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  render(<CollabProvider value={collab}><FileViewer projectId="barrier-project" projectKind="prototype" file={{ name: 'index.html', path: 'index.html', type: 'file', kind: 'html', mime: 'text/html', size: 100, mtime: 1 }} previewComments={options.history} onSavePreviewComment={saveComment} /></CollabProvider>);
  return { writes, saveComment, fetcher, delayPlan: () => { delayedPlan = true; }, releasePlan };
}
async function prepare() {
  const button = await screen.findByRole('button', { name: 'Prepare static comments · save source version' });
  await waitFor(() => expect(button).toBeEnabled()); fireEvent.click(button);
  await waitFor(() => expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('Waiting for the matching preview'));
}
async function witness() {
  await waitFor(() => expect((screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement).srcdoc).toContain(uuid));
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  const post = vi.spyOn(frame.contentWindow!, 'postMessage');
  act(() => fireEvent.load(frame));
  const probe = post.mock.calls.map(call => call[0]).find(data => data?.type === 'od:srcdoc-transport-ready-probe');
  expect(probe?.probeId).toBeTruthy();
  await act(async () => {
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:srcdoc-transport-activated', generation: probe.generation, probeId: probe.probeId, bodyComplete: true } }));
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:comment-targets', targets: [] } }));
  });
  await waitFor(() => expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('Preview ready'));
  return frame;
}
async function selectLegacy() {
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  Object.defineProperty(frame, 'clientHeight', { configurable: true, value: 800 });
  Object.defineProperty(frame, 'clientWidth', { configurable: true, value: 1000 });
  await act(async () => window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:comment-target', ...target } })));
  return frame;
}
afterEach(() => { cleanup(); invalidateHtmlSourceSnapshotProject('barrier-project'); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
it.each(['old', 'failed', 'held'] as const)('R1 saved receipt with %s preview cannot activate or submit a legacy comment', async reload => {
  const { saveComment } = setup({ reload });
  await prepare();
  fireEvent.click(screen.getByTestId('comment-panel-toggle'));
  expect(screen.getByTestId('comment-panel-toggle')).toHaveAttribute('aria-pressed', 'false');
  await selectLegacy();
  const input = screen.queryByTestId('probe-draft');
  if (input) { fireEvent.change(input, { target: { value: 'Retained draft' } }); fireEvent.click(screen.getByTestId('probe-save')); }
  expect(saveComment).not.toHaveBeenCalled();
});
it.each(['old', 'failed'] as const)('R1 refuses submission from an already emitted legacy target while %s preview waits', async reload => {
  const { saveComment } = setup({ reload });
  await prepare();
  await waitFor(() => expect((screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement).srcdoc).toContain('Target'));
  await selectLegacy();
  const input = await screen.findByTestId('probe-draft');
  fireEvent.change(input, { target: { value: 'Retained draft' } });
  fireEvent.click(screen.getByTestId('probe-save'));
  expect(saveComment).not.toHaveBeenCalled();
  expect(input).toHaveValue('Retained draft');
});
it.each(['comment-draft', 'manual-edit'] as const)('R2 delayed first-publication plan must refuse live %s after successful receipt/witness', async change => {
  const { writes, delayPlan, releasePlan } = setup();
  await prepare(); await witness();
  delayPlan();
  fireEvent.click(await screen.findByRole('button', { name: /^share$/i }));
  const generate = await screen.findByRole('menuitem', { name: 'Generate and copy link' });
  await waitFor(() => expect(generate).toBeEnabled()); fireEvent.click(generate);
  if (change === 'comment-draft') {
    await selectLegacy();
    fireEvent.change(await screen.findByTestId('probe-draft'), { target: { value: 'New unsaved comment' } });
  } else {
    fireEvent.click(screen.getByTestId('manual-edit-mode-toggle'));
    await waitFor(() => expect(screen.getByTestId('manual-edit-mode-toggle')).toHaveAttribute('aria-pressed', 'true'));
  }
  await act(async () => releasePlan());
  expect(writes.mock.calls.filter(call => String(call[0]).endsWith('/publish-public'))).toHaveLength(0);
  if (change === 'comment-draft') expect(screen.getByTestId('probe-draft')).toHaveValue('New unsaved comment');
});
it.each([false, true])('verified actual prior source/version (current prepared=%s) needs its frame witness, never backfills lost IDs', async currentPrepared => {
  const { writes, saveComment } = setup({ prior: true, currentPrepared });
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Prepare static comments · save source version' })).toBeNull());
  fireEvent.click(screen.getByTestId('comment-panel-toggle'));
  expect(screen.getByTestId('comment-panel-toggle')).toHaveAttribute('aria-pressed', 'false');
  await waitFor(() => expect((screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement).srcdoc).toContain('Target'));
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  const post = vi.spyOn(frame.contentWindow!, 'postMessage');
  await act(async () => { fireEvent.load(frame); });
  const probe = post.mock.calls.map(call => call[0]).filter(data => data?.type === 'od:srcdoc-transport-ready-probe').at(-1);
  expect(probe?.probeId).toBeTruthy();
  await act(async () => {
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:srcdoc-transport-activated', generation: probe.generation, probeId: probe.probeId, bodyComplete: true } }));
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:comment-targets', targets: [] } }));
  });
  fireEvent.click(screen.getByTestId('comment-panel-toggle'));
  expect(screen.getByTestId('comment-panel-toggle')).toHaveAttribute('aria-pressed', 'true');
  await selectLegacy();
  const input = await screen.findByTestId('probe-draft');
  fireEvent.change(input, { target: { value: 'Legacy behavior retained after intentional loss' } });
  fireEvent.click(screen.getByTestId('probe-save'));
  expect(saveComment).toHaveBeenCalledOnce();
  expect(writes).not.toHaveBeenCalled(); expect(window.confirm).not.toHaveBeenCalled();
});
it.each(['cmt:fake', 'cmt:aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'])('untrusted comment history %s is not a preparation receipt', async elementId => {
  const { fetcher } = setup({ history: [{ ...target, id: 'fake', projectId: 'barrier-project', conversationId: 'c', filePath: 'index.html', elementId, note: 'Untrusted claim', status: 'open', createdAt: 1, updatedAt: 1 } as PreviewComment] });
  await waitFor(() => {
    expect(fetcher.mock.calls.some(call => String(call[0]).includes('/raw/index.html'))).toBe(true);
    const button = screen.queryByRole('button', { name: 'Prepare static comments · save source version' });
    if (button) expect(button).toBeEnabled();
  });
  await act(async () => {}); // Flush the completed in-memory raw response before the user action.
  fireEvent.click(screen.getByTestId('comment-panel-toggle'));
  await waitFor(() => expect(window.confirm).toHaveBeenCalledOnce());
});
