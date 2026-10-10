import { expect, test } from '@/playwright/suite';

test('[P1] motion soundtrack follows preview play, pause and backward seek', async ({ page }) => {
  await page.goto('/api/plugins/example-motion-product-launch/preview');
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

test('[P1] product launch preserves transition objects across export seeks', async ({ page }) => {
  await page.goto('/api/plugins/example-motion-product-launch/preview');
  await page.waitForFunction(() => Boolean((window as unknown as { __timelines?: unknown }).__timelines));
  const samples = await page.evaluate(async () => {
    const tl = (window as unknown as {
      __timelines: { main: { pause(): void; totalTime(t: number, suppressEvents: boolean): void } };
    }).__timelines.main;
    tl.pause();
    const result = [];
    for (const time of [6.6, 8.8, 13.5, 14.5, 6.6, 13.5, 8.8]) {
      tl.totalTime(time, true);
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const styles = ['b0', 'summary', 'summaryContent', 'a0'].map((id) => {
        const element = document.getElementById(id)!;
        if (getComputedStyle(element).visibility === 'hidden') return null;
        return {
          opacity: Number(getComputedStyle(element).opacity),
          transform: element.style.transform,
          width: element.style.width,
          height: element.style.height,
        };
      });
      result.push({ time, styles });
    }
    return result;
  });
  // The message and summary coexist during the handoff; the card unfolds into a row.
  expect(samples[0]!.styles[0]!.opacity).toBeGreaterThan(0);
  expect(samples[0]!.styles[1]!.opacity).toBeGreaterThan(0);
  expect(parseFloat(samples[2]!.styles[1]!.width)).toBeGreaterThan(parseFloat(samples[1]!.styles[1]!.width));
  expect(parseFloat(samples[2]!.styles[1]!.height)).toBeLessThan(parseFloat(samples[1]!.styles[1]!.height));
  expect(samples[3]!.styles[3]!.opacity).toBe(1);
  expect(samples[4]).toEqual(samples[0]);
  expect(samples[5]).toEqual(samples[2]);
  expect(samples[6]).toEqual(samples[1]);
});
