import Database from 'better-sqlite3';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { createOwnedContentSync, type OwnedContentSyncDeps } from '../../src/collab/owned-content-sync.js';
import { createSqliteOwnedContentStore, migrateOwnedContentSync, type OwnedContentScope } from '../../src/collab/owned-content-store.js';

const scope: OwnedContentScope = { projectId: 'p1', workspaceId: 'w1', resourceTeamId: 'w1', viewerMemberId: 'owner', ownerMemberId: 'owner' };

function setup() {
  const db = new Database(':memory:');
  migrateOwnedContentSync(db);
  const store = createSqliteOwnedContentStore(db);
  let time = 100_000;
  let head = 4;
  let content = true;
  let fingerprint = 'local';
  let busy = false;
  const apply = vi.fn(async (_scope: OwnedContentScope, version: number) => {
    fingerprint = `remote-${version}`;
    return { version, fingerprint };
  });
  const deps: OwnedContentSyncDeps = {
    store, now: () => time, head: async () => head, hasContent: async () => content,
    isSupported: () => true, isBusy: () => busy, fingerprint: async () => fingerprint,
    apply, publicationScope: () => scope, onChange: vi.fn(),
  };
  return {
    store, deps, apply, controller: createOwnedContentSync(deps),
    clock: (value: number) => { time = value; }, head: (value: number) => { head = value; },
    content: (value: boolean) => { content = value; }, busy: (value: boolean) => { busy = value; },
    edit: (value: string) => { fingerprint = value; }, close: () => db.close(),
  };
}

describe('owner content overwrite authority', () => {
  it('restores cursor and permission from a newly opened SQLite database', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'od-owner-state-'));
    const file = path.join(root, 'state.sqlite');
    try {
      let db = new Database(file);
      migrateOwnedContentSync(db);
      createSqliteOwnedContentStore(db).write(scope, {
        localVersion: 4, latestVersion: 5, ignoredVersion: null,
        autoApplyUntil: 123_456, fingerprint: 'received-content',
      });
      db.close();
      db = new Database(file);
      migrateOwnedContentSync(db);
      const store = createSqliteOwnedContentStore(db);
      expect(store.read(scope)).toMatchObject({ localVersion: 4, latestVersion: 5, autoApplyUntil: 123_456, fingerprint: 'received-content' });
      expect(store.read({ ...scope, viewerMemberId: 'another-account', ownerMemberId: 'another-account' }).autoApplyUntil).toBeNull();
      db.close();
    } finally { await rm(root, { recursive: true, force: true }); }
  });

  it('requires confirmation and refuses a stale head without granting 24h permission', async () => {
    const f = setup();
    try {
      expect((await f.controller.request(scope, { action: 'check' })).state).toBe('confirmation_required');
      f.head(5);
      const stale = await f.controller.request(scope, { action: 'accept', version: 4, dontPromptFor24h: true });
      expect(stale).toMatchObject({ state: 'confirmation_required', latestVersion: 5, autoApplyUntil: null });
      expect(f.apply).not.toHaveBeenCalled();
    } finally { f.close(); }
  });

  it('persists 24h authorization through a controller restart and expires exactly at the boundary', async () => {
    const f = setup();
    try {
      await f.controller.request(scope, { action: 'accept', version: 4, dontPromptFor24h: true });
      const expiry = 100_000 + 86_400_000;
      const restarted = createOwnedContentSync(f.deps);
      f.head(5); f.clock(expiry - 1);
      expect((await restarted.request(scope, { action: 'check' })).localVersion).toBe(5);
      f.head(6); f.clock(expiry);
      expect((await restarted.request(scope, { action: 'check' })).state).toBe('confirmation_required');
      expect(f.apply).toHaveBeenCalledTimes(2);
      expect((await restarted.request({ ...scope, workspaceId: 'w2', resourceTeamId: 'w2' }, { action: 'check' })).state).toBe('confirmation_required');
    } finally { f.close(); }
  });

  it('dismisses only the current version, and a manual check can re-offer it', async () => {
    const f = setup();
    try {
      await f.controller.request(scope, { action: 'dismiss', version: 4 });
      expect((await f.controller.request(scope, { action: 'check' })).state).toBe('ignored');
      expect((await f.controller.request(scope, { action: 'check', manual: true })).state).toBe('confirmation_required');
      expect(f.apply).not.toHaveBeenCalled();
      f.head(5);
      expect((await f.controller.request(scope, { action: 'check' })).latestVersion).toBe(5);
    } finally { f.close(); }
  });

  it('materializes a fresh device without approval, while BUSY and failures never grant preference or cursor', async () => {
    const f = setup();
    try {
      f.content(false);
      expect((await f.controller.request(scope, { action: 'check' })).state).toBe('up_to_date');
      f.content(true); f.head(5); f.busy(true);
      expect((await f.controller.request(scope, { action: 'accept', version: 5, dontPromptFor24h: true })).state).toBe('busy');
      f.busy(false); f.apply.mockRejectedValueOnce(new Error('download failed'));
      expect((await f.controller.request(scope, { action: 'accept', version: 5, dontPromptFor24h: true })).state).toBe('failed');
      expect(f.store.read(scope)).toMatchObject({ localVersion: 4, autoApplyUntil: null });
    } finally { f.close(); }
  });

  it('can propagate a materialization failure after recording the failed state', async () => {
    const f = setup();
    try {
      f.content(false);
      f.apply.mockRejectedValueOnce(new Error('resource_not_found'));
      await expect(
        f.controller.request(scope, { action: 'check' }, undefined, true),
      ).rejects.toThrow('resource_not_found');
      expect(f.controller.read(scope)).toMatchObject({
        state: 'failed',
        errorCode: 'PROJECT_SYNC_FAILED',
      });
    } finally { f.close(); }
  });

  it('coalesces approval while allowing a newer event to offer the next head', async () => {
    const f = setup();
    try {
      let release!: () => void;
      const waiting = new Promise<void>(resolve => { release = resolve; });
      f.apply.mockImplementationOnce(async (_scope, version) => {
        await waiting;
        return { version, fingerprint: 'received' };
      });
      const first = f.controller.request(scope, { action: 'accept', version: 4 });
      await vi.waitFor(() => expect(f.apply).toHaveBeenCalledTimes(1));
      const newer = f.controller.request(scope, { action: 'check' }, 5);
      release();
      await first;
      expect(await newer).toMatchObject({ state: 'confirmation_required', latestVersion: 5, localVersion: 4 });
      expect(f.apply).toHaveBeenCalledTimes(1);
    } finally { f.close(); }
  });

  it('does not treat a successful local publish as a remote overwrite and keeps subsequent edits publishable', async () => {
    const f = setup();
    try {
      await f.controller.withPublication(scope.projectId, null, async () => ({ version: 4 }));
      expect((await f.controller.request(scope, { action: 'check' }, 4)).state).toBe('up_to_date');
      expect(f.apply).not.toHaveBeenCalled();
      expect(await f.controller.shouldPublish(scope.projectId)).toBe(false);
      f.edit('new local edit');
      expect(await f.controller.shouldPublish(scope.projectId)).toBe(true);
    } finally { f.close(); }
  });

  it('does not clear a newer edit made while the upload was in progress', async () => {
    const f = setup();
    try {
      await f.controller.withPublication(scope.projectId, null, async () => {
        f.edit('edited during upload');
        return { version: 4 };
      });
      expect(f.store.read(scope).fingerprint).toBeNull();
      expect(await f.controller.shouldPublish(scope.projectId)).toBe(true);
    } finally { f.close(); }
  });
});
