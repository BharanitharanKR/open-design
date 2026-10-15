import { expect, it, vi } from 'vitest';
import { ensurePublicShareProject } from '../src/collab/public-share-project-bootstrap.js';
import { registerVelaTeamProjectResource } from '../src/collab/vela-cli-team-projects.js';
import type { ResourceHubPrincipal } from '../src/collab/resource-principal.js';
const principal: ResourceHubPrincipal = { teamId: 'workspace', memberId: 'author', role: 'owner', lifecycleState: 'active', workspaceType: 'personal' };
const registration = { workspaceId: 'workspace', projectId: 'p', resourceId: 'server-generated-root', ownerMemberId: 'author', visibility: 'private', createdAt: new Date(1).toISOString(), publishedVersionId: null };
it.each(['private', 'team'])('content-free creator ensure retains server root and existing %s policy without upload', async visibility => {
  const run = vi.fn(async () => JSON.stringify({ ...registration, visibility }));
  const retainRoot = vi.fn();
  const result = await ensurePublicShareProject({ projectId: 'p', principal, run, retainRoot, describeProject: () => ({ name: 'Local project', metadata: { private: 'must not upload' } }) });
  expect(result).toMatchObject({ ...registration, visibility, createdAt: 1, sharedAt: registration.createdAt });
  expect(run.mock.calls).toEqual([[['team-projects', 'ensure-private', 'p']]]);
  expect(retainRoot).toHaveBeenCalledWith({ ...registration, visibility });
});
it.each([null, { metadata: { sharedProjectPlaceholderAt: 1 } }])('rejects absent/placeholder content before any cloud mutation: %j', async metadata => {
  const run = vi.fn(async () => '{}');
  await expect(ensurePublicShareProject({ projectId: 'p', principal, run, describeProject: () => metadata })).rejects.toThrow('PUBLIC_SHARE_PROJECT_CONTENT_UNAVAILABLE');
  expect(run).not.toHaveBeenCalled();
});
it('does not retain a root when ensure fails', async () => {
  const run = vi.fn(async () => { throw new Error('ensure unavailable'); });
  const retainRoot = vi.fn();
  await expect(ensurePublicShareProject({ projectId: 'p', principal, run, retainRoot, describeProject: () => ({ metadata: {} }) })).rejects.toThrow();
  expect(run).toHaveBeenCalledTimes(1);
  expect(retainRoot).not.toHaveBeenCalled();
});
it.each([{}, { ownerMemberId: 'other' }, { workspaceId: 'other' }, { projectId: 'other' }, { resourceId: '' }, { visibility: 'unknown' }, { createdAt: 'invalid' }])('denies malformed/cross-authority registration %j', async patch => {
  const retainRoot = vi.fn();
  const run = vi.fn(async () => JSON.stringify(Object.keys(patch).length ? { ...registration, ...patch } : {}));
  await expect(ensurePublicShareProject({ projectId: 'p', principal, run, retainRoot, describeProject: () => ({ metadata: {} }) })).rejects.toThrow('PUBLIC_SHARE_PROJECT_CATALOG_UNAVAILABLE');
  expect(retainRoot).not.toHaveBeenCalled();
});
it.each(['{}', '{"ok":false}', 'invalid'])('requires association ACK: %s', async reply => {
  const run = vi.fn(async () => reply);
  await expect(registerVelaTeamProjectResource('p', 'selected', run)).rejects.toThrow();
  expect(run).toHaveBeenCalledExactlyOnceWith(['team-projects', 'register-resource', 'p', 'selected']);
});
