import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from '@playwright/test';
import { expect, test } from 'vitest';
import { injectMotionSourcePlayer } from '../../packages/contracts/src/runtime/motion-source-player.js';
import { T } from '../lib/timeouts.js';
const require = createRequire(import.meta.url);

test('[P1] source sound follows play, pause, backward seek, timed effects and replay', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'motion-audio-player-'));
  const browser = await chromium.launch({ headless: true });
  try {
    await writeFile(path.join(root, 'gsap.js'), await readFile(require.resolve('gsap/dist/gsap.min.js')));
    const ffmpeg = require('@ffmpeg-installer/ffmpeg').path as string;
    await promisify(execFile)(ffmpeg, ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=12', path.join(root, 'music.wav')]);
    await writeFile(path.join(root, 'index.html'), injectMotionSourcePlayer(`<html><head><meta name="od-motion-output" content="video"><script src="gsap.js"></script></head><body><div data-composition-id="main" data-duration="12" data-width="640" data-height="360"><audio id="music" src="music.wav" data-start="0" data-duration="12" data-volume="0.3"></audio><audio id="effect" src="music.wav" data-start="3" data-duration="1" data-volume="0.6"></audio></div><script>var clock={t:0};window.__timelines={main:gsap.timeline({paused:true}).to(clock,{t:12,duration:12,ease:'none'},0)};</script></body></html>`));
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
    const states = () => page.locator('audio').evaluateAll((els) => els.map((a) => { const e = a as HTMLAudioElement; return { paused:e.paused, time:e.currentTime, muted:e.muted, volume:e.volume }; }));
    await page.getByRole('button', { name:'播放', exact:true }).click();
    await expect.poll(async () => (await states())[0]!.paused).toBe(false);
    expect((await states())[0]).toMatchObject({ muted:false, volume:0.3 });
    await page.getByRole('button', { name:'暂停', exact:true }).click();
    expect((await states()).every((s) => s.paused)).toBe(true);
    await page.getByRole('slider').fill('3.2');
    await expect.poll(async () => (await states())[1]!.time).toBeCloseTo(.2, 1);
    await page.getByRole('button', { name:'播放', exact:true }).click();
    await expect.poll(async () => (await states())[1]!.paused).toBe(false);
    await page.getByRole('slider').fill('0.8');
    expect((await states())[1]).toMatchObject({ paused:true, time:0 });
    await page.getByRole('button', { name:'重播', exact:true }).click();
    await expect.poll(async () => (await states())[0]!.paused).toBe(false);
    expect((await states())[0]!.time).toBeLessThan(.5);
    await page.getByRole('button', { name:'静音', exact:true }).click();
    expect((await states()).every((s) => s.muted)).toBe(true);
    await page.getByRole('button', { name:'开启声音', exact:true }).click();
    expect((await states()).every((s) => !s.muted)).toBe(true);
  } finally { await browser.close(); await rm(root, { recursive:true, force:true }); }
}, T.xlong);
