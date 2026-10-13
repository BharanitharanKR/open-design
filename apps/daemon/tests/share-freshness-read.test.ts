import Database from 'better-sqlite3';
import express from 'express';
import { createServer } from 'node:http';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it, vi } from 'vitest';
import { buildWorkspacePermissions, buildWorkspaceSeatSummary, type WorkspaceCollabContext } from '@open-design/contracts';
import { createCollabRuntime } from '../src/collab/runtime.js';
import { registerCollabSyncRoutes } from '../src/routes/collab-sync.js';
import { createSqlitePublicFilePublicationStore, migratePublicFilePublications } from '../src/collab/public-file-publication-store.js';
import { createShareContentFingerprints } from '../src/collab/share-content-fingerprint.js';
import { buildDeployFilePlan } from '../src/deploy.js';
import type { ReadProjectShareState } from '../src/collab/vela-project-share-state.js';

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}
const slug = '93a3c7e6-198d-4b72-9f70-0bbfdf9f9c55';
const context: WorkspaceCollabContext = {
  workspaceId: 'w', workspaceMemberId: 'owner', workspaceType: 'personal', role: 'owner',
  memberStatus: 'active', lifecycleState: 'active', billingState: 'active', planId: null, providerMode: 'platform_credits',
  seatSummary: buildWorkspaceSeatSummary({ seatLimit: 1, usedSeats: 1 }),
  permissions: buildWorkspacePermissions({ role: 'owner', lifecycleState: 'active' }),
};

it('OPEND-3791 starts the cloud state read without waiting for the local resource scan', async () => {
  const root = await mkdtemp(join(tmpdir(), 'od-freshness-read-'));
  const db = new Database(':memory:');
  migratePublicFilePublications(db);
  const publications = createSqlitePublicFilePublicationStore(db);
  const scope = { resourceTeamId: 'w', ownerMemberId: 'owner', projectId: 'p', filePath: 'index.html' };
  const fingerprints = createShareContentFingerprints(db, publications);
  const runtime = createCollabRuntime({ workspaceContext: { current: async () => context } });
  const scanStarted = deferred<void>();
  const scanRoot = deferred<string>();
  const cloudState = deferred<Awaited<ReturnType<ReadProjectShareState>>>();
  const readProjectShareState = vi.fn<ReadProjectShareState>(() => cloudState.promise);
  const app = express();
  registerCollabSyncRoutes(app, {
    collab: runtime, publicFilePublicationStore: publications, shareContentFingerprints: fingerprints,
    verifyWorkspaceRequest: async () => context,
    resolveSharedProject: async () => ({ projectId: 'p', ownerMemberId: 'owner', sharedAt: new Date(1).toISOString() }),
    resolveProjectDir: () => { scanStarted.resolve(); return scanRoot.promise; },
    resolvePublicShareLink: () => ({ url: 'https://viewer.example.test/share' }),
    readProjectShareState,
  });
  const server = createServer(app);
  let request: Promise<Response> | undefined;
  try {
    await writeFile(join(root, 'index.html'), '<link rel="stylesheet" href="style.css"><h1>Original</h1>');
    await writeFile(join(root, 'style.css'), 'body{color:red}');
    publications.set(scope, { slug, fileName: 'index.html', url: 'https://viewer.example.test/share' });
    const revision = publications.getRevision(scope);
    if (!revision) throw new Error('missing publication revision');
    const payload = await buildDeployFilePlan(root, '.', 'index.html', { metadata: { baseDir: root }, hookScriptUrl: '', assetUrlPolicy: 'share-relative' });
    expect(fingerprints.remember(scope, revision, payload.files)).toBe(true);
    await writeFile(join(root, 'style.css'), 'body{color:blue}');
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address(); if (!address || typeof address === 'string') throw new Error('no listener');
    request = fetch(`http://127.0.0.1:${address.port}/api/projects/p/files/index.html/publish-public`);
    await scanStarted.promise;
    // Both I/O branches must start before the first branch's controlled completion.
    expect(readProjectShareState).toHaveBeenCalledExactlyOnceWith(scope);
    cloudState.resolve({ projectId: 'p', bindingExists: true, hasEverShared: true,
      publications: [{ sourceFilePath: 'index.html', slug, status: 'active' }] });
    scanRoot.resolve(root);
    const response = await request;
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: 'active', freshness: 'outdated' });
  } finally {
    scanRoot.resolve(root);
    cloudState.resolve({ projectId: 'p', bindingExists: false, hasEverShared: false, publications: [] });
    await request?.catch(() => undefined);
    server.closeAllConnections();
    if (server.listening) await new Promise<void>(resolve => server.close(() => resolve()));
    runtime.dispose(); db.close(); await rm(root, { recursive: true, force: true });
  }
});

it.each(['membership-revoked', 'share-denied', 'other-owner', 'owner-unavailable'] as const)(
  'OPEND-3791 does not start either read before authorization succeeds: %s', async mode => {
    const runtime = createCollabRuntime({ workspaceContext: { current: async () => context } });
    const readProjectShareState = vi.fn<ReadProjectShareState>();
    const resolveProjectDir = vi.fn(async () => { throw new Error('unauthorized scan'); });
    const app = express();
    registerCollabSyncRoutes(app, {
      collab: runtime,
      verifyWorkspaceRequest: async () => mode === 'membership-revoked'
        ? { ok: false, status: 403, code: 'WORKSPACE_ACCESS_DENIED', message: 'membership revoked' }
        : mode === 'share-denied'
          ? { ...context, permissions: { ...context.permissions, canShareProjects: false } }
          : context,
      resolveSharedProject: async () => {
        if (mode === 'owner-unavailable') throw new Error('synthetic ownership unavailable');
        return { projectId: 'p', ownerMemberId: 'other', sharedAt: new Date(1).toISOString() };
      },
      resolveProjectDir, readProjectShareState,
      // Even with comparison available, denied requests must not reach disk.
      shareContentFingerprints: { compare: () => 'current', remember: () => false, rebind: () => false },
    });
    const server = createServer(app);
    try {
      await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
      const address = server.address(); if (!address || typeof address === 'string') throw new Error('no listener');
      const response = await fetch(`http://127.0.0.1:${address.port}/api/projects/p/files/index.html/publish-public`);
      expect(response.status).toBe(mode === 'owner-unavailable' ? 503 : 403);
      expect(readProjectShareState).not.toHaveBeenCalled();
      expect(resolveProjectDir).not.toHaveBeenCalled();
    } finally {
      server.closeAllConnections();
      if (server.listening) await new Promise<void>(resolve => server.close(() => resolve()));
      runtime.dispose();
    }
  },
);

it.each(['missing-bytes', 'cloud-offline', 'cloud-stopped'] as const)(
  'OPEND-3791 preserves independent visibility and comparison outcomes: %s', async mode => {
    const root = await mkdtemp(join(tmpdir(), 'od-freshness-outcome-'));
    const db = new Database(':memory:');
    migratePublicFilePublications(db);
    const publications = createSqlitePublicFilePublicationStore(db);
    const fingerprints = createShareContentFingerprints(db, publications);
    const scope = { resourceTeamId: 'w', ownerMemberId: 'owner', projectId: 'p', filePath: 'index.html' };
    publications.set(scope, { slug, fileName: 'index.html', url: 'https://viewer.example.test/share' });
    const runtime = createCollabRuntime({ workspaceContext: { current: async () => context } });
    const app = express();
    registerCollabSyncRoutes(app, {
      collab: runtime, publicFilePublicationStore: publications, shareContentFingerprints: fingerprints,
      verifyWorkspaceRequest: async () => context,
      resolveSharedProject: async () => ({ projectId: 'p', ownerMemberId: 'owner', sharedAt: new Date(1).toISOString() }),
      resolveProjectDir: () => root,
      resolvePublicShareLink: () => ({ url: 'https://viewer.example.test/share' }),
      readProjectShareState: async () => {
        if (mode === 'cloud-offline') throw new Error('synthetic offline');
        return { projectId: 'p', bindingExists: true, hasEverShared: true,
          publications: [{ sourceFilePath: 'index.html', slug, status: mode === 'cloud-stopped' ? 'stopped' : 'active' }] };
      },
    });
    const server = createServer(app);
    try {
      if (mode !== 'missing-bytes') {
        await writeFile(join(root, 'index.html'), '<h1>Original</h1>');
        const revision = publications.getRevision(scope);
        if (!revision) throw new Error('missing publication revision');
        const payload = await buildDeployFilePlan(root, '.', 'index.html', { metadata: { baseDir: root }, hookScriptUrl: '', assetUrlPolicy: 'share-relative' });
        expect(fingerprints.remember(scope, revision, payload.files)).toBe(true);
      }
      await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
      const address = server.address(); if (!address || typeof address === 'string') throw new Error('no listener');
      const response = await fetch(`http://127.0.0.1:${address.port}/api/projects/p/files/index.html/publish-public`);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toMatchObject({ status: mode === 'cloud-stopped' ? 'stopped' : 'active',
        freshness: mode === 'missing-bytes' ? 'unknown' : 'current' });
      if (mode === 'cloud-stopped') expect(body).toMatchObject({ publication: null });
      else expect(body).toMatchObject({ publication: { slug, url: 'https://viewer.example.test/share' } });
      if (mode === 'cloud-offline') expect(body).toMatchObject({ stale: true });
    } finally {
      server.closeAllConnections();
      if (server.listening) await new Promise<void>(resolve => server.close(() => resolve()));
      runtime.dispose(); db.close(); await rm(root, { recursive: true, force: true });
    }
  },
);
