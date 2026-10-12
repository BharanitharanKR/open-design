import { MOTION_PREVIEW_ACTIVITY, MOTION_PREVIEW_PROBE, MOTION_PREVIEW_REQUEST } from '@open-design/contracts/runtime/motion-source-player';

interface ActivityBinding { dispose(): void; }
const bindings = new WeakMap<HTMLIFrameElement, ActivityBinding>();

/** Bind for the iframe's full lifetime, including its time in the parking
 * pool. A reloaded hidden document must receive inactive before it can play. */
export function bindMotionPreviewActivity(frame: HTMLIFrameElement): void {
  if (bindings.has(frame)) return;
  const host = frame.ownerDocument.defaultView;
  if (!host) return;
  const send = (active = frame.dataset.odActive === 'true') => {
    // Never cache a document ID on WindowProxy: it survives navigation. Pause
    // immediately; activation always challenges the current document anew.
    frame.contentWindow?.postMessage(active
      ? { type: MOTION_PREVIEW_PROBE }
      : { type: MOTION_PREVIEW_ACTIVITY, active: false }, '*');
  };
  const onRequest = (event: MessageEvent) => {
    if (event.source !== frame.contentWindow || !event.source) return;
    const data = event.data as { type?: unknown; id?: unknown } | null;
    if (data?.type !== MOTION_PREVIEW_REQUEST || typeof data.id !== 'string' || data.id.length === 0 || data.id.length > 128) return;
    frame.contentWindow?.postMessage({ type: MOTION_PREVIEW_ACTIVITY, id: data.id, active: frame.dataset.odActive === 'true' }, '*');
  };
  const onLoad = () => send();
  const observer = new MutationObserver(() => send());
  observer.observe(frame, { attributes: true, attributeFilter: ['data-od-active'] });
  host.addEventListener('message', onRequest);
  frame.addEventListener('load', onLoad);
  bindings.set(frame, { dispose() {
    send(false);
    observer.disconnect();
    host.removeEventListener('message', onRequest);
    frame.removeEventListener('load', onLoad);
  } });
  send();
}

export function unbindMotionPreviewActivity(frame: HTMLIFrameElement): void {
  bindings.get(frame)?.dispose();
  bindings.delete(frame);
}
