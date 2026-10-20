import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  exportProjectAsMp4,
  exportProjectAsZip,
  exportProjectAsPptx,
  exportProjectImageDataUrl,
} from '../../src/runtime/exports';

const download = vi.fn();
beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_OD_CLOUD_POC', '1');
  vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
  vi.stubGlobal('document', {
    createElement: () => ({ href: '', download: '', click: download }),
    body: { appendChild: vi.fn(), removeChild: vi.fn() },
  });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  download.mockClear();
});

it.each([false, true])(
  'does not replace a rejected cloud ZIP with a single HTML file (history=%s)',
  async (history) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          { error: { code: 'runtime_file_read_unavailable', message: 'Files unavailable' } },
          { status: 501 },
        ),
      ),
    );
    await expect(
      exportProjectAsZip({
        projectId: 'p',
        filePath: 'index.html',
        fallbackHtml: '<h1>Incomplete</h1>',
        fallbackTitle: 'Design',
        ...(history ? { versionId: 'old' } : {}),
      }),
    ).rejects.toThrow(/request failed \(501\)/);
    expect(download).not.toHaveBeenCalled();
  },
);
it('does not replace an offline cloud ZIP with an incomplete archive', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new Error('Offline');
    }),
  );
  await expect(
    exportProjectAsZip({
      projectId: 'p',
      filePath: 'index.html',
      fallbackHtml: '<h1>Incomplete</h1>',
      fallbackTitle: 'Design',
    }),
  ).rejects.toThrow('Offline');
  expect(download).not.toHaveBeenCalled();
});
it('downloads a successful cloud archive once', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () => new Response('zip bytes', { headers: { 'content-type': 'application/zip' } }),
    ),
  );
  await exportProjectAsZip({
    projectId: 'p',
    filePath: 'index.html',
    fallbackHtml: '',
    fallbackTitle: 'Design',
  });
  expect(download).toHaveBeenCalledTimes(1);
});
it.each(['pptx', 'image'] as const)(
  'keeps Runtime 501 errors semantic for cloud %s exports',
  async (format) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          { error: { code: 'runtime_history_unavailable', message: 'History unavailable' } },
          { status: 501 },
        ),
      ),
    );
    const options = { projectId: 'p', fileName: 'index.html', versionId: 'old' };
    const result = await (format === 'pptx'
      ? exportProjectAsPptx(options)
      : exportProjectImageDataUrl(options));
    expect(result).toMatchObject({ ok: false, error: 'History unavailable' });
    expect(result).not.toHaveProperty('unavailable');
    expect(download).not.toHaveBeenCalled();
  },
);

it('downloads MP4 only after the authenticated export response contains MP4 bytes', async () => {
  const bytes = new Uint8Array([0, 0, 0, 20, 102, 116, 121, 112, 105, 115, 111, 109, 0]);
  const fetcher = vi.fn(async () => new Response(bytes, { headers: { 'content-type': 'video/mp4' } }));
  vi.stubGlobal('fetch', fetcher);
  await exportProjectAsMp4({ projectId: 'project-a', fileName: 'index.html', title: 'Motion' });
  expect(fetcher).toHaveBeenCalledWith('/api/projects/project-a/export/mp4', expect.objectContaining({
    method: 'POST', credentials: 'same-origin', body: JSON.stringify({ fileName: 'index.html', title: 'Motion' }),
  }));
  expect(download).toHaveBeenCalledTimes(1);
});
it.each([
  [422, 'application/json', JSON.stringify({ message: 'Missing soundtrack' }), 'Missing soundtrack'],
  [200, 'text/html', '<h1>Proxy error</h1>', 'Invalid MP4 response'],
  [200, 'video/mp4', 'not a video', 'Invalid MP4 file'],
] as const)('never downloads a failed or invalid MP4 (%s, %s)', async (status, mime, body, error) => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(body, { status, headers: { 'content-type': mime } })));
  await expect(exportProjectAsMp4({ projectId: 'p', fileName: 'index.html', title: 'Motion' })).rejects.toThrow(error);
  expect(download).not.toHaveBeenCalled();
});
