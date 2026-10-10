import { expect, test } from '@/playwright/suite';

for (const name of ['3d-scene', 'explainer', 'product-launch', 'showreel', 'data-story']) {
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
}

test('[P1] showreel procedural layers survive export seeks and backward scrubbing', async ({ page }) => {
  await page.goto('/api/plugins/example-motion-showreel/preview');
  await page.waitForFunction(() => Boolean((window as unknown as { __timelines?: unknown }).__timelines));
  const samples = await page.evaluate(async () => {
    const tl = (window as unknown as {
      __timelines: { main: { pause(): void; totalTime(t: number, suppressEvents: boolean): void } };
    }).__timelines.main;
    tl.pause();
    const result = [];
    for (const time of [8.7, 11.4, 14, 8.7, 11.4, 0, 14, 3.8, 7.5, 3.8]) {
      tl.totalTime(time, true);
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      result.push({
        time,
        slider: document.querySelector('#sRead')?.textContent,
        number: document.querySelector('#bigNum')?.textContent,
        line: (document.querySelector('#linePath') as SVGElement).style.strokeDashoffset,
        dot: (document.querySelector('#morph') as HTMLElement).style.transform,
        ripples: ['#rip1', '#rip2'].map((id) => Number((document.querySelector(id) as HTMLElement).style.opacity)),
      });
    }
    return result;
  });
  expect(samples[0]?.slider).toBe('63%');
  expect(samples[1]?.number).toBe('+211%');
  expect(Number(samples[1]?.line)).toBeGreaterThan(0);
  expect(samples[3]).toEqual(samples[0]);
  expect(samples[4]).toEqual(samples[1]);
  expect(samples[5]?.slider).toBe('20%');
  expect(samples[5]?.number).toBe('+0%');
  expect(samples[6]).toEqual(samples[2]);
  expect(samples[7]?.ripples).toEqual([0, 0]);
  expect(samples[8]?.ripples[0]).toBeGreaterThan(0);
  expect(samples[9]).toEqual(samples[7]);
});
