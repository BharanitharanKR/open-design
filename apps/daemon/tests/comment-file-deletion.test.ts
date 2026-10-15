import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import type { CommentFileMutation, CommentFileState } from '@open-design/contracts';
import { closeDatabase, openDatabase, insertProject, ensureWorkspaceProject, updateProject, getProject } from '../src/db.js';
import { ensureWorkspaceArtifactForPath, getWorkspaceArtifact } from '../src/chat-artifacts/store.js';
import { createCommentFileDeletion } from '../src/collab/comment-file-deletion.js';
import { createLocalCommentFiles } from '../src/collab/local-comment-files.js';
import { createProjectPublicFileStop } from '../src/collab/project-public-file-stop.js';
import { createSqlitePublicFilePublicationStore } from '../src/collab/public-file-publication-store.js';

let root: string | undefined;
afterEach(() => { closeDatabase(); if (root) fs.rmSync(root, { recursive: true, force: true }); });
function fixture() {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'od-comment-delete-'));
  const db = openDatabase(root, { dataDir: root });
  insertProject(db, { id: 'p', name: 'P', createdAt: 1, updatedAt: 1 });
  ensureWorkspaceProject(db, { projectId: 'p', workspaceId: 'w', visibility: 'personal', createdByWorkspaceMemberId: 'creator', resourceHubResourceId: 'root' });
  const facts = ['pages/a.html', 'pages/b.html', 'outside.html'].map((filePath, index) => ({
    sourceFileId: ensureWorkspaceArtifactForPath(db, { projectId: 'p', path: filePath, kind: 'html' }).id,
    sourceFilePath: filePath, entryPath: 'index.html', resourceId: `selected-${index}`, versionId: 'v1', retired: false,
  }));
  let remote: CommentFileState = { schemaVersion: 1, revision: 1, files: facts };
  const initial = structuredClone(remote);
  updateProject(db, 'p', { metadata: { unrelated: 'keep', _commentFiles: remote } });
  let failSecondRetirement = false;
  const requests: CommentFileMutation[] = [];
  const run = vi.fn(async (args: string[]) => {
    if (args[1] === 'upsert') {
      const mutation = JSON.parse(args[6] ?? '')._commentFiles as CommentFileMutation;
      requests.push(mutation);
      if (failSecondRetirement && mutation.files.some(file => file.sourceFileId === facts[1]?.sourceFileId)) throw new Error('second receipt unavailable');
      expect(mutation.baseRevision).toBe(remote.revision);
      const replacements = new Map(mutation.files.map(file => {
        const { receipt, ...entry } = file;
        return [file.sourceFileId, { ...entry, resourceId: receipt?.resourceId ?? mutation.resourceId, versionId: receipt?.versionId ?? mutation.versionId }];
      }));
      remote = { schemaVersion: 1, revision: remote.revision + 1, files: remote.files.map(file => replacements.get(file.sourceFileId) ?? file) };
    }
    return JSON.stringify({ projectId: 'p', workspaceId: 'w', ownerMemberId: 'creator', resourceId: 'root', metadata: { _commentFiles: remote } });
  });
  const publications = createSqlitePublicFilePublicationStore(db);
  for (const fact of facts) publications.set({ projectId: 'p', resourceTeamId: 'w', ownerMemberId: 'creator', filePath: fact.sourceFilePath },
    { slug: fact.sourceFileId, url: null, fileName: fact.sourceFilePath });
  let failStop = false;
  const stop = vi.fn(async () => { if (failStop) throw new Error('stop unavailable'); });
  const beforeDelete = createCommentFileDeletion({ db, localFiles: createLocalCommentFiles(db),
    hasActiveRun: () => false, runForWorkspace: () => run,
    stopPublicFiles: createProjectPublicFileStop(publications, async () => ({ resourceTeamId: 'w', ownerMemberId: 'creator', stop })) });
  return { db, facts, initial, requests, run, stop, publications, beforeDelete, remote: () => remote,
    failRetirement: (value: boolean) => { failSecondRetirement = value; }, failStop: () => { failStop = true; } };
}

it('a failed public stop preserves the original active lifetimes and stop witnesses before any retirement', async () => {
  const f = fixture();
  f.failStop();
  await expect(f.beforeDelete('p', { folderPath: 'pages' })).rejects.toThrow('PUBLIC_FILE_STOP_PENDING');
  expect(f.remote()).toEqual(f.initial);
  expect(f.requests).toHaveLength(0);
  expect(getProject(f.db, 'p')?.metadata?._commentFiles).toEqual(f.initial);
  expect(f.publications.listStops()).toHaveLength(2);
  for (const fact of f.facts) expect(getWorkspaceArtifact(f.db, fact.sourceFileId)?.deletedAt).toBeNull();
});

it('a failed second file authority cannot partially retire a folder; a normal retry retires all in one CAS', async () => {
  const f = fixture();
  f.failRetirement(true);
  await expect(f.beforeDelete('p', { folderPath: 'pages' })).rejects.toThrow('second receipt unavailable');
  expect.soft(f.remote()).toEqual(f.initial);
  expect.soft(getProject(f.db, 'p')?.metadata?._commentFiles).toEqual(f.initial);
  for (const fact of f.facts) expect.soft(getWorkspaceArtifact(f.db, fact.sourceFileId)?.deletedAt).toBeNull();
  f.failRetirement(false);
  await f.beforeDelete('p', { folderPath: 'pages' });
  expect(f.requests).toHaveLength(2); // one failed whole batch, then one successful batch
  expect(f.requests.every(request => request.files.length === 2)).toBe(true);
  expect(f.remote().files).toEqual(f.facts.map((fact, index) => ({ ...fact, retired: index < 2 })));
  expect(getProject(f.db, 'p')?.metadata?._commentFiles).toEqual(f.remote());
  expect(getProject(f.db, 'p')?.metadata?.unrelated).toBe('keep');
  for (const fact of f.facts.slice(0, 2)) expect(getWorkspaceArtifact(f.db, fact.sourceFileId)?.deletedAt).not.toBeNull();
  const outside = f.facts[2];
  if (!outside) throw new Error('missing outside fact');
  expect(getWorkspaceArtifact(f.db, outside.sourceFileId)?.deletedAt).toBeNull();
  expect(f.publications.listByProject({ projectId: 'p', resourceTeamId: 'w', ownerMemberId: 'creator' }).map(file => file.filePath)).toEqual(['outside.html']);
});
