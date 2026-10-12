import type { MotionDeliveryContract } from '@open-design/contracts';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { execFile } from 'node:child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { prepareHyperFramesAudio } from '../media/hyperframes-audio.js';

/** Only called for explicitly contracted audible motion videos. */
function hasAudibleTrack(file: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile(process.env.HYPERFRAMES_FFMPEG_PATH?.trim() || ffmpegInstaller.path,
      ['-hide_banner', '-i', file, '-map', '0:a:0', '-af', 'volumedetect', '-f', 'null', '-'],
      { timeout: 30_000, maxBuffer: 128 * 1024 }, (error, _stdout, stderr) => {
        const peak = /max_volume:\s*(-?[\d.]+) dB/.exec(stderr);
        resolve(!error && !!peak && Number(peak[1]) > -80);
      });
  });
}

/** The frozen plan owns delivery mode and exact paths; HTML cannot downgrade it.
 * This checks existence/identity, not visual quality or model claims. */
export async function validateMotionDelivery(input: {
  projectRoot: string;
  sourceFile: string;
  contract: MotionDeliveryContract;
  touchedPaths?: string[];
}): Promise<boolean> {
  try {
    const root = await fs.realpath(input.projectRoot);
    const source = path.resolve(root, input.sourceFile);
    const $ = load(await fs.readFile(source, 'utf8'));
    if (input.sourceFile !== input.contract.sourcePath) return false;
    if (input.contract.mode === 'interactive') return true;
    if (input.contract.audio !== undefined && $('meta[name="od-motion-output"]').attr('content') !== 'video') return false;
    const href = $('link[rel="alternate"][type="video/mp4"]').attr('href');
    if (!href || /[?#\\]/.test(href) || /^[a-z]+:/i.test(href) || path.isAbsolute(href)) return false;
    const target = path.resolve(path.dirname(source), href);
    if (target !== path.resolve(root, input.contract.videoPath)) return false;
    const realTarget = await fs.realpath(target);
    if (!realTarget.startsWith(root + path.sep) || !/\.mp4$/i.test(realTarget)) return false;
    const relativeVideo = path.relative(root, target);
    if (input.touchedPaths && !input.touchedPaths.some((file) =>
      path.relative(input.projectRoot, path.resolve(input.projectRoot, file)) === relativeVideo
    )) return false;
    const handle = await fs.open(realTarget, 'r');
    try {
      const header = Buffer.alloc(12);
      const { bytesRead } = await handle.read(header, 0, header.length, 0);
      const valid = bytesRead === 12 && header.toString('ascii', 4, 8) === 'ftyp'
        && (await handle.stat()).size > 32;
      if (!valid) return false;
      if (input.contract.audio === 'required') {
        const { tracks } = await prepareHyperFramesAudio(await fs.readFile(source, 'utf8'), path.dirname(source));
        if (!tracks.some((track) => track.volume > 0)) return false;
        return await hasAudibleTrack(realTarget);
      }
      return input.contract.audio !== 'silent' || $('audio').length === 0;
    } finally {
      await handle.close();
    }
  } catch {
    return false;
  }
}
