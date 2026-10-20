// @vitest-environment node
import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import { injectCommentBridge } from '../../src/runtime/comment-bridge';
import { buildSrcdoc } from '../../src/runtime/srcdoc';
import { resolveOwnerCommentAnchor } from '../../src/comments/owner-anchor';
import { indexCommentTargets } from '../../src/comments/target-index';
import type { PreviewComment } from '../../src/types';

const elementId = 'html-id:button:test-button';
const selector = 'button[id="test-button"]';

describe('native HTML comment anchors', () => {
  it.each(['portable', 'srcdoc'])('%s bridge locates a unique ID after a move, but rejects hidden duplicates and replacement tags', kind => {
    const dom = new JSDOM('<body><article><button id="test-button">Same button</button></article></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
    try {
      const win = dom.window;
      Object.defineProperty(win, 'CSS', { value: { escape: (value: string) => value } });
      const postMessage = vi.fn();
      Object.defineProperty(win, 'parent', { value: { postMessage } });
      Object.defineProperty(win.HTMLElement.prototype, 'getBoundingClientRect', { value: () => ({ x: 0, y: 20, width: 100, height: 40 }) });
      Object.defineProperty(win.HTMLElement.prototype, 'scrollIntoView', { value: vi.fn() });
      const html = kind === 'portable' ? injectCommentBridge('<body></body>', true) : buildSrcdoc('<body></body>', { commentBridge: true, inspectBridge: true });
      const script = html.match(kind === 'portable' ? /<script data-od-comment-bridge>([\s\S]*?)<\/script>/ : /<script data-od-selection-bridge>([\s\S]*?)<\/script>/)?.[1];
      if (!script) throw new Error('missing bridge');
      new win.Function(script).call(win);
      win.dispatchEvent(new win.MessageEvent('message', { data: { type: 'od:comment-mode', enabled: true } }));
      const locate = () => {
        postMessage.mockClear();
        win.dispatchEvent(new win.MessageEvent('message', { data: { type: 'od:comment-active-target', elementId, selector, locate: true, requestId: 'native' } }));
        return postMessage.mock.calls.map(call => call[0]);
      };
      expect(locate()).toContainEqual(expect.objectContaining({ type: 'od:comment-active-target-update', elementId, selector }));
      const duplicate = win.document.createElement('div');
      duplicate.id = 'test-button'; duplicate.hidden = true; win.document.body.append(duplicate);
      expect(locate()).toContainEqual(expect.objectContaining({ type: 'od:comment-location-missing' }));
      duplicate.remove();
      win.document.querySelector('button')!.outerHTML = '<div id="test-button">Same button</div>';
      expect(locate()).toContainEqual(expect.objectContaining({ type: 'od:comment-location-missing' }));
    } finally { dom.window.close(); }
  });

  it('owner resolution keeps native identities exact across versions and never guesses by text', () => {
    const target = { filePath: 'index.html', elementId, selector, label: 'button', text: 'Button', htmlHint: '<button>', position: { x: 0, y: 20, width: 100, height: 40 } };
    const comment = { ...target, anchoredVersion: 1, id: 'comment', projectId: 'p', conversationId: 'c', note: 'note', status: 'open', createdAt: 1, updatedAt: 1 } as PreviewComment;
    expect(resolveOwnerCommentAnchor(comment, indexCommentTargets([target]), 2).state).toBe('reanchored');
    expect(resolveOwnerCommentAnchor(comment, indexCommentTargets([{ ...target, elementId: 'different' }]), 2).state).toBe('lost');
    expect(resolveOwnerCommentAnchor(comment, indexCommentTargets([target, target]), 2).state).toBe('lost');
    expect(resolveOwnerCommentAnchor(comment, indexCommentTargets([{ ...target, selector: 'div[id="test-button"]' }]), 2).state).toBe('lost');
  });
});
