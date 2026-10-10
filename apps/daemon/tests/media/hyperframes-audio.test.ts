import { mkdtemp, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { prepareHyperFramesAudio } from '../../src/media/hyperframes-audio.js';

let root: string;
beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'hf-audio-'));
  await writeFile(path.join(root, 'music.mp3'), 'fixture');
});
afterEach(async () => { await rm(root, { recursive: true, force: true }); });

it('resolves a timed local track and keeps frame capture silent', async () => {
  const result = await prepareHyperFramesAudio('<audio id="sound" src="music.mp3" data-start="2" data-duration="3" data-volume="0.5"></audio>', root);
  expect(result.tracks).toMatchObject([{ start: 2, duration: 3, volume: .5 }]);
  expect(result.html).not.toContain('<audio');
  expect(result.html).toContain('id="sound"');
});

it('rejects remote assets and symlinks outside the composition', async () => {
  await expect(prepareHyperFramesAudio('<audio src="https://example.com/music.mp3" data-duration="3"></audio>', root)).rejects.toThrow('local relative');
  const outside = await mkdtemp(path.join(tmpdir(), 'hf-audio-outside-'));
  try {
    await writeFile(path.join(outside, 'private.mp3'), 'private');
    await symlink(path.join(outside, 'private.mp3'), path.join(root, 'escape.mp3'));
    await expect(prepareHyperFramesAudio('<audio src="escape.mp3" data-duration="3"></audio>', root)).rejects.toThrow('inside');
  } finally { await rm(outside, { recursive: true, force: true }); }
});

it.each(['data-start="intro + 2"', 'data-volume="2"', 'loop', 'data-media-start="2"'])(
  'rejects unsupported audio semantics: %s', async (attribute) => {
    await expect(prepareHyperFramesAudio(`<audio src="music.mp3" data-duration="3" ${attribute}></audio>`, root)).rejects.toThrow();
  },
);
