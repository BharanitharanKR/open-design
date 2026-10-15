import { afterEach, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { CollabCloudComment } from '@open-design/contracts';
import {
  closeDatabase, getProjectPreviewComment, insertConversation, insertProject,
  mergeSyncedPreviewComment, openDatabase, updatePreviewCommentStatus,
} from '../src/db.js';
import { previewCommentToCloud } from '../src/collab/collab-cloud-service.js';

let tempDir: string | undefined;
afterEach(() => {
  closeDatabase();
  if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  tempDir = undefined;
  vi.useRealTimers();
});

it.each([57 * 60_000, 2 * 3_600_000])(
  '3888: keeps the same remote id/creation epoch through backfill, incremental edit and disk restart (%i ms old)', age => {
    vi.useFakeTimers();
    // The explicit offset is parsed once into epoch milliseconds; no timezone/unit conversion on merge.
    const receivedAt = Date.parse('2026-10-14T12:00:00+08:00');
    vi.setSystemTime(receivedAt);
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'od-comment-age-'));
    let db = openDatabase(tempDir);
    insertProject(db, { id: 'p1', name: 'Fixture', createdAt: 1, updatedAt: 1 });
    insertConversation(db, { id: 'conv-local', projectId: 'p1', title: 'Fixture', createdAt: 1, updatedAt: 1 });
    const remote: CollabCloudComment = {
      id: 'share-comment', projectId: 'p1', conversationId: 'conv-remote', memberId: '', seq: 3,
      note: 'Share feedback', filePath: 'index.html', elementId: 'hero', selector: '#hero',
      label: 'Hero', text: 'Hero', htmlHint: '<h1>', position: { x: 1, y: 2, width: 3, height: 4 },
      status: 'open', createdAt: receivedAt - age, updatedAt: receivedAt - age, authorKind: 'user',
      authorAppUserId: 'synthetic-account', authorDisplayName: 'Visitor',
    };
    // Share-page creates on the wire can omit updatedAt despite the typed DTO.
    Reflect.deleteProperty(remote, 'updatedAt');
    const read = () => getProjectPreviewComment(db, 'p1', remote.id)!;
    const merge = (event: CollabCloudComment) => mergeSyncedPreviewComment(db, 'p1', 'conv-local', event);
    expect(merge(remote)).toBe('changed');
    expect(read()).toMatchObject({
      id: remote.id, createdAt: remote.createdAt, updatedAt: remote.createdAt,
      conversationId: 'conv-local', filePath: remote.filePath, note: remote.note,
      position: remote.position, authorKind: remote.authorKind,
      authorAppUserId: remote.authorAppUserId, authorDisplayName: remote.authorDisplayName, pinSeq: 3,
    });
    expect(Date.now() - read().createdAt).toBe(age);
    // A legitimate incremental revision changes activity, not creation age or mapping/order.
    const edited = { ...remote, seq: 5, note: 'Edited feedback', updatedAt: receivedAt };
    expect(merge(edited)).toBe('changed');
    expect(read()).toMatchObject({ createdAt: remote.createdAt, updatedAt: receivedAt, pinSeq: 3, sortKey: remote.createdAt });
    updatePreviewCommentStatus(db, 'p1', 'conv-local', remote.id, 'resolved');
    closeDatabase();
    vi.setSystemTime(receivedAt + 3_600_000);
    db = openDatabase(tempDir);
    const persisted = read();
    for (let replay = 0; replay < 3; replay += 1) {
      expect(merge(remote)).toBe('unchanged');
      expect(merge(edited)).toBe('unchanged');
      expect(read()).toEqual(persisted);
    }
    expect(Date.now() - read().createdAt).toBe(age + 3_600_000);
    expect(previewCommentToCloud(read(), '').createdAt).toBe(remote.createdAt);
  },
);
