// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { buildWorkspacePermissions, buildWorkspaceSeatSummary, type WorkspaceCollabContext } from '@open-design/contracts';
import { FileViewer } from '../../src/components/FileViewer';
import { invalidateHtmlSourceSnapshotProject } from '../../src/components/html-source-snapshot-cache';
import { CollabProvider, type CollabContextValue } from '../../src/collab/collab-context';
const source = '<html><body><h2>Authored target</h2></body></html>';
const context: WorkspaceCollabContext = {
  workspaceId: 'ws', workspaceType: 'team', workspaceMemberId: 'owner', role: 'owner',
  memberStatus: 'active', lifecycleState: 'active', billingState: 'active', planId: null,
  providerMode: 'platform_credits', seatSummary: buildWorkspaceSeatSummary({ seatLimit: 3, usedSeats: 1 }),
  permissions: buildWorkspacePermissions({ role: 'owner', lifecycleState: 'active' }),
};
const collab: CollabContextValue = {
  workspaceContext: context, workspaceContextLoading: false, enabled: false, member: null,
  present: [], publishedVersion: null, syncState: null, viewerOnly: false, writerAuthority: 'allowed',
  isOwner: true, isEffectiveOwner: true, isSharedNonOwner: false, ownerDisplayName: null,
  ownerRole: null, downloadPending: false, reportChange() {}, requestPublish() {}, refreshPresence() {}, checkStatusNow() {},
};
function setup(options: { readonly?: boolean; streaming?: boolean; fail?: boolean; success?: boolean; bom?: boolean } = {}) {
  const writes = vi.fn();
  let serverSource = (options.bom ? '\uFEFF' : '') + source;
  const preparedSource = serverSource.replace('<h2>', '<h2 data-od-comment-id="12345678-1234-4234-8234-123456789abc">');
  const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (init?.method === 'POST' && !url.endsWith('/share-plan')) writes(url, init);
    if (url.includes('comment-identities/prepare')) {
      if (!options.success) return Response.json({ error: { code: 'COMMENT_VERSION_UNCONFIRMED' } }, { status: 500 });
      serverSource = preparedSource;
      return Response.json({ source: preparedSource, changed: true, preparedTargets: 1, version: { id: 'source-version-2', version: 2 } });
    }
    const pathname = new URL(url, 'http://localhost').pathname;
    if (pathname.endsWith('/versions')) return Response.json({ versions: [] });
    if (pathname.endsWith('/raw/index.html') || pathname.endsWith('/files/index.html')) return new Response(serverSource);
    if (url.includes('/integrations/vela/status')) return Response.json({ loggedIn: true, user: { id: 'owner' } });
    return Response.json({});
  });
  vi.stubGlobal('fetch', fetcher);
  const tree = (streaming = Boolean(options.streaming)) => <CollabProvider value={{ ...collab, viewerOnly: Boolean(options.readonly) }}>
    <FileViewer projectId="prep-project" projectKind="prototype" file={{ name: 'index.html', path: 'index.html', type: 'file', kind: 'html', mime: 'text/html', size: 100, mtime: 1 }} streaming={streaming} viewerOnly={Boolean(options.readonly)} />
  </CollabProvider>;
  const view = render(tree());
  return { writes, fetcher, setStreaming: (value: boolean) => view.rerender(tree(value)) };
}
async function saveConsent() {
  fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Save' }));
}
afterEach(() => { cleanup(); invalidateHtmlSourceSnapshotProject('prep-project'); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
it('A1 uses an app confirmation: Cancel/Escape mutate nothing; a later Save performs only preparation', async () => {
  const { writes } = setup({ success: true });
  const native = vi.spyOn(window, 'confirm').mockReturnValue(true);
  const trigger = await screen.findByRole('button', { name: 'Prepare static comments · save source version' });
  await waitFor(() => expect(trigger).toBeEnabled());
  fireEvent.click(trigger);
  const dialog = await screen.findByRole('alertdialog');
  expect(dialog).toHaveTextContent('saves a source version');
  expect(dialog).toHaveTextContent('No comment or publication');
  expect(writes).not.toHaveBeenCalled(); expect(native).not.toHaveBeenCalled();
  await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' })));
  expect(screen.queryByRole('alertdialog')).toBeNull(); expect(writes).not.toHaveBeenCalled();
  fireEvent.click(trigger);
  await screen.findByRole('alertdialog');
  await act(async () => fireEvent.keyDown(document, { key: 'Escape' }));
  expect(screen.queryByRole('alertdialog')).toBeNull(); expect(writes).not.toHaveBeenCalled();
  fireEvent.click(trigger);
  fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(writes).toHaveBeenCalledOnce());
  expect(writes.mock.calls[0]?.[0]).toContain('/comment-identities/prepare');
});
it('explicit source-version preparation entry is discoverable; passive viewing and cancellation invoke no write', async () => {
  const { writes } = setup();
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
  const button = await screen.findByRole('button', { name: 'Prepare static comments · save source version' });
  expect(writes).not.toHaveBeenCalled();
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
  const dialog = await screen.findByRole('alertdialog');
  expect(confirm).not.toHaveBeenCalled();
  expect(dialog).toHaveTextContent('saves a source version');
  await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' })));
  expect(writes).not.toHaveBeenCalled();
});
it('Confirm rejects a live generation change made while the app dialog is open', async () => {
  const { writes, setStreaming } = setup({ success: true });
  const button = await screen.findByRole('button', { name: 'Prepare static comments · save source version' });
  await waitFor(() => expect(button).toBeEnabled()); fireEvent.click(button);
  const dialog = await screen.findByRole('alertdialog');
  setStreaming(true);
  await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Save' })));
  expect(writes).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('COMMENT_PREPARATION_STALE');
});
it('generation gate retains the preview and invokes neither confirmation nor source mutation', async () => {
  const { writes } = setup({ streaming: true });
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
  const button = await screen.findByRole('button', { name: 'Prepare static comments · save source version' });
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
  expect(confirm).not.toHaveBeenCalled();
  expect(writes).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('COMMENT_EDITING_UNSETTLED');
});
it('preparation failure shows a retryable error and never automatically comments or publishes', async () => {
  const { writes } = setup({ fail: true });
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  const button = await screen.findByRole('button', { name: 'Prepare static comments · save source version' });
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
  await saveConsent();
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('COMMENT_VERSION_UNCONFIRMED'));
  expect(writes).toHaveBeenCalledOnce();
  expect(writes.mock.calls[0]?.[0]).toContain('/comment-identities/prepare');
  expect(screen.getByRole('button', { name: 'Prepare static comments · save source version' })).toBeEnabled();
});
it.each([false, true])('source-version save awaits a fresh challenged frame; stale/unready messages cannot claim ready or auto-publish (BOM=%s)', async bom => {
  const { writes } = setup({ success: true, bom });
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  const button = await screen.findByRole('button', { name: 'Prepare static comments · save source version' });
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
  await saveConsent();
  await waitFor(() => expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('Waiting for the matching preview'));
  await waitFor(() => expect((screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement).srcdoc).toContain('12345678-1234-4234-8234-123456789abc'));
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage');
  // This is a frontend protocol regression, not a real browser/publication witness.
  act(() => { fireEvent.load(frame); });
  const probe = postMessage.mock.calls.filter(([message]) => (message as { type?: string }).type === 'od:srcdoc-transport-ready-probe').at(-1)?.[0] as { generation?: string; probeId?: string } | undefined;
  expect(probe?.probeId).toBeTruthy();
  act(() => {
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: {
      type: 'od:srcdoc-transport-activated', generation: 'old-generation', probeId: probe!.probeId, bodyComplete: true,
    } }));
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:comment-targets', targets: [] } }));
  });
  expect(screen.getByTestId('comment-identity-preparation')).not.toHaveTextContent('Preview ready');
  // Real postMessage deliveries are separate tasks. Flush the challenged
  // activation before delivering its target index, rather than batching both
  // synchronously against the pre-activation React state.
  await act(async () => {
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: {
      type: 'od:srcdoc-transport-activated', generation: probe!.generation, probeId: probe!.probeId, bodyComplete: true,
    } }));
  });
  await act(async () => {
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:comment-targets', targets: [] } }));
  });
  await waitFor(() => expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('Preview ready'));
  expect(writes).toHaveBeenCalledOnce();
  expect(writes.mock.calls[0]?.[0]).toContain('/comment-identities/prepare');
});
it('first supported public exposure invokes explicit preparation, never a publication on cancellation or failure', async () => {
  const { writes } = setup({ fail: true });
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Prepare static comments · save source version' })).toBeEnabled());
  fireEvent.click(await screen.findByRole('button', { name: /^share$/i }));
  const generate = await screen.findByRole('menuitem', { name: 'Generate and copy link' });
  await waitFor(() => expect(generate).toBeEnabled());
  fireEvent.click(generate);
  await act(async () => fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Cancel' })));
  expect(confirm).not.toHaveBeenCalled();
  expect(writes).not.toHaveBeenCalled();
  await waitFor(() => expect(generate).toBeEnabled());
  fireEvent.click(generate);
  await saveConsent();
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('COMMENT_VERSION_UNCONFIRMED'));
  expect(writes).toHaveBeenCalledOnce();
  expect(writes.mock.calls[0]?.[0]).toContain('/comment-identities/prepare');
});
it('readonly comment permission never exposes source preparation', async () => {
  const { writes } = setup({ readonly: true });
  await waitFor(() => expect(screen.getByTestId('artifact-preview-frame')).toBeInTheDocument());
  expect(screen.queryByRole('button', { name: 'Prepare static comments · save source version' })).not.toBeInTheDocument();
  expect(screen.getByTestId('comment-identity-preparation')).toHaveTextContent('without a durable cross-version guarantee');
  expect(writes).not.toHaveBeenCalled();
});
