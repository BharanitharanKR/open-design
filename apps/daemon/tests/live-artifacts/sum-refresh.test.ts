import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { writeProjectFile } from '../../src/projects.js';
import {
  acquireLiveArtifactRefreshLock, commitLiveArtifactRefreshCandidate,
  createLiveArtifact, getLiveArtifact, releaseLiveArtifactRefreshLock,
} from '../../src/live-artifacts/store.js';
import {
  buildLiveArtifactRefreshCandidate, executeLocalDaemonRefreshSource,
} from '../../src/live-artifacts/refresh.js';

it('registers and refreshes a source-derived sum without changing artifact identity or template', async () => {
  const projectsRoot = await mkdtemp(path.join(tmpdir(), 'od-sum-refresh-'));
  const projectId = 'sum-project';
  const templateHtml = '<ul><li data-od-repeat="row in data.items">{{row.name}} {{row.count}}</li></ul><b>{{sum data.items count}}</b>';
  const hash = (value: string) => createHash('sha256').update(value).digest('hex');
  try {
    const rows = [{ name: 'A', count: 8 }, { name: 'B', count: 13 }];
    await writeProjectFile(projectsRoot, projectId, 'stock.json', JSON.stringify({ items: rows }));
    const created = await createLiveArtifact({
      projectsRoot, projectId, templateHtml,
      input: {
        title: 'Inventory', preview: { type: 'html', entry: 'index.html' },
        document: {
          format: 'html_template_v1', templatePath: 'template.html',
          generatedPreviewPath: 'index.html', dataPath: 'data.json', dataJson: { items: rows },
          sourceJson: {
            type: 'local_file', toolName: 'project_files.read_json', input: { path: 'stock.json' },
            outputMapping: { dataPaths: [{ from: 'json.items', to: 'items' }], transform: 'identity' },
            refreshPermission: 'manual_refresh_granted_for_read_only',
          },
        },
      },
    });
    expect(await readFile(created.paths.generatedPreviewHtmlPath, 'utf8'))
      .toBe('<ul><li>A 8</li><li>B 13</li></ul><b>21</b>');
    const scope = { projectsRoot, projectId, artifactId: created.artifact.id };
    for (const [items, expected] of [
      [[{ name: 'A', count: 3 }, { name: 'B', count: 0 }], '<ul><li>A 3</li><li>B 0</li></ul><b>3</b>'],
      [[], '<ul></ul><b>0</b>'],
    ] as const) {
      await writeProjectFile(projectsRoot, projectId, 'stock.json', JSON.stringify({ items }));
      const current = await getLiveArtifact(scope);
      const output = await executeLocalDaemonRefreshSource({
        projectsRoot, projectId, source: current.artifact.document!.sourceJson!,
      });
      const candidate = buildLiveArtifactRefreshCandidate({
        artifact: current.artifact, currentDataJson: current.artifact.document!.dataJson,
        documentOutput: { output },
      });
      const lock = await acquireLiveArtifactRefreshLock(scope);
      try {
        const refreshed = await commitLiveArtifactRefreshCandidate({
          ...scope, refreshId: lock.metadata.refreshId, dataJson: candidate.dataJson,
        });
        expect(refreshed.artifact.id).toBe(created.artifact.id);
        expect(refreshed.artifact.refreshStatus).toBe('succeeded');
        expect(await readFile(refreshed.paths.generatedPreviewHtmlPath, 'utf8')).toBe(expected);
        expect(hash(await readFile(refreshed.paths.templateHtmlPath, 'utf8'))).toBe(hash(templateHtml));
        expect(refreshed.artifact.document!.dataJson).not.toHaveProperty('total');
      } finally {
        await releaseLiveArtifactRefreshLock(lock);
      }
    }

    // A malformed later source must fail without replacing the last valid view.
    await writeProjectFile(projectsRoot, projectId, 'stock.json', JSON.stringify({ items: [{ name: 'A', count: 'bad' }] }));
    const current = await getLiveArtifact(scope);
    const output = await executeLocalDaemonRefreshSource({
      projectsRoot, projectId, source: current.artifact.document!.sourceJson!,
    });
    const candidate = buildLiveArtifactRefreshCandidate({
      artifact: current.artifact, currentDataJson: current.artifact.document!.dataJson,
      documentOutput: { output },
    });
    const lock = await acquireLiveArtifactRefreshLock(scope);
    try {
      await expect(commitLiveArtifactRefreshCandidate({
        ...scope, refreshId: lock.metadata.refreshId, dataJson: candidate.dataJson,
      })).rejects.toThrow(/sum field must be a finite number/);
      expect(await readFile(current.paths.generatedPreviewHtmlPath, 'utf8')).toBe('<ul></ul><b>0</b>');
      expect(hash(await readFile(current.paths.templateHtmlPath, 'utf8'))).toBe(hash(templateHtml));
    } finally {
      await releaseLiveArtifactRefreshLock(lock);
    }
  } finally {
    await rm(projectsRoot, { recursive: true, force: true });
  }
});
