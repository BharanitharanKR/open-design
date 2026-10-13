import { describe, expect, it } from 'vitest';
import {
  buildPreviewFocusGuard,
  buildPreviewRedirectGuard,
  buildPreviewSandboxShim,
  PREVIEW_URL_GUARD_MAX_HTML_BYTES,
  previewHtmlHasLoadTimeLocationNavigation,
  previewHtmlNeedsNativeNavigation,
  previewHtmlUsesQuirksMode,
} from '../../src/runtime/preview-guards';

describe('preview document guards', () => {
  it('builds inert scripts with stable markers for transport-level deduplication', () => {
    expect(buildPreviewSandboxShim()).toContain('<script data-od-sandbox-shim>');
    expect(buildPreviewFocusGuard()).toContain('<script data-od-preview-focus-guard>');
    expect(buildPreviewRedirectGuard()).toContain('<script data-od-preview-redirect-guard>');
  });

  it('embeds the load-time redirect decision in the redirect guard', () => {
    expect(buildPreviewRedirectGuard()).toContain('BLOCK_LOAD_TIME_SCRIPT_REDIRECT = false');
    expect(buildPreviewRedirectGuard({ blockLoadTimeScriptRedirect: true }))
      .toContain('BLOCK_LOAD_TIME_SCRIPT_REDIRECT = true');
  });

  it('detects authored load-time location navigation without matching comparisons', () => {
    expect(previewHtmlHasLoadTimeLocationNavigation('<script>location.reload()</script>')).toBe(true);
    expect(previewHtmlHasLoadTimeLocationNavigation('<script>window.location = "/next"</script>')).toBe(true);
    expect(previewHtmlHasLoadTimeLocationNavigation('<script>if (location.href === expected) ready()</script>')).toBe(false);
  });

  it('keeps the URL injection limit aligned with the streaming boundary', () => {
    expect(PREVIEW_URL_GUARD_MAX_HTML_BYTES).toBe(2 * 1024 * 1024);
  });
});

it('requires a native carrier for navigation or hidden external scripts, not storage alone', () => {
  expect(previewHtmlNeedsNativeNavigation('<script>localStorage.setItem("ready", "1")</script>')).toBe(false);
  expect(previewHtmlNeedsNativeNavigation('<script>if (!location.hash) location.replace("#/home")</script>')).toBe(true);
  expect(previewHtmlNeedsNativeNavigation('<script src="app.js"></script>')).toBe(true);
  expect(previewHtmlUsesQuirksMode('<p>Fragment</p>')).toBe(true);
  expect(previewHtmlUsesQuirksMode('<html><body>Legacy</body></html>')).toBe(true);
  expect(previewHtmlUsesQuirksMode('<!-- comment -->\n<!DOCTYPE html><html></html>')).toBe(false);
});
