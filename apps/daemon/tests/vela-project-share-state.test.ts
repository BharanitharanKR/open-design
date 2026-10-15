import { describe, expect, it, vi } from 'vitest';
import { tmpdir } from 'node:os';
import { createVelaProjectShareState, parseProjectShareState } from '../src/collab/vela-project-share-state.js';
const slug = '93a3c7e6-198d-4b72-9f70-0bbfdf9f9c55';
it.each(['active', 'stopped'] as const)('preserves authoritative %s history', status => {
  expect(parseProjectShareState(JSON.stringify({ projectId: 'p', bindingExists: true, publications: [{ sourceFilePath: 'pages/local.html', slug, status }] }), 'p'))
    .toEqual({ projectId: 'p', bindingExists: true, hasEverShared: true, publications: [{ sourceFilePath: 'pages/local.html', slug, status }] });
});
it('accepts only an explicit successful empty history', () => {
  expect(parseProjectShareState('{"projectId":"p","bindingExists":false,"publications":[]}', 'p').hasEverShared).toBe(false);
});
it.each([{ error: 'NOT_FOUND' }, { projectId: 'other', bindingExists: false, publications: [] }, { projectId: 'p', bindingExists: true, publications: [] }, { projectId: 'p', bindingExists: false, publications: [{ sourceFilePath: 'index.html', slug, status: 'active' }] }])('refuses malformed/error history %j', value => {
  expect(() => parseProjectShareState(JSON.stringify(value), 'p')).toThrow();
});
describe.each(['personal', 'team'] as const)('%s local creator', workspaceType => {
  it.each(['none', 'active', 'stopped'] as const)('reads %s history through content-free registration without replacing an existing root', async status => {
    const session = { profile: 'test' as const, apiUrl: 'https://example.test', controlKey: 'synthetic', user: null, configMtimeMs: null };
    let registered = false;
    const runCommand = vi.fn(async (input: { args: string[] }) => {
      if (input.args[0] === 'team-projects') {
        if (input.args[1] !== 'ensure-private') throw new Error('legacy root identity must not replace the retained root');
        registered = true;
        return JSON.stringify({ projectId: 'p', workspaceId: 'w', ownerMemberId: 'o', resourceId: 'retained-opaque-root', visibility: workspaceType === 'team' && status !== 'none' ? 'team' : 'private', createdAt: '2026-10-15T00:00:00Z' });
      }
      if (!registered) throw new Error('404 owner catalog missing');
      return JSON.stringify({ projectId: 'p', bindingExists: status !== 'none', publications: status === 'none' ? [] : [{ sourceFilePath: 'pages/local.html', slug, status }] });
    });
    const options = { dataRoot: tmpdir(), readSession: () => session,
      resolveLocalProjectOwner: () => 'o',
      fetchDirectory: async () => ({ ok: true as const, items: [{ workspaceId: 'w', workspaceName: 'W', workspaceType, workspaceMemberId: 'o', role: 'owner' as const, memberStatus: 'active' as const, lifecycleState: 'active' as const }] }), runCommand };
    const state = await createVelaProjectShareState(options)({ projectId: 'p', resourceTeamId: 'w', ownerMemberId: 'o' });
    expect(state.hasEverShared).toBe(status !== 'none');
    expect(state.publications.map(item => item.status)).toEqual(status === 'none' ? [] : [status]);
    expect(runCommand.mock.calls.map(([input]) => input.args)).toEqual([['team-projects', 'ensure-private', 'p'], ['share', 'project-status', 'p', '--json']]);
    const registration = runCommand.mock.calls[0]![0].args;
    expect(registration).not.toContain('--sync-state');
    expect(registration).not.toContain('--metadata-json');
  });
});

it.each(['personal', 'team'] as const)('keeps read-only %s status registration-free even for a proven creator', async workspaceType => {
  const runCommand = vi.fn(async () => { throw new Error('404 missing owner catalog'); });
  const read = createVelaProjectShareState({ dataRoot: tmpdir(), registerLocallyOwnedProject: false,
    readSession: () => ({ profile: 'test', apiUrl: 'https://example.test', controlKey: 'synthetic', user: null, configMtimeMs: null }),
    resolveLocalProjectOwner: () => 'o',
    fetchDirectory: async () => ({ ok: true, items: [{ workspaceId: 'w', workspaceName: 'W', workspaceType, workspaceMemberId: 'o', role: 'owner', memberStatus: 'active', lifecycleState: 'active' }] }), runCommand });
  await expect(read({ projectId: 'p', resourceTeamId: 'w', ownerMemberId: 'o' })).rejects.toThrow();
  expect(runCommand.mock.calls).toHaveLength(1);
  expect(runCommand).toHaveBeenCalledWith(expect.objectContaining({ args: ['share', 'project-status', 'p', '--json'] }));
});

it.each(['unknown-owner', 'other-owner', 'other-workspace', 'team', 'ensure-failed'] as const)('never invents an empty history or claims an unrelated project: %s', async mode => {
  const runCommand = vi.fn(async () => { throw new Error('unavailable'); });
  const read = createVelaProjectShareState({ dataRoot: tmpdir(),
    readSession: () => ({ profile: 'test', apiUrl: 'https://example.test', controlKey: 'synthetic', user: null, configMtimeMs: null }),
    resolveLocalProjectOwner: (_project, workspace) => { expect(workspace).toBe('w'); return mode === 'unknown-owner' ? null : mode === 'other-owner' || mode === 'team' ? 'other' : 'o'; },
    fetchDirectory: async () => ({ ok: true, items: [{ workspaceId: mode === 'other-workspace' ? 'other' : 'w', workspaceName: 'W', workspaceType: mode === 'team' ? 'team' : 'personal', workspaceMemberId: 'o', role: 'owner', memberStatus: 'active', lifecycleState: 'active' }] }), runCommand });
  await expect(read({ projectId: 'p', resourceTeamId: 'w', ownerMemberId: 'o' })).rejects.toThrow();
  if (mode === 'other-workspace') expect(runCommand).not.toHaveBeenCalled();
  else {
    expect(runCommand).toHaveBeenCalledTimes(1);
    expect(runCommand).toHaveBeenCalledWith(expect.objectContaining({ args: expect.arrayContaining(mode === 'ensure-failed' ? ['team-projects', 'ensure-private'] : ['share', 'project-status']) }));
  }
});

it('runs the real command shape under a captured session', async () => {
  const session = { profile: 'test' as const, apiUrl: 'https://example.test', controlKey: 'synthetic', user: null, configMtimeMs: null };
  const runCommand = vi.fn().mockResolvedValue('{"projectId":"p","bindingExists":false,"publications":[]}');
  const read = createVelaProjectShareState({ dataRoot: tmpdir(), readSession: () => session,
    fetchDirectory: async () => { session.controlKey = 'changed'; return { ok: true, items: [{ workspaceId: 'w', workspaceName: 'W', workspaceType: 'personal', workspaceMemberId: 'o', role: 'member', memberStatus: 'active', lifecycleState: 'active' }] }; }, runCommand });
  expect((await read({ projectId: 'p', resourceTeamId: 'w', ownerMemberId: 'o' })).bindingExists).toBe(false);
  expect(runCommand).toHaveBeenCalledWith(expect.objectContaining({ workspaceId: 'w', session: expect.objectContaining({ controlKey: 'synthetic' }), args: ['share', 'project-status', 'p', '--json'] }));
  runCommand.mockRejectedValue(new Error('404'));
  await expect(read({ projectId: 'p', resourceTeamId: 'w', ownerMemberId: 'o' })).rejects.toThrow();
});
