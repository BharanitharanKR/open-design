/** Cloud POC currently exposes only the project root index.html. Do not infer
 * project ownership from a model-supplied path or rewrite the SSE message. */
export function isCloudIndexLink(href: string): boolean {
  return /^(?:\/run\/workspace\/|\.\/|\/)?index\.html(?:[?#].*)?$/.test(href);
}

// Same self-contained HTML policy as the independent cloud frontend. Generated
// scripts run in an opaque-origin iframe, without cookies, external networking,
// forms, popups or access to the trusted application's DOM.
const PREVIEW_CSP = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; frame-src 'none'; child-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
export function cloudPreviewDocument(html: string): string {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  parsed.querySelectorAll('base, meta[http-equiv]').forEach(node => node.remove());
  parsed.querySelectorAll('a, area').forEach(node => {
    node.removeAttribute('href'); node.removeAttribute('target'); node.removeAttribute('ping');
  });
  const policy = parsed.createElement('meta');
  policy.httpEquiv = 'Content-Security-Policy'; policy.content = PREVIEW_CSP;
  parsed.head.prepend(policy);
  return '<!doctype html>\n' + parsed.documentElement.outerHTML;
}
