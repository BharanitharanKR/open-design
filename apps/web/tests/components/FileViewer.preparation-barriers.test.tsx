// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
let projectSequence = 0;
let currentProjectId = '';
function setup(options: { reload?: 'old' | 'failed' | 'held'; history?: PreviewComment[]; prior?: boolean; currentPrepared?: boolean; activePublication?: boolean; stoppedPublication?: boolean } = {}) {
  const projectId = currentProjectId = `barrier-project-${++projectSequence}`;
  let saved = false;
  let editedSource: string | null = null;
  let proofUnavailable = false;
  let publicationCurrent = false;
  let heldProof: Promise<Response> | null = null;
  let releaseProof!: (response: Response) => void;
  let mtime = 1;
  const currentSource = () => editedSource ?? (saved || options.currentPrepared ? prepared : original);
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
    const editedVersion = { ...version, id: 'edited-source', version: 3, contentDigest: createHash('sha256').update(currentSource()).digest('hex') };
    if (path.endsWith('/versions')) return Response.json({ versions: editedSource ? [editedVersion, version] : saved || options.prior ? [version] : [] });
    if (path.endsWith('/versions/prepared-source')) return Response.json({ version, content: prepared });
    if (path.endsWith('/versions/edited-source')) return Response.json({ version: editedVersion, content: editedSource });
    if (path.endsWith('/files/index.html')) return heldProof ?? (proofUnavailable ? new Response('', { status: 503 }) : new Response(currentSource()));
    if (path.endsWith('/raw/index.html')) {
      if (saved && options.reload === 'held') return new Promise<Response>(() => {});
      if (saved && options.reload === 'failed') return new Response('', { status: 500 });
      return new Response(editedSource ?? ((saved && !options.reload) || options.currentPrepared ? prepared : original));
    }
    if (path.endsWith('/share-state')) return Response.json({ hasEverShared: Boolean(options.activePublication), bindingExists: Boolean(options.activePublication), publications: [] });
    if (path.endsWith('/publish-public')) {
      if (init?.method === 'POST') {
        publicationCurrent = true;
        return Response.json({ status: 'published', url: 'https://example.invalid/stable', receipt: { filePath: 'index.html', slug: 'stable', publishedAt: 2, version: options.stoppedPublication ? 1 : 2, versionId: options.stoppedPublication ? 'cloud-v1' : 'cloud-v2' } });
      }
      return Response.json(options.activePublication ? { status: options.stoppedPublication && !publicationCurrent ? 'stopped' : 'active', freshness: publicationCurrent ? 'current' : 'outdated', publication: { url: 'https://example.invalid/stable', slug: 'stable', fileName: 'index.html' } } : { status: 'none', freshness: 'unknown' });
    }
    if (path.endsWith('/integrations/vela/status')) return Response.json({ loggedIn: true, user: { id: 'owner' } });
    return Response.json({});
  });
  vi.stubGlobal('fetch', fetcher); vi.stubGlobal('crypto', webcrypto);
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  const tree = () => <CollabProvider value={collab}><FileViewer projectId={projectId} projectKind="prototype" file={{ name: 'index.html', path: 'index.html', type: 'file', kind: 'html', mime: 'text/html', size: 100, mtime }} previewComments={options.history?.map(comment => ({ ...comment, projectId }))} onSavePreviewComment={saveComment} /></CollabProvider>;
  const view = render(tree());
  const saveB = () => { editedSource = prepared.replace('Target', 'Edited B'); mtime++; view.rerender(tree()); };
  return { writes, saveComment, fetcher, saveB,
    holdProof: () => { heldProof = new Promise(resolve => { releaseProof = resolve; }); },
    releaseProof: () => { releaseProof(new Response(currentSource())); heldProof = null; },
    setProofUnavailable: (value: boolean) => { proofUnavailable = value; }, delayPlan: () => { delayedPlan = true; }, releasePlan };
}
async function prepare() {
  const button = await screen.findByRole('button', { name: 'Prepare static comments · save source version' });
  await waitFor(() => expect(button).toBeEnabled()); fireEvent.click(button);
  fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('Waiting for the matching preview'));
}
async function acknowledge(expected = uuid) {
  await waitFor(() => expect((screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement).srcdoc).toContain(expected));
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  const post = vi.spyOn(frame.contentWindow!, 'postMessage');
  act(() => fireEvent.load(frame));
  const probe = post.mock.calls.map(call => call[0]).filter(data => data?.type === 'od:srcdoc-transport-ready-probe').at(-1);
  expect(probe?.probeId).toBeTruthy();
  await act(async () => {
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:srcdoc-transport-activated', generation: probe.generation, probeId: probe.probeId, bodyComplete: true } }));
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:comment-targets', targets: [] } }));
  });
  return frame;
}
async function witness() {
  const frame = await acknowledge();
  await waitFor(() => expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('Preview ready'));
  return frame;
}
async function selectLegacy(override: Partial<typeof target> = {}) {
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  Object.defineProperty(frame, 'clientHeight', { configurable: true, value: 800 });
  Object.defineProperty(frame, 'clientWidth', { configurable: true, value: 1000 });
  await act(async () => window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:comment-target', ...target, ...override } })));
  return frame;
}
afterEach(() => { cleanup(); invalidateHtmlSourceSnapshotProject(currentProjectId); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
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
it.each(['api', 'reopened'] as const)('R5 %s A -> ordinary save B before first acknowledgment -> explicit read-only retry uses B', async origin => {
  const route = setup({ prior: origin === 'reopened', currentPrepared: origin === 'reopened' });
  if (origin === 'api') await prepare();
  else {
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Prepare static comments · save source version' })).toBeNull());
    fireEvent.click(screen.getByTestId('comment-panel-toggle'));
  }
  await waitFor(() => expect((screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement).srcdoc).toContain(uuid));
  // Save through the authored source/version fixture and normal file-mtime lifecycle,
  // not by replacing FileViewer's state or serializing its iframe.
  route.saveB();
  await acknowledge('Edited B');
  expect(screen.getByTestId('comment-panel-toggle')).toHaveAttribute('aria-pressed', 'false');
  const before = route.writes.mock.calls.length;
  fireEvent.click(await screen.findByTestId('comment-identity-revalidate'));
  await waitFor(() => expect(screen.queryByTestId('comment-identity-revalidate')).toBeNull());
  fireEvent.click(screen.getByTestId('comment-panel-toggle'));
  expect(screen.getByTestId('comment-panel-toggle')).toHaveAttribute('aria-pressed', 'true');
  expect((screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement).srcdoc).toContain('Edited B');
  await acknowledge('Edited B');
  await selectLegacy({ elementId: `cmt:${uuid}`, selector: `[data-od-comment-id="${uuid}"]`, text: 'Edited B' });
  fireEvent.change(await screen.findByTestId('probe-draft'), { target: { value: 'Note on B' } });
  await act(async () => fireEvent.click(screen.getByTestId('probe-save')));
  expect(route.saveComment).toHaveBeenCalledWith(expect.objectContaining({ elementId: `cmt:${uuid}`, text: 'Edited B' }), 'Note on B', false, [], undefined);
  expect(route.writes).toHaveBeenCalledTimes(before);
  expect(route.fetcher.mock.calls.filter(call => String(call[0]).includes('/versions?bootstrap=0')).length).toBeGreaterThan(1);
  expect(window.confirm).not.toHaveBeenCalled();
});
it('R5 read-only retry preserves a draft and remains available after outage without writes', async () => {
  const route = setup(); await prepare(); route.saveB(); await acknowledge('Edited B');
  await selectLegacy({ elementId: `cmt:${uuid}`, selector: `[data-od-comment-id="${uuid}"]`, text: 'Edited B' });
  const input = await screen.findByTestId('probe-draft');
  fireEvent.change(input, { target: { value: 'Keep my new draft' } });
  fireEvent.click(screen.getByTestId('comment-identity-revalidate'));
  expect(input).toHaveValue('Keep my new draft');
  expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('COMMENT_EDITING_UNSETTLED');
  fireEvent.change(input, { target: { value: '' } }); // Explicitly settle, never discard via retry.
  route.setProofUnavailable(true);
  fireEvent.click(screen.getByTestId('comment-identity-revalidate'));
  await waitFor(() => expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('COMMENT_PREPARATION_PROOF_UNAVAILABLE'));
  expect(screen.getByTestId('comment-identity-revalidate')).toBeEnabled();
  expect(screen.getByTestId('comment-panel-toggle')).toHaveAttribute('aria-pressed', 'false');
  route.setProofUnavailable(false);
  fireEvent.click(screen.getByTestId('comment-identity-revalidate'));
  await waitFor(() => expect(screen.queryByTestId('comment-identity-revalidate')).toBeNull());
  expect(route.writes.mock.calls).toEqual([[expect.stringContaining('/comment-identities/prepare')]]);
});
it('R5 late old A acknowledgment cannot release freshly revalidated B before its own frame witness', async () => {
  const route = setup(); await prepare();
  await waitFor(() => expect((screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement).srcdoc).toContain(uuid));
  const oldFrame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  const post = vi.spyOn(oldFrame.contentWindow!, 'postMessage');
  act(() => fireEvent.load(oldFrame));
  const oldProbe = post.mock.calls.map(call => call[0]).filter(data => data?.type === 'od:srcdoc-transport-ready-probe').at(-1);
  expect(oldProbe?.probeId).toBeTruthy();
  route.saveB();
  await waitFor(() => expect((screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement).srcdoc).toContain('Edited B'));
  fireEvent.click(screen.getByTestId('comment-identity-revalidate'));
  await waitFor(() => expect(screen.getByTestId('comment-identity-revalidate')).toBeEnabled());
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  await act(async () => {
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:srcdoc-transport-activated', generation: oldProbe.generation, probeId: oldProbe.probeId, bodyComplete: true } }));
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:comment-targets', targets: [] } }));
  });
  expect(screen.getByTestId('comment-identity-revalidate')).toBeEnabled();
  expect(screen.getByTestId('comment-panel-toggle')).toHaveAttribute('aria-pressed', 'false');
  await acknowledge('Edited B');
  await waitFor(() => expect(screen.queryByTestId('comment-identity-revalidate')).toBeNull());
  expect(route.writes).toHaveBeenCalledOnce();
});
it('R6 immutable Resume remains live-only during a pending read-only retry without a current-source witness', async () => {
  const route = setup({ prior: true, currentPrepared: true, activePublication: true, stoppedPublication: true });
  await screen.findByTestId('comment-identity-revalidate');
  route.holdProof();
  fireEvent.click(screen.getByTestId('comment-identity-revalidate'));
  await waitFor(() => expect(screen.getByTestId('comment-identity-revalidate')).toBeDisabled());
  expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('Loading');
  expect(screen.getByTestId('comment-identity-preparation')).not.toHaveTextContent('Saving comment identities');
  fireEvent.click(await screen.findByRole('button', { name: /^share$/i }));
  const access = await screen.findByRole('switch', { name: /link access/i });
  await waitFor(() => expect(access).toHaveAttribute('aria-checked', 'false'));
  await act(async () => fireEvent.click(access));
  expect(route.writes.mock.calls.filter(call => String(call[0]).endsWith('/publish-public'))).toHaveLength(1);
  expect(route.fetcher.mock.calls.some(([, init]) => init?.body === JSON.stringify({ mode: 'resume' }))).toBe(true);
  await act(async () => route.releaseProof());
});
it.each(['pending', 'comment-draft', 'manual-edit', 'ready'] as const)('R6 supported static Update from current %s render respects pending/settled policy', async state => {
  const route = setup({ activePublication: true, prior: true, currentPrepared: true });
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Prepare static comments · save source version' })).toBeNull());
  // This control appears only after the real initial proof has installed its
  // pending transition; a GET start is not proof completion.
  await screen.findByTestId('comment-identity-revalidate');
  if (state !== 'pending') {
    fireEvent.click(screen.getByTestId('comment-panel-toggle'));
    await acknowledge();
    fireEvent.click(screen.getByTestId('comment-panel-toggle'));
    expect(screen.getByTestId('comment-panel-toggle')).toHaveAttribute('aria-pressed', 'true');
  }
  if (state === 'comment-draft') {
    await selectLegacy();
    fireEvent.change(await screen.findByTestId('probe-draft'), { target: { value: 'Already unsettled before Update' } });
  }
  if (state === 'manual-edit') {
    fireEvent.click(screen.getByTestId('manual-edit-mode-toggle'));
    await waitFor(() => expect(screen.getByTestId('manual-edit-mode-toggle')).toHaveAttribute('aria-pressed', 'true'));
  }
  fireEvent.click(await screen.findByRole('button', { name: /^share$/i }));
  const update = await screen.findByRole('button', { name: /update link/i });
  await waitFor(() => expect(update).toBeEnabled());
  await act(async () => fireEvent.click(update));
  expect(route.writes.mock.calls.filter(call => String(call[0]).endsWith('/publish-public'))).toHaveLength(state === 'ready' ? 1 : 0);
  if (state === 'comment-draft') expect(screen.getByTestId('probe-draft')).toHaveValue('Already unsettled before Update');
  if (state === 'manual-edit') expect(screen.getByTestId('manual-edit-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
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
  const dialog = await screen.findByRole('alertdialog');
  expect(window.confirm).not.toHaveBeenCalled();
  await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' })));
});
it('explicit Generate retry removes a stale publication alert only after the reopened source has its frame witness', async () => {
  const route = setup({ prior: true, currentPrepared: true });
  await screen.findByTestId('comment-identity-revalidate');
  fireEvent.click(await screen.findByRole('button', { name: /^share$/i }));
  const generate = await screen.findByRole('menuitem', { name: 'Generate and copy link' });
  await waitFor(() => expect(generate).toBeEnabled());
  await act(async () => fireEvent.click(generate));
  expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('COMMENT_PREVIEW_NOT_READY');
  expect(route.writes).not.toHaveBeenCalled();
  await acknowledge();
  await waitFor(() => expect(screen.queryByTestId('comment-identity-revalidate')).toBeNull());
  expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('COMMENT_PREVIEW_NOT_READY');
  await waitFor(() => expect(generate).toBeEnabled());
  await act(async () => fireEvent.click(generate));
  // Mock endpoint receipt only: no real S3, provider, or A1–E3 acceptance claim.
  await waitFor(() => expect(route.writes.mock.calls.filter(call => String(call[0]).endsWith('/publish-public'))).toHaveLength(1));
  expect(screen.getByTestId('comment-identity-preparation')).not.toHaveTextContent('COMMENT_PREVIEW_NOT_READY');
  expect(screen.queryByRole('alert')).toBeNull();
});
