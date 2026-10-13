import { execFile } from 'node:child_process';
import type { Server } from 'node:http';
import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { closeDatabase, insertProject, openDatabase } from '../src/db.js';
import { ensureProject } from '../src/projects.js';
import { startServer } from '../src/server.js';
import { toolTokenRegistry } from '../src/tool-tokens.js';

const cliEntry = fileURLToPath(new URL('../src/cli.ts', import.meta.url));
const exec = promisify(execFile);
let cwd: string;
let projectDir: string;
let projectId: string;
let daemonUrl: string;
let server: Server | undefined;

beforeEach(async () => {
  cwd = await mkdtemp(path.join(tmpdir(), 'od-stock-cli-'));
  const dataDir = process.env.OD_DATA_DIR!;
  const db = openDatabase(process.cwd(), { dataDir });
  projectId = `project_${randomUUID()}`;
  insertProject(db, { id: projectId, name: 'Stock fallback CLI regression', createdAt: Date.now(), updatedAt: Date.now() });
  projectDir = await ensureProject(path.join(dataDir, 'projects'), projectId);
  vi.stubEnv('PEXELS_API_KEY', 'pexels-test-key');
  vi.stubEnv('PIXABAY_API_KEY', 'pixabay-test-key');
  // Only the daemon's provider traffic is mocked. The child CLI uses real HTTP.
  const nativeFetch = globalThis.fetch;
  vi.stubGlobal('fetch', async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
    const url = String(input);
    if (url.startsWith('https://api.pexels.com/')) return new Response('{}', {
      status: 429, headers: { 'retry-after': '60' },
    });
    if (url.startsWith('https://pixabay.com/api/')) return Response.json({ hits: [{
      tags: 'mapo tofu', pageURL: 'https://pixabay.com/photos/tofu/',
      webformatURL: 'https://cdn.pixabay.com/photo/tofu.jpg',
    }] });
    if (url === 'https://cdn.pixabay.com/photo/tofu.jpg') return new Response(new Uint8Array([
      255,216,255,192,0,17,8,3,32,4,176,3,1,34,0,
    ]));
    return nativeFetch(input, init);
  });
  const started = await startServer({ port: 0, returnServer: true }) as { url: string; server: Server };
  daemonUrl = started.url;
  server = started.server;
});

afterEach(async () => {
  if (server) await new Promise<void>((resolve) => server!.close(() => resolve()));
  server = undefined;
  toolTokenRegistry.clear();
  closeDatabase();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  await rm(cwd, { recursive: true, force: true });
});

it('writes a Pexels 429 to stderr and preserves it in a successful fallback JSON result', async () => {
  const grant = toolTokenRegistry.mint({ projectId, runId: `run_${randomUUID()}` });
  const result = await exec(process.execPath, [
    '--import', import.meta.resolve('tsx'), cliEntry,
    'media', 'stock-search', '--slots', JSON.stringify([{ id: 'tofu', query: 'mapo tofu' }]),
  ], {
    cwd,
    timeout: 10_000,
    env: {
      ...process.env, NODE_OPTIONS: '', OD_DAEMON_URL: daemonUrl,
      OD_TOOL_TOKEN: grant.token, OD_PROJECT_ID: projectId,
      PEXELS_API_KEY: undefined, PIXABAY_API_KEY: undefined,
      OPEN_DESIGN_VELA_TELEMETRY: 'off',
    },
  });
  expect(result.stdout.trim().split('\n')).toHaveLength(1);
  const report = JSON.parse(result.stdout);
  expect(report.slots[0]).toMatchObject({ status: 'ok', provider: 'pixabay' });
  expect(report.slots[0].attempts[0]).toMatchObject({ provider: 'pexels', httpStatus: 429, error: 'HTTP 429' });
  expect(await readFile(path.join(projectDir, report.slots[0].path))).toBeInstanceOf(Buffer);
  const events = result.stderr.trim().split('\n').map((line) => {
    expect(line).toMatch(/^\[stock-search\] /);
    return JSON.parse(line.slice('[stock-search] '.length));
  });
  expect(events[0]).toMatchObject({
    slotId: 'tofu', provider: 'pexels', stage: 'search', httpStatus: 429,
    rateLimited: true, error: 'HTTP 429', retryAfter: '60',
  });
  expect(events[1]).toMatchObject({ slotId: 'tofu', provider: 'pixabay', stage: 'search', status: 'ok' });
  expect(result.stdout + result.stderr).not.toContain('pexels-test-key');
  expect(result.stdout + result.stderr).not.toContain('pixabay-test-key');
});
