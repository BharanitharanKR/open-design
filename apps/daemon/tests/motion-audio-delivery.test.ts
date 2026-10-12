import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { describe, it, expect } from 'vitest';
import { validateMotionDelivery } from '../src/artifacts/motion-delivery.js';
const exec = promisify(execFile);

describe('audible motion delivery', () => {
  it('rejects missing or silent audio and preserves silent/legacy/nonvideo contracts', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'od-motion-audio-'));
    const base = { mode: 'video' as const, sourcePath: 'index.html', videoPath: 'film.mp4' };
    try {
      await exec(ffmpegInstaller.path, ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', path.join(root, 'music.wav')]);
      const source = '<meta name="od-motion-output" content="video"><link rel="alternate" type="video/mp4" href="film.mp4">';
      await writeFile(path.join(root, 'index.html'), source);
      await exec(ffmpegInstaller.path, ['-y', '-f', 'lavfi', '-i', 'color=c=blue:s=64x64:d=1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', path.join(root, 'film.mp4')]);
      const check = (contract: typeof base & { audio?: 'required' | 'silent' }) => validateMotionDelivery({ projectRoot: root, sourceFile: 'index.html', contract });
      expect(await check(base)).toBe(true);
      expect(await check({ ...base, audio: 'silent' })).toBe(true);
      expect(await check({ ...base, audio: 'required' })).toBe(false);
      await writeFile(path.join(root, 'index.html'), source + '<audio src="music.wav" data-duration="1"></audio>');
      expect(await check({ ...base, audio: 'required' })).toBe(false);
      await exec(ffmpegInstaller.path, ['-y', '-f', 'lavfi', '-i', 'color=c=blue:s=64x64:d=1', '-i', path.join(root, 'music.wav'), '-c:v', 'libx264', '-c:a', 'aac', '-shortest', path.join(root, 'film.mp4')]);
      expect(await check({ ...base, audio: 'required' })).toBe(true);
      await writeFile(path.join(root, 'index.html'), source);
      expect(await check({ ...base, audio: 'silent' })).toBe(false);
      await writeFile(path.join(root, 'index.html'), source + '<audio src="music.wav" data-duration="1"></audio>');
      expect(await check({ ...base, audio: 'silent' })).toBe(false);
      await exec(ffmpegInstaller.path, ['-y', '-f', 'lavfi', '-i', 'color=c=blue:s=64x64:d=1', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-t', '1', '-c:v', 'libx264', '-c:a', 'aac', path.join(root, 'film.mp4')]);
      expect(await check({ ...base, audio: 'required' })).toBe(false);
      expect(await validateMotionDelivery({ projectRoot: root, sourceFile: 'index.html', contract: { mode: 'interactive', sourcePath: 'index.html' } })).toBe(true);
    } finally { await rm(root, { recursive: true, force: true }); }
  });
});
