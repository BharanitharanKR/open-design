import { describe, expect, it, vi } from 'vitest';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { prepareCommentSource } from '../../src/comments/preparation';
const context = { workspaceId: 'workspace', workspaceMemberId: 'owner', permissions: { canWriteSyncedFiles: true } } as WorkspaceCollabContext;
const attempt = { projectId: 'project', fileName: 'folder/a b.html', context, authorized: true, settled: true, revision: 1 };
const source = '<h2>Authored UTF-8 原文</h2>\n';
const result = { source: '<h2 data-od-comment-id="12345678-1234-4234-8234-123456789abc">Authored UTF-8 原文</h2>\n', changed: true, preparedTargets: 1, version: { id: 'local-version', version: 2 } };
describe('explicit client authored-byte preparation seam', () => {
  it('uses only authenticated raw authored bytes, confirms saved readback; never publishes or comments', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(source)).mockResolvedValueOnce(Response.json(result)).mockResolvedValueOnce(new Response(result.source));
    expect(await prepareCommentSource(attempt, () => true, fetcher)).toEqual(result);
    expect(fetcher.mock.calls.map(c => c[0])).toEqual(['/api/projects/project/files/folder/a%20b.html', '/api/projects/project/files/folder/a%20b.html/comment-identities/prepare', '/api/projects/project/files/folder/a%20b.html']);
    expect(JSON.parse(String(fetcher.mock.calls[1]?.[1]?.body))).toEqual({ expectedSource: source, editingSettled: true });
    expect(fetcher.mock.calls[1]?.[1]?.headers).toMatchObject({ 'x-od-workspace-id': 'workspace', 'x-od-workspace-member-id': 'owner' });
  });
  it('preserves authored UTF-8 BOM and CRLF in exact expectation and readback', async () => {
    const authored = '\uFEFF<h2>Target</h2>\r\n';
    const saved = { ...result, source: '\uFEFF' + result.source.replace(/\n/g, '\r\n') };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(authored)).mockResolvedValueOnce(Response.json(saved)).mockResolvedValueOnce(new Response(saved.source));
    expect(await prepareCommentSource(attempt, () => true, fetcher)).toEqual(saved);
    expect(JSON.parse(String(fetcher.mock.calls[1]?.[1]?.body)).expectedSource).toBe(authored);
  });
  it.each([{ authorized: false }, { context: null }, { settled: false }])('permission/draft/generation gate invokes nothing: %j', async override => {
    const fetcher = vi.fn<typeof fetch>();
    await expect(prepareCommentSource({ ...attempt, ...override }, () => true, fetcher)).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('new draft or file/source change while reading prevents POST', async () => {
    let current = true;
    const fetcher = vi.fn<typeof fetch>().mockImplementationOnce(async () => { current = false; return new Response(source); });
    await expect(prepareCommentSource(attempt, () => current, fetcher)).rejects.toMatchObject({ code: 'COMMENT_PREPARATION_STALE' });
    expect(fetcher).toHaveBeenCalledOnce();
  });
  it('late saved response is not applied, rolled back, submitted or published', async () => {
    let current = true;
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(source)).mockImplementationOnce(async () => { current = false; return Response.json(result); });
    await expect(prepareCommentSource(attempt, () => current, fetcher)).rejects.toMatchObject({ code: 'COMMENT_PREPARATION_STALE' });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('newer persisted edit after POST rejects old completion without rollback', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(source)).mockResolvedValueOnce(Response.json(result)).mockResolvedValueOnce(new Response('<h2>Newer edit</h2>'));
    await expect(prepareCommentSource(attempt, () => true, fetcher)).rejects.toMatchObject({ code: 'COMMENT_SOURCE_CONFLICT' });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it.each(['COMMENT_SOURCE_CONFLICT','COMMENT_VERSION_UNCONFIRMED','WORKSPACE_PROJECT_PERMISSION_DENIED'])('preserves partial-save error %s and requires explicit retry', async code => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(source)).mockResolvedValueOnce(Response.json({ error: { code, message: 'not confirmed' } }, { status: 409 }));
    await expect(prepareCommentSource(attempt, () => true, fetcher)).rejects.toMatchObject({ code });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
