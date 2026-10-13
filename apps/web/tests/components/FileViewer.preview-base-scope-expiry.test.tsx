// @vitest-environment jsdom
//
// Regression: the srcDoc preview base is a SHORT-LIVED capability, but the
// viewer treats it as permanent.
//
// `GET /api/projects/:id/preview-url` mints an in-memory preview scope that
// expires after PROJECT_PREVIEW_SCOPE_TTL_MS (1 hour) and dies outright when
// the daemon restarts. FileViewer injects the minted directory as the srcdoc
// `<base href>`, so EVERY relative asset in the artifact (`./assets/qr.png`,
// component chunks, media) resolves through that scope.
//
// The mint is cached under `srcDocPreviewBaseIdentity`, which is only
// `authorizationScopeKey + projectId + fileName` — no time component — and the
// minting effect early-returns while a cached base exists. So once the scope
// expires the viewer keeps stamping the dead base into every subsequent
// srcdoc rebuild, and the preview comes back with its images and components
// broken while the HTML body itself renders fine.
//
// The user-visible shape: leave a preview open past the TTL (or restart the
// app), let the agent write a new revision, and every relative-path image
// 404s while inline `data:` images still render.

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildWorkspacePermissions,
  buildWorkspaceSeatSummary,
  type WorkspaceCollabContext,
} from '@open-design/contracts';
import {
  CollabProvider,
  type CollabContextValue,
} from '../../src/collab/collab-context';
import { FileViewer } from '../../src/components/FileViewer';
import type { ProjectFile } from '../../src/types';

const START_TIME = new Date('2026-08-20T10:00:00Z').getTime();
// Daemon-side PROJECT_PREVIEW_SCOPE_TTL_MS (apps/daemon/src/services/project-preview-scopes.ts).
const PREVIEW_SCOPE_TTL_MS = 60 * 60 * 1000;
const PREVIEW_SCOPE_RENEW_MARGIN_MS = 5 * 60 * 1000;

function teamWorkspaceContext(): WorkspaceCollabContext {
  return {
    workspaceId: 'ws-1',
    workspaceType: 'team',
    teamId: 'team-1',
    workspaceMemberId: 'wm-1',
    role: 'member',
    memberStatus: 'active',
    lifecycleState: 'active',
    billingState: 'active',
    planId: null,
    providerMode: 'platform_credits',
    seatSummary: buildWorkspaceSeatSummary({ seatLimit: 5, usedSeats: 1 }),
    permissions: buildWorkspacePermissions({ role: 'member', lifecycleState: 'active' }),
  };
}

function renderTeamViewer(ui: ReactElement) {
  const workspaceContext = teamWorkspaceContext();
  const value: CollabContextValue = {
    workspaceContext,
    workspaceContextLoading: false,
    enabled: false,
    member: null,
    present: [],
    publishedVersion: null,
    syncState: null,
    viewerOnly: false,
    writerAuthority: 'allowed',
    isOwner: false,
    isEffectiveOwner: false,
    isSharedNonOwner: false,
    ownerDisplayName: null,
    ownerRole: null,
    downloadPending: false,
    reportChange: () => {},
    requestPublish: () => {},
    refreshPresence: () => {},
    checkStatusNow: () => {},
  };
  return render(<CollabProvider value={value}>{ui}</CollabProvider>);
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(START_TIME);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function deckFile(overrides: Partial<ProjectFile> = {}): ProjectFile {
  return {
    name: 'deck.html',
    path: 'deck.html',
    type: 'file',
    size: 1024,
    mtime: 1710000000,
    kind: 'html',
    mime: 'text/html',
    artifactManifest: {
      version: 1,
      kind: 'deck',
      title: 'Deck',
      entry: 'deck.html',
      renderer: 'deck-html',
      exports: ['html'],
    },
    ...overrides,
  };
}

function htmlFile(overrides: Partial<ProjectFile> = {}): ProjectFile {
  return {
    name: 'deck.html',
    path: 'deck.html',
    type: 'file',
    size: 1024,
    mtime: 1710000000,
    kind: 'html',
    mime: 'text/html',
    artifactManifest: {
      version: 1,
      kind: 'html',
      title: 'Page',
      entry: 'deck.html',
      renderer: 'html',
      exports: ['html'],
    },
    ...overrides,
  };
}

const DECK_RAW_URL = '/api/projects/project-1/raw/deck.html';
const PREVIEW_URL_ROUTE = '/api/projects/project-1/preview-url';

// A deck slide that references a project asset by relative path — the exact
// shape that depends on the minted base resolving.
function deckHtml(label: string): string {
  return `<html><body><section class="slide">`
    + `<h1>${label}</h1><img src="./assets/qr.png" alt="qr">`
    + `</section><section class="slide"><p>two</p></section></body></html>`;
}

/**
 * Fetch stub that mints a fresh scope id per `/preview-url` call, so the test
 * can tell a re-mint (scope-2) apart from a reused stale base (scope-1).
 */
function stubFetch(html: () => string) {
  const state = { mintCount: 0, renewCount: 0, failRenewal: false };
  vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
    const url = typeof input === 'string'
      ? input
      : input instanceof Request ? input.url : String(input);
    if (url.startsWith(PREVIEW_URL_ROUTE)) {
      state.mintCount += 1;
      return new Response(
        JSON.stringify({
          url: `/api/projects/project-1/preview/scope-000${state.mintCount}/deck.html`,
          file: 'deck.html',
          documentMode: new URL(url, 'http://localhost').searchParams.get('documentMode') ?? 'resource',
          csp: '',
          iframeSandbox: 'allow-scripts allow-forms',
          opaqueOrigin: true,
          expiresAt: Date.now() + PREVIEW_SCOPE_TTL_MS,
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    }
    if (/\/preview\/scope-\d+\/renew$/u.test(url)) {
      state.renewCount += 1;
      if (state.failRenewal) return new Response('', { status: 404 });
      return new Response(
        JSON.stringify({ expiresAt: Date.now() + PREVIEW_SCOPE_TTL_MS }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    }
    if (url.startsWith(DECK_RAW_URL)) return new Response(html(), { status: 200 });
    return new Response('', { status: 404 });
  }));
  return state;
}

function srcDocBaseHref(): string | null {
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  return (frame.getAttribute('srcDoc') ?? '').match(/<base href="([^"]*)"/i)?.[1] ?? null;
}

function verifySrcDocTransport(frame: HTMLIFrameElement) {
  const generation = frame.srcdoc.match(
    /data-od-srcdoc-transport-activation>[\s\S]*?var generation = "([^"]+)";/,
  )?.[1];
  expect(generation).toBeTruthy();
  const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage');
  fireEvent.load(frame);
  const probe = postMessage.mock.calls.find(
    ([message]) => (message as { type?: unknown }).type === 'od:srcdoc-transport-ready-probe',
  )?.[0] as { probeId?: string } | undefined;
  expect(probe?.probeId).toBeTruthy();
  act(() => {
    window.dispatchEvent(new MessageEvent('message', {
      source: frame.contentWindow,
      data: {
        type: 'od:srcdoc-transport-activated',
        generation,
        probeId: probe!.probeId,
        bodyComplete: true,
      },
    }));
  });
  postMessage.mockClear();
  return postMessage;
}

describe('FileViewer srcDoc preview base expiry', () => {
  it('renews the active scope without changing the iframe node or srcdoc bytes', async () => {
    let body = deckHtml('version-one');
    const fetchState = stubFetch(() => body);

    renderTeamViewer(
      <FileViewer projectId="project-1" projectKind="prototype" file={deckFile()} isDeck />,
    );

    await waitFor(() => {
      expect(srcDocBaseHref()).toBe('http://localhost:3000/api/projects/project-1/preview/scope-0001/');
    });
    expect(fetchState.mintCount).toBe(1);
    const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
    const initialSrcDoc = frame.getAttribute('srcDoc');
    const postMessage = verifySrcDocTransport(frame);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        PREVIEW_SCOPE_TTL_MS - PREVIEW_SCOPE_RENEW_MARGIN_MS,
      );
    });

    expect(fetchState.renewCount).toBe(1);
    expect(fetchState.mintCount).toBe(1);
    expect(screen.getByTestId('artifact-preview-frame')).toBe(frame);
    expect(frame.getAttribute('srcDoc')).toBe(initialSrcDoc);
    expect(postMessage.mock.calls.some(([message]) => (
      (message as { type?: unknown }).type === 'od:preview-base-update'
    ))).toBe(false);
  });

  it('renews the daemon-injected URL-load scope without navigating the iframe', async () => {
    const fetchState = stubFetch(() => '<html><body><main>URL loaded</main></body></html>');

    renderTeamViewer(
      <FileViewer
        projectId="project-1"
        projectKind="prototype"
        file={htmlFile()}
        liveHtml="<html><body><main>URL loaded</main></body></html>"
      />,
    );

    const frame = await waitFor(() => {
      const current = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
      expect(current.getAttribute('data-od-render-mode')).toBe('url-load');
      return current;
    });
    const initialSrc = frame.getAttribute('src');
    fireEvent.load(frame);
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        source: frame.contentWindow,
        data: {
          type: 'od:preview-base-scope',
          href: '/api/projects/project-1/preview/scope-0999/',
          expiresAt: Date.now() + PREVIEW_SCOPE_TTL_MS,
        },
      }));
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        PREVIEW_SCOPE_TTL_MS - PREVIEW_SCOPE_RENEW_MARGIN_MS,
      );
    });

    expect(fetchState.renewCount).toBe(1);
    expect(fetchState.mintCount).toBe(0);
    expect(screen.getByTestId('artifact-preview-frame')).toBe(frame);
    expect(frame.getAttribute('src')).toBe(initialSrc);
  });

  it('replaces a lost URL-load scope by messaging the live document', async () => {
    const fetchState = stubFetch(() => '<html><body><main>URL loaded</main></body></html>');

    renderTeamViewer(
      <FileViewer
        projectId="project-1"
        projectKind="prototype"
        file={htmlFile()}
        liveHtml="<html><body><main>URL loaded</main></body></html>"
      />,
    );

    const frame = await waitFor(() => {
      const current = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
      expect(current.getAttribute('data-od-render-mode')).toBe('url-load');
      return current;
    });
    const initialSrc = frame.getAttribute('src');
    fireEvent.load(frame);
    const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage');
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        source: frame.contentWindow,
        data: {
          type: 'od:preview-base-scope',
          href: '/api/projects/project-1/preview/scope-0999/',
          expiresAt: Date.now() + PREVIEW_SCOPE_TTL_MS,
        },
      }));
    });
    fetchState.failRenewal = true;

    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        PREVIEW_SCOPE_TTL_MS - PREVIEW_SCOPE_RENEW_MARGIN_MS,
      );
    });

    expect(fetchState.renewCount).toBe(1);
    expect(fetchState.mintCount).toBe(1);
    expect(screen.getByTestId('artifact-preview-frame')).toBe(frame);
    expect(frame.getAttribute('src')).toBe(initialSrc);
    expect(postMessage.mock.calls.some(([message]) => {
      const data = message as { type?: unknown; href?: unknown };
      return data.type === 'od:preview-base-update'
        && data.href === 'http://localhost:3000/api/projects/project-1/preview/scope-0001/';
    })).toBe(true);
  });

  it('replaces a lost daemon scope in place and uses it on the next natural rebuild', async () => {
    let body = deckHtml('version-one');
    const fetchState = stubFetch(() => body);

    renderTeamViewer(
      <FileViewer projectId="project-1" projectKind="prototype" file={deckFile()} isDeck />,
    );

    await waitFor(() => {
      expect(srcDocBaseHref()).toBe('http://localhost:3000/api/projects/project-1/preview/scope-0001/');
    });
    const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
    const initialSrcDoc = frame.getAttribute('srcDoc');
    const postMessage = verifySrcDocTransport(frame);
    fetchState.failRenewal = true;

    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        PREVIEW_SCOPE_TTL_MS - PREVIEW_SCOPE_RENEW_MARGIN_MS,
      );
    });

    expect(fetchState.renewCount).toBe(1);
    expect(fetchState.mintCount).toBe(2);
    expect(screen.getByTestId('artifact-preview-frame')).toBe(frame);
    expect(frame.getAttribute('srcDoc')).toBe(initialSrcDoc);
    expect(postMessage.mock.calls.some(([message]) => {
      const data = message as { type?: unknown; href?: unknown };
      return data.type === 'od:preview-base-update'
        && data.href === 'http://localhost:3000/api/projects/project-1/preview/scope-0002/';
    })).toBe(true);

    body = deckHtml('version-two');
    fireEvent.click(screen.getByRole('button', { name: /reload preview/i }));
    await waitFor(() => {
      expect(srcDocBaseHref()).toBe('http://localhost:3000/api/projects/project-1/preview/scope-0002/');
      expect(
        (screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement)
          .getAttribute('srcDoc'),
      ).toContain('version-two');
    });
  });
});

it('renders a storage-only deck despite an initial preview scope failure', async () => {
  const html = '<!doctype html><html><body><section class="slide"><h1>Startup available</h1></section><script>localStorage.setItem("ready", "1");</script></body></html>';
  stubFetch(() => html);
  const delegate = globalThis.fetch;
  let mintCalls = 0;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input).startsWith(PREVIEW_URL_ROUTE) && ++mintCalls === 1) {
      return new Response('', { status: 503 });
    }
    return delegate(input, init);
  }));
  renderTeamViewer(<FileViewer projectId="project-1" projectKind="prototype" file={deckFile()} isDeck />);
  await waitFor(() => expect(mintCalls).toBe(1));
  const initialFrame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  // Accept content already rendered; otherwise allow the scope retry budget to elapse.
  if (!initialFrame.srcdoc.includes('Startup available')) {
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });
  }
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  expect(frame.srcdoc).toContain('Startup available');
});


it('retries initial native scope acquisition and activates the complete document', async () => {
  const html = '<!doctype html><html><body><h1>Recovered</h1><script>if (!location.hash) location.replace("#/home")</script></body></html>';
  stubFetch(() => html);
  const delegate = globalThis.fetch;
  let attempts = 0;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input).startsWith(PREVIEW_URL_ROUTE) && ++attempts === 1) return new Response('', { status: 503 });
    return delegate(input, init);
  }));
  renderTeamViewer(<FileViewer projectId="project-1" projectKind="prototype" file={deckFile()} isDeck />);
  await waitFor(() => expect(attempts).toBe(1));
  await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
  await act(async () => { await vi.advanceTimersByTimeAsync(15_000); });
  await waitFor(() => expect(attempts).toBe(2));
  const frame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  expect(frame.src).toContain('/preview/scope-0001/deck.html');
  expect(frame.hasAttribute('srcdoc')).toBe(false);
  const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage');
  await act(async () => {
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: { type: 'od:srcdoc-transport-ready' } }));
  });
  const activation = postMessage.mock.calls.map(([message]) => message as { type?: string; html?: string })
    .find(message => message.type === 'od:srcdoc-transport-activate');
  expect(activation?.html).toContain('<h1 data-od-id=');
  expect(activation?.html).toContain('Recovered');
  expect(new DOMParser().parseFromString(activation?.html ?? '', 'text/html').querySelector('base')).toBeNull();
  expect(screen.queryByRole('alert')).toBeNull();
});

it.each(['Code', 'file tab'] as const)('retains and updates the native document across %s switches', async (surface) => {
  const source = (label: string) => `<!doctype html><html><body><h1>${label}</h1><script>localStorage.getItem("preview"); if (!location.hash) location.replace("#/home")</script></body></html>`;
  let currentHtml = source('Version 1');
  const fetchState = stubFetch(() => currentHtml);
  const viewer = (active: boolean, version: number) => (
    <FileViewer projectId="project-1" projectKind="prototype"
      file={htmlFile({ mtime: version })} liveHtml={source(`Version ${version}`)} workspaceActive={active} />
  );
  const { rerender } = render(viewer(true, 1));
  const frame = await waitFor(() => {
    const current = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
    expect(current.getAttribute('data-od-render-mode')).toBe('srcdoc');
    expect(current.src).toContain('/preview/scope-0001/deck.html');
    return current;
  });
  const originalUrl = frame.src;
  const announceReady = () => window.dispatchEvent(new MessageEvent('message', {
    source: frame.contentWindow, data: { type: 'od:srcdoc-transport-ready' },
  }));
  const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage').mockImplementation((message) => {
    // The persistent bootstrap echoes shell probes even after document.write.
    if (message.type === 'od:srcdoc-transport-shell-probe') queueMicrotask(announceReady);
  });
  await act(async () => {
    fireEvent.load(frame);
    announceReady();
  });
  const activations = () => postMessage.mock.calls
    .map(([message]) => message as { type?: string; html?: string; generation?: string })
    .filter(message => message.type === 'od:srcdoc-transport-activate');
  await waitFor(() => expect(activations().at(-1)?.html).toContain('Version 1'));

  if (surface === 'Code') fireEvent.click(screen.getByRole('tab', { name: 'Code' }));
  else rerender(viewer(false, 1));
  expect(frame.isConnected).toBe(true);
  expect(frame).toHaveAttribute('aria-hidden', 'true');
  currentHtml = source('Version 2');
  rerender(viewer(surface === 'Code', 2));
  await act(async () => { await Promise.resolve(); });
  await waitFor(() => expect(activations().at(-1)?.html).toContain('Version 2'));
  expect(activations().at(-1)?.html).not.toContain('Version 1');
  const activationCount = activations().length;

  if (surface === 'Code') fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
  else rerender(viewer(true, 2));
  expect(screen.getByTestId('artifact-preview-frame')).toBe(frame);
  expect(frame.src).toBe(originalUrl);
  expect(frame.hasAttribute('srcdoc')).toBe(false);
  expect(activations()).toHaveLength(activationCount);
  expect(fetchState.mintCount).toBe(1);

  // Verify the latest generation so a stale witness cannot trigger a delayed
  // recovery after the viewer becomes active again.
  fireEvent.load(frame);
  const probe = postMessage.mock.calls.map(([message]) => message as {
    type?: string; generation?: string; probeId?: string;
  }).filter(message => message.type === 'od:srcdoc-transport-ready-probe').at(-1);
  expect(probe?.generation).toBe(activations().at(-1)?.generation);
  expect(probe?.probeId).toBeTruthy();
  act(() => window.dispatchEvent(new MessageEvent('message', {
    source: frame.contentWindow,
    data: { ...probe, type: 'od:srcdoc-transport-activated', bodyComplete: true },
  })));
  await act(async () => { await vi.advanceTimersByTimeAsync(2_000); });
  expect(screen.getByTestId('artifact-preview-frame')).toBe(frame);
});

it('cancels a pending native scope retry when the viewer unmounts', async () => {
  stubFetch(() => '<!doctype html><html><body><script>location.replace("#/home")</script></body></html>');
  const delegate = globalThis.fetch;
  let attempts = 0;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input).startsWith(PREVIEW_URL_ROUTE)) { attempts++; return new Response('', { status: 503 }); }
    return delegate(input, init);
  }));
  const { unmount } = renderTeamViewer(<FileViewer projectId="project-1" projectKind="prototype" file={deckFile()} isDeck />);
  await waitFor(() => expect(attempts).toBe(1));
  unmount();
  await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });
  expect(attempts).toBe(1);
});


it('recovers a native carrier on a replacement scope while preserving its hash', async () => {
  const fetchState = stubFetch(() => '<!doctype html><html><body><h1>Recovery snapshot</h1><script>if (!location.hash) location.replace("#/home")</script></body></html>');
  renderTeamViewer(<FileViewer projectId="project-1" projectKind="prototype" file={deckFile()} isDeck />);
  const frame = await waitFor(() => {
    const current = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
    expect(current.src).toContain('/preview/scope-0001/deck.html');
    return current;
  });
  const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage');
  act(() => window.dispatchEvent(new MessageEvent('message', {
    source: frame.contentWindow,
    data: { type: 'od:preview-base-scope', documentUrl: frame.src + '#/details' },
  })));
  fetchState.failRenewal = true;
  await act(async () => { await vi.advanceTimersByTimeAsync(PREVIEW_SCOPE_TTL_MS - PREVIEW_SCOPE_RENEW_MARGIN_MS); });
  const recoveredFrame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  expect(recoveredFrame.src).toContain('/preview/scope-0002/deck.html#/details');
  const recoveredPostMessage = vi.spyOn(recoveredFrame.contentWindow!, 'postMessage');
  act(() => window.dispatchEvent(new MessageEvent('message', {
    source: recoveredFrame.contentWindow, data: { type: 'od:srcdoc-transport-ready' },
  })));
  expect(recoveredPostMessage.mock.calls.some(([message]) => message.type === 'od:srcdoc-transport-activate' && message.html.includes('Recovery snapshot'))).toBe(true);
  expect(postMessage.mock.calls.some(([message]) => message.type === 'od:preview-base-update')).toBe(false);
});

it('replaces Electron\'s prewarmed Blob frame when the native carrier becomes available', async () => {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Chrome/140 Electron/38');
  const BrowserURL = URL;
  vi.stubGlobal('URL', class extends BrowserURL {
    static createObjectURL() { return 'blob:http://localhost:3000/warm-bootstrap'; }
  });
  stubFetch(() => '<!doctype html><html><body><h1>Native ready</h1><script>if (!location.hash) location.replace("#/home")</script></body></html>');
  const delegate = globalThis.fetch;
  let release!: () => void;
  const pendingScope = new Promise<void>(resolve => { release = resolve; });
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input).startsWith(PREVIEW_URL_ROUTE)) await pendingScope;
    return delegate(input, init);
  }));
  renderTeamViewer(<FileViewer projectId="project-1" projectKind="prototype" file={deckFile()} isDeck />);
  const warmFrame = await waitFor(() => screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement);
  expect(warmFrame.src).toContain('blob:');
  act(() => window.dispatchEvent(new MessageEvent('message', {
    source: warmFrame.contentWindow, data: { type: 'od:srcdoc-transport-ready' },
  })));
  await act(async () => { release(); });
  const nativeFrame = screen.getByTestId('artifact-preview-frame') as HTMLIFrameElement;
  expect(nativeFrame.src).toContain('/preview/scope-0001/deck.html');
  expect(nativeFrame).not.toBe(warmFrame);
  const postMessage = vi.spyOn(nativeFrame.contentWindow!, 'postMessage');
  act(() => window.dispatchEvent(new MessageEvent('message', {
    source: nativeFrame.contentWindow, data: { type: 'od:srcdoc-transport-ready' },
  })));
  expect(postMessage.mock.calls.some(([message]) => message.type === 'od:srcdoc-transport-activate' && message.html.includes('Native ready'))).toBe(true);
});
