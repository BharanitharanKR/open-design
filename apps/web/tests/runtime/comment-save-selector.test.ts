// @vitest-environment node
import { JSDOM } from 'jsdom';
import { expect, it } from 'vitest';
import { buildSrcdoc } from '../../src/runtime/srcdoc';

it('save validation follows the current selector across text/replacement changes, and reports deletion', () => {
  const dom = new JSDOM('<body><button>Original</button></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
  try {
    const win = dom.window;
    const replies: Record<string, unknown>[] = [];
    Object.defineProperty(win, 'parent', { value: { postMessage: (data: Record<string, unknown>) => replies.push(data) } });
    Object.defineProperty(win.HTMLElement.prototype, 'getBoundingClientRect', { value: () => ({ x: 0, y: 20, width: 100, height: 40 }) });
    const script = buildSrcdoc('<body></body>', { commentBridge: true, inspectBridge: true }).match(/<script data-od-selection-bridge>([\s\S]*?)<\/script>/)?.[1];
    if (!script) throw new Error('missing bridge');
    new win.Function(script).call(win);
    const save = () => {
      win.dispatchEvent(new win.MessageEvent('message', { data: { type: 'od:comment-active-target', validateForSave: true,
        requestId: 'save', elementId: 'old-id', selector: 'body > button:nth-of-type(1)' } }));
      return replies.at(-1);
    };
    expect(save()).toMatchObject({ type: 'od:comment-active-target-update', text: 'Original' });
    win.document.querySelector('button')!.textContent = 'Changed copy';
    expect(save()).toMatchObject({ type: 'od:comment-active-target-update', text: 'Changed copy' });
    win.document.querySelector('button')!.outerHTML = '<button data-od-id="new">Replacement</button>';
    expect(save()).toMatchObject({ type: 'od:comment-active-target-update', elementId: 'new', text: 'Replacement', selector: 'body > button:nth-of-type(1)' });
    win.document.querySelector('button')!.remove();
    expect(save()).toMatchObject({ type: 'od:comment-location-missing', requestId: 'save' });
  } finally { dom.window.close(); }
});
