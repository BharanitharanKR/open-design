// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { cloudPreviewDocument, isCloudIndexLink } from '../../src/runtime/cloud-file-preview';
describe('cloud file targets', () => {
  it.each(['index.html', './index.html', '/index.html', '/run/workspace/index.html', '/run/workspace/index.html#demo', 'index.html?v=1'])('recognizes only the supported project file: %s', href => {
    expect(isCloudIndexLink(href)).toBe(true);
  });
  it.each(['https://example.com/index.html', '//example.com/index.html', 'file:///run/workspace/index.html', '/projects/other/index.html', '../index.html', '/run/workspace/other/index.html', 'other.html', '/run/workspace/%2e%2e/index.html'])('does not redirect unrelated paths to the current project: %s', href => {
    expect(isCloudIndexLink(href)).toBe(false);
  });
});
it('retains inline design scripts while putting the restrictive policy before generated content', () => {
  const result = cloudPreviewDocument('<base href="https://example.com/"><meta http-equiv="refresh" content="0;url=https://example.com/"><meta http-equiv="Content-Security-Policy" content="default-src *"><script>document.title="design"</script><a href="https://example.com/" target="_top" ping="https://example.com/">link</a><h1>Design</h1>');
  const doc = new DOMParser().parseFromString(result, 'text/html');
  const policy = doc.head.firstElementChild!;
  expect(policy.getAttribute('http-equiv')).toBe('Content-Security-Policy');
  expect(policy.getAttribute('content')).toContain("connect-src 'none'");
  expect(doc.querySelectorAll('meta[http-equiv]')).toHaveLength(1);
  expect(doc.querySelector('base')).toBeNull();
  expect(doc.querySelector('a')!.hasAttribute('href')).toBe(false);
  expect(doc.querySelector('a')!.hasAttribute('target')).toBe(false);
  expect(doc.querySelector('script')!.textContent).toContain('document.title');
  expect(doc.body.textContent).toContain('Design');
});
