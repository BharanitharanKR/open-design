import { expect, it, vi } from 'vitest';

const privateText = 'credential-secret https://private.invalid/path /private/source user-content';
import { ensurePublicShareProject, publicShareProjectBootstrapDiagnostic } from '../src/collab/public-share-project-bootstrap.js';
import { logPublicShareDiagnostic, safeVelaCommandError } from '../src/collab/public-file-failure.js';
import type { ResourceHubPrincipal } from '../src/collab/resource-principal.js';
import { projectResourceIdFor } from '../src/integrations/vela-team-projects.js';
const principal: ResourceHubPrincipal = { teamId: 'workspace', memberId: 'author', role: 'owner', lifecycleState: 'active', workspaceType: 'personal' };
it('registers independent root before positive catalog verification, without a file publish', async () => {
  const run = vi.fn(async (args: string[]) => JSON.stringify(args[0] === 'resource'
    ? { id: 'root-version', version: 1 }
    : { projectId: 'p', ownerMemberId: 'author', createdAt: new Date(1).toISOString(), publishedVersionId: 'root-version' }));
  const result = await ensurePublicShareProject({ projectId: 'p', principal, run, resolveProjectDir: () => '/local-project', describeProject: () => ({ name: 'Local project', metadata: {} }) });
  expect(result).toMatchObject({ projectId: 'p', ownerMemberId: 'author' });
  expect(run.mock.calls.map(([args]) => args.slice(0, 2))).toEqual([['resource', 'push'], ['team-projects', 'upsert'], ['team-projects', 'get']]);
  const rootId = projectResourceIdFor('p', principal);
  expect(run.mock.calls[0]![0].slice(0, 5)).toEqual(['resource', 'push', 'project', rootId, '/local-project']);
  expect(run.mock.calls[1]![0]).toEqual(expect.arrayContaining(['--resource-id', rootId, '--last-synced-version-id', 'root-version']));
});
it.each([null, { metadata: { sharedProjectPlaceholderAt: 1 } }])('rejects absent/placeholder content before any cloud mutation: %j', async metadata => {
  const run = vi.fn(async () => '{}');
  await expect(ensurePublicShareProject({ projectId: 'p', principal, run, resolveProjectDir: () => '/local-project', describeProject: () => metadata })).rejects.toThrow('PUBLIC_SHARE_PROJECT_CONTENT_UNAVAILABLE');
  expect(run).not.toHaveBeenCalled();
});
it('does not register a catalog when the root upload fails', async () => {
  const run = vi.fn(async () => { throw new Error('upload unavailable'); });
  await expect(ensurePublicShareProject({ projectId: 'p', principal, run, resolveProjectDir: () => '/local-project', describeProject: () => ({ metadata: {} }) })).rejects.toThrow();
  expect(run).toHaveBeenCalledTimes(1);
});
it('requires a readable positive catalog after upload/upsert', async () => {
  const run = vi.fn(async (args: string[]) => JSON.stringify(args[0] === 'resource' ? { id: 'root-version', version: 1 } : {}));
  await expect(ensurePublicShareProject({ projectId: 'p', principal, run, resolveProjectDir: () => '/local-project', describeProject: () => ({ metadata: {} }) })).rejects.toThrow('PUBLIC_SHARE_PROJECT_CATALOG_UNAVAILABLE');
});

it.each([
  ['content', 'bootstrap_content_preflight', 'local_file', 0],
  ['directory', 'bootstrap_directory_preflight', 'local_file', 0],
  ['metadata', 'bootstrap_content_preflight', 'local_file', 0],
  ['push', 'bootstrap_root_push', 'object_store', 1],
  ['empty', 'bootstrap_root_version', 'empty_response', 1],
  ['invalid-json', 'bootstrap_root_version', 'invalid_receipt', 1],
  ['missing-id', 'bootstrap_root_version', 'invalid_receipt', 1],
  ['upsert', 'bootstrap_catalog_upsert', 'upstream_http', 2],
  ['readback', 'bootstrap_catalog_readback', 'timeout', 3],
  ['readback-json', 'bootstrap_catalog_readback', 'invalid_receipt', 3],
  ['unreadable', 'bootstrap_catalog_readback', 'invalid_receipt', 3],
] as const)('%s emits only exact closed bootstrap stage/reason, with unchanged command cutoff', async (fault, stage, reason, commands) => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const rejected = (stderr: string) => Object.assign(new Error(privateText), { stderr, stdout: privateText, args: [privateText], env: { SECRET: privateText }, cause: privateText });
  const run = vi.fn(async (args: string[]) => {
    if (args[0] === 'resource') {
      if (fault === 'push') throw safeVelaCommandError('VELA_PINNED_COMMAND_FAILED', rejected(`upload blob to object store ${privateText}`));
      if (fault === 'empty') return '';
      if (fault === 'invalid-json') return privateText;
      if (fault === 'missing-id') return JSON.stringify({ version: 1, content: privateText });
      return JSON.stringify({ id: 'root-version', version: 1 });
    }
    if (args[1] === 'upsert' && fault === 'upsert') {
      // Even a token-shaped upstream code is arbitrary data, not a closed enum.
      throw rejected(`API request failed with status 403: credential_secret`);
    }
    if (args[1] === 'get') {
      if (fault === 'readback') throw Object.assign(rejected(privateText), { code: 'ETIMEDOUT' });
      if (fault === 'readback-json') return privateText;
      if (fault === 'unreadable') return JSON.stringify({ projectId: 'p', ownerMemberId: 'author', syncState: 'pending_upload', publishedVersionId: null, content: privateText });
      return JSON.stringify({ projectId: 'p', ownerMemberId: 'author', publishedVersionId: 'root-version' });
    }
    return '{}';
  });
  let descriptions = 0;
  try {
    let caught: unknown;
    try {
      await ensurePublicShareProject({ projectId: 'private-project-id', principal, run,
        resolveProjectDir: () => {
          if (fault === 'directory') throw Object.assign(new Error(privateText), { code: 'ENOENT' });
          return '/private/source';
        },
        describeProject: () => {
          if (fault === 'content' || (fault === 'metadata' && ++descriptions === 2)) throw new Error(privateText);
          return { name: privateText, metadata: {} };
        },
      });
    } catch (error) { caught = error; }
    expect(caught).toBeInstanceOf(Error);
    const diagnostic = publicShareProjectBootstrapDiagnostic(caught);
    expect(diagnostic).toEqual({ stage, failure: { reason, ...(fault === 'upsert' ? { upstreamStatus: 403 } : {}) } });
    expect(caught).not.toHaveProperty('cause');
    expect(caught).not.toHaveProperty('stderr');
    expect(caught).not.toHaveProperty('stdout');
    logPublicShareDiagnostic({ operation: 'bootstrap', ...diagnostic, status: 503,
      errorCode: 'WORKSPACE_PROJECT_OWNERSHIP_UNAVAILABLE', requestId: undefined, startedAt: Date.now() });
    expect(warn).toHaveBeenCalledExactlyOnceWith('[od] public share diagnostic', expect.any(String));
    expect(JSON.parse(warn.mock.calls[0]![1] as string)).toEqual({
      operation: 'bootstrap', stage, reason, status: 503,
      errorCode: 'WORKSPACE_PROJECT_OWNERSHIP_UNAVAILABLE', durationMs: expect.any(Number),
      ...(fault === 'upsert' ? { upstreamStatus: 403 } : {}),
    });
    const retained = JSON.stringify(caught) + String(caught) + JSON.stringify(warn.mock.calls);
    for (const forbidden of [privateText, 'credential_secret', 'private-project-id', '/private/source', 'upstreamCode', 'stderr', 'stdout']) expect(retained).not.toContain(forbidden);
    expect(run).toHaveBeenCalledTimes(commands);
  } finally { warn.mockRestore(); }
});

it('does not trust arbitrary diagnostic-shaped errors', () => {
  expect(publicShareProjectBootstrapDiagnostic({ stage: privateText, failure: { reason: privateText } }))
    .toEqual({ stage: 'bootstrap', failure: { reason: 'unknown' } });
});
