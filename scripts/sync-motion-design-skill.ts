/** Keep the sealed OD Next task asset derived from the public @ skill plus its host adapter. */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'skills/motion-design/SKILL.md');
const target = resolve(root, 'plugins/_official/scenarios/od-next-strategy/assets/task-profiles/motion-design.md');
const body = await readFile(source, 'utf8') + '\n## Discovery production profile\n\nApply this profile only to motion deliverables selected from the current Query. Follow the Discovery authorization gate and reuse a complete same-version body already in context. Preserve separately requested outputs and user-locked source files.\n';
if (process.argv.includes('--check')) {
  if (await readFile(target, 'utf8') !== body) {
    throw new Error('Motion Design task asset has drifted. Run pnpm exec tsx scripts/sync-motion-design-skill.ts');
  }
} else {
  await writeFile(target, body);
}
