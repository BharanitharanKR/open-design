import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

import { expect, test } from 'vitest';

import {
  captureFrozenSkillPackageFromSources,
  materializeFrozenSkillPackage,
} from '../../../apps/daemon/src/strategies/od-next/frozen-skill-package.js';

const examples = fileURLToPath(new URL('../../../plugins/_official/examples/', import.meta.url));

test.each(['explainer', 'showreel', 'product-launch', '3d-scene', 'short-story'])(
  '[P1] motion-%s carries its offline scripts, font and license through the frozen reference package',
  async (name) => {
    const source = path.join(examples, `motion-${name}`);
    const frozen = await captureFrozenSkillPackageFromSources({ sources: [{ dir: source, name: `Motion ${name}` }] });
    const project = await mkdtemp(path.join(tmpdir(), 'motion-reference-'));
    try {
      const [relativeRoot] = await materializeFrozenSkillPackage({ frozen, cwd: project });
      const reference = path.join(project, relativeRoot!);
      const html = await readFile(path.join(reference, 'example.html'), 'utf8');
      const skill = await readFile(path.join(reference, 'SKILL.md'), 'utf8');
      // Follow the template's documented offline preparation step for Three.js.
      if (name === '3d-scene') {
        expect(skill).toContain('gzip -dc');
        const bytes = gunzipSync(await readFile(path.join(reference, 'assets/three.min.js.gz')));
        await writeFile(path.join(reference, 'assets/three.min.js'), bytes);
      }
      const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)];
      expect(scripts.length).toBeGreaterThan(0);
      for (const [, src] of scripts) {
        expect(src).not.toMatch(/^https?:/);
        const relative = src!.replace(/^\.\//, '');
        expect(await readFile(path.join(reference, relative))).toEqual(await readFile(path.join(source, relative)));
      }
      // Rendering must retain the same font when the reference is copied offline.
      const fonts = [...html.matchAll(/url\(["']?(assets\/[^)"']+\.(?:ttf|woff2?))["']?\)/g)];
      expect(fonts.length).toBeGreaterThan(0);
      for (const [, font] of fonts) {
        expect(await readFile(path.join(reference, font!))).toEqual(await readFile(path.join(source, font!)));
      }
      expect(await readFile(path.join(reference, 'assets/space-grotesk-OFL.txt'), 'utf8')).toContain('SIL OPEN FONT LICENSE');
      expect(html).toContain('src="assets/soundtrack.mp3"');
      expect(await readFile(path.join(reference, 'assets/soundtrack.mp3')))
        .toEqual(await readFile(path.join(source, 'assets/soundtrack.mp3')));
    } finally {
      await rm(project, { recursive: true, force: true });
    }
  },
);
