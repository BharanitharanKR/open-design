import { parse, type DefaultTreeAdapterMap } from 'parse5';
import { Parser } from 'htmlparser2';
import { isCommentUuid, type ProjectFileVersionResponse, type ProjectFileVersionsResponse, type WorkspaceCollabContext } from '@open-design/contracts';
import { artifactVersionContentDigest } from '../artifacts/version-origin';
import { workspaceProjectHeaders } from '../collab/workspace-identity';

type Node = DefaultTreeAdapterMap['node'];
const excluded = new Set(['html', 'body', 'head', 'script', 'style', 'template', 'title', 'meta', 'link', 'base', 'noscript']);
const rawText = new Set(['script', 'style', 'title', 'textarea', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript', 'plaintext']);

/** Pure authored-source inspection, never a DOM/UUID mutator. Validate both real
 * parsed nodes and authored tokens (including discarded/merged start tags).
 * Script/text occurrences cannot manufacture a preparation witness.
 */
export function sourceHasValidCommentIdentities(source: string): boolean {
  const nodes: Node[] = [];
  function visit(node: Node) {
    nodes.push(node);
    if ('childNodes' in node) for (const child of node.childNodes) visit(child);
    if ('content' in node) visit(node.content);
  }
  visit(parse(source, { sourceCodeLocationInfo: true }));
  const ids = new Set<string>();
  let eligible = false;
  for (const node of nodes) {
    if (!('attrs' in node)) continue;
    let ancestor: Node | undefined = node;
    let inBody = false;
    let inert = excluded.has(node.tagName);
    while (ancestor && 'parentNode' in ancestor && ancestor.parentNode) {
      ancestor = ancestor.parentNode;
      if ('tagName' in ancestor) {
        if (ancestor.tagName === 'body') inBody = true;
        else if (excluded.has(ancestor.tagName) && ancestor.tagName !== 'html') inert = true;
      }
    }
    const authoredTarget = inBody && !inert && Boolean(node.sourceCodeLocation?.startTag);
    if (authoredTarget && !node.attrs.some(attr => attr.name === 'data-od-comment-id')) return false;
    for (const attr of node.attrs) {
      if (attr.name !== 'data-od-comment-id') continue;
      if (!isCommentUuid(attr.value) || ids.has(attr.value)) return false;
      ids.add(attr.value);
      if (authoredTarget) eligible = true;
    }
  }
  if (!eligible) return false;
  // Mask parser-witnessed raw text before secondary tokenization, preserving offsets.
  const ranges = nodes.flatMap(node => {
    if (node.nodeName !== '#text' || !('parentNode' in node) || !node.parentNode || !('tagName' in node.parentNode)
      || !rawText.has(node.parentNode.tagName) || !node.sourceCodeLocation) return [];
    return [node.sourceCodeLocation];
  }).sort((a, b) => a.startOffset - b.startOffset);
  let cursor = 0;
  const chunks: string[] = [];
  for (const range of ranges) {
    if (range.endOffset <= cursor) continue;
    const start = Math.max(cursor, range.startOffset);
    chunks.push(source.slice(cursor, start), source.slice(start, range.endOffset).replace(/[^\r\n]/g, ' '));
    cursor = range.endOffset;
  }
  chunks.push(source.slice(cursor));
  const authoredIds = new Set<string>();
  let repeated = false;
  let valid = true;
  const parser = new Parser({
    onopentagname() { repeated = false; },
    onattribute(name, value) {
      if (name !== 'data-od-comment-id') return;
      if (repeated || !isCommentUuid(value) || authoredIds.has(value)) valid = false;
      repeated = true;
      authoredIds.add(value);
    },
  }, { xmlMode: false, decodeEntities: true });
  parser.end(chunks.join(''));
  return valid;
}

export interface SourcePreparationProof { prior: boolean; current: boolean; source: string }

/** Authenticated READ-ONLY history proof. No comment claims, labels, baseline
 * creation, guessed identity repair or source saves participate in this read.
 */
export async function readSourcePreparationProof(projectId: string, fileName: string, context: WorkspaceCollabContext, isCurrent: () => boolean, transport: typeof fetch = fetch): Promise<SourcePreparationProof> {
  const url = `/api/projects/${encodeURIComponent(projectId)}/files/${fileName.split('/').map(encodeURIComponent).join('/')}`;
  const init = { headers: workspaceProjectHeaders(context), cache: 'no-store' as const };
  const check = () => { if (!isCurrent()) throw new Error('COMMENT_PREPARATION_STALE'); };
  const decoder = new TextDecoder('utf-8', { ignoreBOM: true });
  const raw = await transport(url, init);
  if (!raw.ok) throw new Error('COMMENT_PREPARATION_PROOF_UNAVAILABLE');
  const source = decoder.decode(await raw.arrayBuffer());
  check();
  const response = await transport(`${url}/versions?bootstrap=0`, init);
  if (!response.ok) throw new Error('COMMENT_PREPARATION_PROOF_UNAVAILABLE');
  const history = await response.json() as ProjectFileVersionsResponse;
  if (!Array.isArray(history.versions)) throw new Error('COMMENT_PREPARATION_PROOF_UNAVAILABLE');
  let prior = false;
  let current = false;
  // The newest verified prepared snapshot is enough to establish this fact;
  // do not download/parse every historical HTML document on each reopen.
  for (const version of [...history.versions].sort((a, b) => b.version - a.version)) {
    check();
    if (version.fileName !== fileName || typeof version.id !== 'string' || !/^[a-f0-9]{64}$/.test(version.contentDigest ?? '')) throw new Error('COMMENT_PREPARATION_PROOF_UNCONFIRMED');
    const stored = await transport(`${url}/versions/${encodeURIComponent(version.id)}`, init);
    if (!stored.ok) throw new Error('COMMENT_PREPARATION_PROOF_UNAVAILABLE');
    const snapshot = await stored.json() as ProjectFileVersionResponse;
    if (snapshot.version.id !== version.id || snapshot.version.fileName !== fileName || snapshot.version.contentDigest !== version.contentDigest
      || typeof snapshot.content !== 'string' || await artifactVersionContentDigest(snapshot.content) !== version.contentDigest) throw new Error('COMMENT_PREPARATION_PROOF_UNCONFIRMED');
    check();
    if (sourceHasValidCommentIdentities(snapshot.content)) {
      prior = true;
      if (snapshot.content === source) current = true;
      break;
    }
  }
  const readback = await transport(url, init);
  if (!readback.ok || decoder.decode(await readback.arrayBuffer()) !== source) throw new Error('COMMENT_SOURCE_CONFLICT');
  check();
  return { prior, current, source };
}
