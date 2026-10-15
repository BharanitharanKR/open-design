import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import type { WorkspaceCollabContext } from '@open-design/contracts';
import { readSourcePreparationProof, sourceHasValidCommentIdentities } from '../../src/comments/source-preparation-proof';
const uuid = '12345678-1234-4234-8234-123456789abc';
const second = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const source = `<html><body><h2 data-od-comment-id="${uuid}">Target</h2></body></html>`;
const context = { workspaceId: 'ws', workspaceMemberId: 'owner', permissions: { canShareProjects: true, canWriteSyncedFiles: true } } as WorkspaceCollabContext;
const digest = (text: string) => createHash('sha256').update(text).digest('hex');
function fixture(current = source, content = source, override: Record<string, unknown> = {}) {
  const version = { id: 'saved-source', fileName: 'index.html', contentDigest: digest(content), version: 2, ...override };
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async input => {
    const url = String(input);
    if (url.endsWith('/versions?bootstrap=0')) return Response.json({ versions: [version] });
    if (url.endsWith('/versions/saved-source')) return Response.json({ version, content });
    return new Response(current);
  });
  return fetcher;
}
describe('real authored source/version proof, never comment claims', () => {
  it('requires complete valid authored targets, not just one ID in a partially prepared file', () => {
    expect(sourceHasValidCommentIdentities(source)).toBe(true);
    expect(sourceHasValidCommentIdentities(source.replace('</body>', '<p>Unprepared</p></body>'))).toBe(false);
  });
  it.each([
    `<script>var text='<h2 data-od-comment-id="${uuid}">fake</h2>'</script>`,
    `&lt;h2 data-od-comment-id="${uuid}"&gt;Fake prose`,
    `<h2 data-od-comment-id="bad">Bad</h2>`,
    `<h2 data-od-comment-id="${uuid}" data-od-comment-id="${second}">Repeated attribute</h2>`,
    `<h2 data-od-comment-id="${uuid}">One</h2><p data-od-comment-id="${uuid}">Duplicate</p>`,
    source + '<body data-od-comment-id="bad">',
    `<body data-od-comment-id="${uuid}">Root only</body>`,
  ])('rejects fake/malformed/duplicate history content: %s', value => {
    expect(sourceHasValidCommentIdentities(value)).toBe(false);
  });
  it('ignores fake raw-text tags only when real authored targets actually carry IDs', () => {
    expect(sourceHasValidCommentIdentities(source.replace('</body>', '<script>var text=\'<p data-od-comment-id="bad">fake</p>\'</script></body>'))).toBe(true);
    expect(sourceHasValidCommentIdentities(source.replace('</body>', `<iframe data-od-comment-id="${second}"><p data-od-comment-id="bad">raw text</p></iframe></body>`))).toBe(true);
  });
  it('verifies actual source/version/digest and uses only authenticated read-only calls', async () => {
    const fetcher = fixture();
    expect(await readSourcePreparationProof('p', 'index.html', context, () => true, fetcher)).toEqual({ prior: true, current: true, source });
    expect(fetcher.mock.calls.map(call => call[0])).toContain('/api/projects/p/files/index.html/versions?bootstrap=0');
    for (const [, init] of fetcher.mock.calls) {
      expect(init?.method).toBeUndefined();
      expect(init?.headers).toMatchObject({ 'x-od-workspace-id': 'ws', 'x-od-workspace-member-id': 'owner' });
    }
  });
  it('actual prior prepared history does not claim current IDs after deliberate loss or invoke backfill', async () => {
    const lost = '<html><body><h2>Same text, no identity</h2></body></html>';
    expect(await readSourcePreparationProof('p', 'index.html', context, () => true, fixture(lost))).toEqual({ prior: true, current: false, source: lost });
  });
  it.each([{ contentDigest: 'a'.repeat(64) }, { fileName: 'other.html' }])('rejects tampered digest/file proof %j', async override => {
    await expect(readSourcePreparationProof('p', 'index.html', context, () => true, fixture(source, source, override))).rejects.toThrow('COMMENT_PREPARATION_PROOF_UNCONFIRMED');
  });
  it('invalid real history is not promoted into prior preparation', async () => {
    const bad = source.replace(uuid, 'bad');
    expect(await readSourcePreparationProof('p', 'index.html', context, () => true, fixture(bad, bad))).toMatchObject({ prior: false, current: false });
  });
  it('outage and stale reads are not success/legacy shortcuts', async () => {
    await expect(readSourcePreparationProof('p', 'index.html', context, () => true, vi.fn().mockResolvedValue(new Response('', { status: 503 })))).rejects.toThrow('COMMENT_PREPARATION_PROOF_UNAVAILABLE');
    await expect(readSourcePreparationProof('p', 'index.html', context, () => false, fixture())).rejects.toThrow('COMMENT_PREPARATION_STALE');
  });
});
