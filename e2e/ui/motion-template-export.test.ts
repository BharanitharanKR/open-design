import { expect, test } from '@/playwright/suite';

test('[P1] motion soundtrack follows preview play, pause and backward seek', async ({ page }) => {
  await page.goto('/api/plugins/example-motion-showreel/preview');
  const sound = page.getByRole('button', { name: 'Enable sound' });
  await sound.focus();
  await sound.click();
  await expect(sound).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.locator('audio').evaluate((el: HTMLAudioElement) => !el.paused && el.currentTime > .5)).toBe(true);
  await page.getByRole('button', { name: 'Play or pause' }).click();
  await expect.poll(() => page.locator('audio').evaluate((el: HTMLAudioElement) => el.paused)).toBe(true);
  await page.getByRole('slider').fill('0.2');
  await expect.poll(() => page.locator('audio').evaluate((el: HTMLAudioElement) => Math.abs(el.currentTime - .2))).toBeLessThan(.13);
  await sound.click();
  await expect(sound).toHaveAttribute('aria-pressed', 'false');
});

for (const name of ['showreel', 'energy-reel', 'ui-morph', 'pixel-wizard', 'future']) {
  test(`[P1] motion-${name} gallery capture contains only the composition`, async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`/api/plugins/example-motion-${name}/preview`);
    await expect(page.locator('[data-composition-id]')).toBeVisible();
    await expect(page.locator('#controls')).toHaveCSS('opacity', '0');
    const bounds = await page.locator('[data-composition-id]').boundingBox();
    expect(bounds).toEqual({ x: 0, y: 0, width: 1920, height: 1080 });
    // The existing baker captures a taller viewport; the film must stay centered
    // so the gallery's 16:9 cover crop retains the complete composition.
    await page.setViewportSize({ width: 1440, height: 1099 });
    await expect.poll(() => page.locator('[data-composition-id]').boundingBox())
      .toEqual({ x: 0, y: 144.5, width: 1440, height: 810 });
  });

  test(`[P1] motion-${name} exports the full composition without preview controls`, async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    // This is the marker installed by the daemon's existing frame bridge.
    // Actual MP4 encoding is verified separately through that renderer.
    await page.addInitScript(() => {
      Object.assign(window, { __odFrameRenderer: {} });
    });
    await page.goto(`/api/plugins/example-motion-${name}/preview`);
    await expect(page.locator('html')).toHaveClass(/od-export/);
    await expect(page.locator('#controls')).toBeHidden();
    const bounds = await page.locator('[data-composition-id]').boundingBox();
    expect(bounds).toEqual({ x: 0, y: 0, width: 1920, height: 1080 });
  });
  test(`[P1] motion-${name} draws every frame from timeline time, including backward export seeks`, async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`/api/plugins/example-motion-${name}/preview`);
    await page.waitForFunction(() => Boolean((window as unknown as { __timelines?: unknown }).__timelines));
    await page.evaluate(() => document.fonts.ready);
    const hashes = await page.evaluate(async () => {
      const tl = (window as unknown as {
        __timelines: { main: { pause(): void; duration(): number; totalTime(t: number, suppressEvents: boolean): void } };
      }).__timelines.main;
      tl.pause();
      const d = tl.duration();
      const times = [0.3, 0.45, 0.7, 0.9].map((k) => k * d);
      const sample = async (time: number) => {
        // The exporter seeks with callbacks suppressed; drawing must follow anyway.
        tl.totalTime(time, true);
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        return [...document.querySelectorAll('[data-composition-id] canvas')]
          .map((canvas) => (canvas as HTMLCanvasElement).toDataURL('image/png'))
          .join('|');
      };
      const forward = [];
      for (const time of times) forward.push(await sample(time));
      const backward = [];
      for (const time of [...times].reverse()) backward.push(await sample(time));
      return { forward, backward: backward.reverse() };
    });
    expect(new Set(hashes.forward).size).toBe(hashes.forward.length);
    expect(hashes.backward).toEqual(hashes.forward);
  });
}
