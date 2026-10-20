// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useEffect } from 'react';
import { AssistantMessage } from '../../src/components/AssistantMessage';
import type { ChatMessage } from '../../src/types';

// Keep this integration test focused on the real message click / file read /
// isolated iframe. PreviewModal chrome is covered by its own component tests.
vi.mock('../../src/components/PreviewModal', () => ({ PreviewModal: ({ views, onView, onClose }: any) => {
  useEffect(() => { onView?.('index.html'); }, [onView]);
  return <div role="dialog"><button onClick={onClose}>Close</button>{views[0].error ? <button onClick={() => onView('index.html')}>Retry</button> : views[0].custom ?? <span>Loading</span>}</div>;
} }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const message: ChatMessage = { id: 'm', role: 'assistant', content: '[打开 index.html](/run/workspace/index.html)', events: [{ kind: 'text', text: '[打开 index.html](/run/workspace/index.html)' }], startedAt: 1, endedAt: 2, runStatus: 'succeeded' };
function show(projectId = 'project-a', streaming = false) {
  return <AssistantMessage message={message} streaming={streaming} projectId={projectId} />;
}
it.each([false, true])('opens the current project cloud file with streaming=%s and an unchanged link', async (streaming) => {
  vi.stubEnv('NEXT_PUBLIC_OD_CLOUD_POC', '1');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ html: '<h1>Cloud design</h1>' }) });
  vi.stubGlobal('fetch', fetcher);
  render(show('project-a', streaming));
  const link = screen.getByRole('link', { name: '打开 index.html' });
  expect(link.getAttribute('href')).toBe('/run/workspace/index.html');
  fireEvent.click(link);
  const frame = await screen.findByTitle('index.html');
  expect(fetcher).toHaveBeenCalledWith('/api/projects/project-a/files/index.html', expect.objectContaining({ credentials: 'same-origin', signal: expect.any(AbortSignal) }));
  expect(frame.getAttribute('srcdoc')).toContain('Cloud design');
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts');
  expect(frame.hasAttribute('src')).toBe(false);
  fireEvent.click(screen.getByText('Close'));
  expect(screen.queryByRole('dialog')).toBeNull();
});
it('shows failure and retries instead of presenting denied content', async () => {
  vi.stubEnv('NEXT_PUBLIC_OD_CLOUD_POC', '1');
  const fetcher = vi.fn().mockResolvedValueOnce({ ok: false, status: 403 }).mockResolvedValueOnce({ ok: true, json: async () => ({ html: '<p>Retry succeeded</p>' }) });
  vi.stubGlobal('fetch', fetcher);
  render(show()); fireEvent.click(screen.getByRole('link'));
  fireEvent.click(await screen.findByText('Retry'));
  expect((await screen.findByTitle('index.html')).getAttribute('srcdoc')).toContain('Retry succeeded');
  expect(fetcher).toHaveBeenCalledTimes(2);
});
it('aborts a pending read and cannot show the previous project after switching', async () => {
  vi.stubEnv('NEXT_PUBLIC_OD_CLOUD_POC', '1');
  let resolve!: (value: unknown) => void;
  const fetcher = vi.fn().mockImplementation(() => new Promise(r => { resolve = r; }));
  vi.stubGlobal('fetch', fetcher);
  const view = render(show()); fireEvent.click(screen.getByRole('link'));
  await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
  view.rerender(show('project-b'));
  expect(fetcher.mock.calls[0]![1].signal.aborted).toBe(true);
  resolve({ ok: true, json: async () => ({ html: '<h1>Wrong project</h1>' }) });
  expect(screen.queryByRole('dialog')).toBeNull();
});
it('does not enable cloud reads in normal client builds', () => {
  vi.stubEnv('NEXT_PUBLIC_OD_CLOUD_POC', '');
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  render(show()); fireEvent.click(screen.getByRole('link'));
  expect(fetcher).not.toHaveBeenCalled(); expect(screen.queryByRole('dialog')).toBeNull();
});
