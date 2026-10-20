/** Annotation identity/selector contract shared by URL, srcDoc, and portable comment bridges.
 * Select the same nonempty attribute for both fields; an empty od-id must not mask a screen label.
 * Hosts supply their existing attribute escaping function. This module only emits script source.
 */
export const ANNOTATED_SELECTOR_HELPERS = String.raw`
  function nativeHtmlTargetFor(el){
    var id = el && el.getAttribute('id');
    if (!id || !el.ownerDocument.defaultView.CSS) return null;
    var selector = '[id="' + el.ownerDocument.defaultView.CSS.escape(id) + '"]';
    var nodes = el.ownerDocument.querySelectorAll(selector);
    if (nodes.length !== 1 || nodes[0] !== el) return null;
    return { elementId: 'html-id:' + el.localName + ':' + encodeURIComponent(id), selector: el.localName + selector };
  }
  function strictNativeHtmlNode(elementId, selector){
    try {
      var nodes = document.querySelectorAll(selector);
      if (nodes.length !== 1) return null;
      var target = nativeHtmlTargetFor(nodes[0]);
      return target && target.elementId === elementId && target.selector === selector ? nodes[0] : null;
    } catch (_) { return null; }
  }
  function annotatedElementIdFor(el){
    var odId = el.getAttribute('data-od-id');
    if (odId) return odId;
    var label = el.getAttribute('data-screen-label');
    if (label) return label;
    var native = nativeHtmlTargetFor(el);
    return native ? native.elementId : null;
  }
  function annotatedSelectorFor(el, esc){
    var odId = el.getAttribute('data-od-id');
    if (odId) return '[data-od-id="' + esc(odId) + '"]';
    var label = el.getAttribute('data-screen-label');
    if (label) return '[data-screen-label="' + esc(label) + '"]';
    var native = nativeHtmlTargetFor(el);
    return native ? native.selector : null;
  }
`;
