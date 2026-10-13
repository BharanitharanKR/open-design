import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type IframeHTMLAttributes } from 'react';

interface Props extends IframeHTMLAttributes<HTMLIFrameElement> {
  srcDoc: string;
  documentUrl?: string;
  onReady?: () => void;
}

/** The thumbnail/presentation counterpart of FileViewer's enhanced transport. */
export const PreviewDocumentFrame = forwardRef<HTMLIFrameElement, Props>(function PreviewDocumentFrame({
  srcDoc, documentUrl, onReady, onLoad, ...props
}, forwardedRef) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const sequence = useRef(0);
  // A changed auxiliary document gets a fresh JS realm. Rewriting an already
  // running document can collide with its top-level lexical declarations.
  const revision = useMemo(() => ++sequence.current, [srcDoc, documentUrl]);
  useImperativeHandle(forwardedRef, () => frameRef.current!, [revision]);
  useEffect(() => {
    if (!documentUrl) return;
    const frame = frameRef.current;
    let activated = false;
    const receive = (event: MessageEvent) => {
      if (event.source !== frame?.contentWindow) return;
      if (event.data?.type === 'od:srcdoc-transport-ready' && !activated) {
        activated = true;
        frame?.contentWindow?.postMessage({
          type: 'od:srcdoc-transport-activate', html: srcDoc, generation: 'auxiliary-preview',
        }, '*');
      }
      if (event.data?.type === 'od:srcdoc-transport-activated' && event.data.bodyComplete) onReady?.();
    };
    window.addEventListener('message', receive);
    frame?.contentWindow?.postMessage({ type: 'od:srcdoc-transport-shell-probe' }, '*');
    return () => window.removeEventListener('message', receive);
  }, [documentUrl, srcDoc, onReady]);
  return <iframe {...props} key={revision} ref={frameRef}
    src={documentUrl} srcDoc={documentUrl ? undefined : srcDoc}
    onLoad={(event) => {
      if (documentUrl) {
        frameRef.current?.contentWindow?.postMessage({ type: 'od:srcdoc-transport-shell-probe' }, '*');
        frameRef.current?.contentWindow?.postMessage({ type: 'od:srcdoc-transport-ready-probe', generation: 'auxiliary-preview', probeId: 'auxiliary-load' }, '*');
      }
      else { onLoad?.(event); onReady?.(); }
    }} />;
});
