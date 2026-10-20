// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { CloudMotionExportButton } from '../../src/components/CloudMotionExportButton';
import { FileViewer } from '../../src/components/FileViewer';
const { exportMp4 } = vi.hoisted(() => ({ exportMp4: vi.fn() }));
vi.mock('../../src/runtime/exports', async () => ({
  ...await vi.importActual('../../src/runtime/exports'), exportProjectAsMp4: exportMp4,
}));
afterEach(() => { cleanup(); vi.resetAllMocks(); vi.unstubAllEnvs(); });
it('prevents duplicate export and makes errors retryable', async () => {
  let fail!: (e: Error) => void;
  exportMp4.mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; })).mockResolvedValue('download');
  render(<CloudMotionExportButton projectId="p" fileName="index.html" title="Film" />);
  fireEvent.click(screen.getByRole('button', { name: 'MP4' }));
  expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  fail(new Error('Soundtrack missing'));
  expect((await screen.findByRole('alert')).textContent).toContain('Soundtrack missing');
  fireEvent.click(screen.getByRole('button', { name: 'MP4' }));
  await waitFor(() => expect(exportMp4).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
});
it('cancels a download when its project or preview is closed', () => {
  exportMp4.mockImplementation(() => new Promise(() => {}));
  const view = render(<CloudMotionExportButton projectId="p" fileName="index.html" title="Film" />);
  fireEvent.click(screen.getByRole('button'));
  const signal = exportMp4.mock.calls[0]![0].signal;
  view.unmount();
  expect(signal.aborted).toBe(true);
});
it.each(['1', ''])('exposes MP4 from the real file export menu only in cloud builds (%s)', async flag => {
  vi.stubEnv('NEXT_PUBLIC_OD_CLOUD_POC', flag);
  exportMp4.mockResolvedValue('download');
  render(<FileViewer projectId="p" projectKind="video" file={{ name: 'index.html', path: 'index.html', type: 'file', size: 100, mtime: 1, kind: 'html', mime: 'text/html' }}
    liveHtml={'<main data-composition-id="main" data-duration="2">Motion</main>'} />);
  fireEvent.click(await screen.findByRole('button', { name: /export/i }));
  if (flag) {
    fireEvent.click(await screen.findByRole('menuitem', { name: 'MP4' }));
    expect(exportMp4).toHaveBeenCalledWith(expect.objectContaining({ projectId: 'p', fileName: 'index.html' }));
  } else expect(screen.queryByRole('menuitem', { name: 'MP4' })).toBeNull();
});
