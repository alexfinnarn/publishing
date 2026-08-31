import { test, expect } from '@playwright/test';

/** The career blob on /problems/ — the site's one island. */

test('renders without JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/problems/');

  // The shape is server-rendered, so it is there before (and without) React.
  const d = await page.locator('.blob-figure path').getAttribute('d');
  expect(d?.length ?? 0).toBeGreaterThan(500);

  // Dead controls are hidden rather than offered.
  await expect(page.locator('.blob-controls')).toBeHidden();

  // The same facts are on the page as text either way.
  await expect(page.getByText('University of Colorado').first()).toBeVisible();
  await ctx.close();
});

test('hydrates and morphs between stages', async ({ page }) => {
  await page.goto('/problems/');
  const blob = page.locator('.blob');
  await blob.scrollIntoViewIfNeeded();

  const buttons = page.locator('.blob-controls button');
  await expect(buttons).toHaveCount(6);
  await expect(buttons.first()).toHaveAttribute('aria-pressed', 'true');

  const path = page.locator('.blob-figure path');
  const shapeOf = async () => (await path.getAttribute('d'))!.split(' ')[2];

  const before = await shapeOf();
  await buttons.nth(4).click();
  await expect(buttons.nth(4)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.blob-what')).toContainText('giving platform');

  // the shape actually changes, not just the caption
  await expect.poll(shapeOf, { timeout: 3000 }).not.toBe(before);
});

test('every stage produces a distinct shape', async ({ page }) => {
  await page.goto('/problems/');
  await page.locator('.blob').scrollIntoViewIfNeeded();
  const buttons = page.locator('.blob-controls button');
  const path = page.locator('.blob-figure path');

  const shapes: string[] = [];
  for (let i = 0; i < 6; i++) {
    await buttons.nth(i).click();
    await page.waitForTimeout(750);           // let the morph settle
    shapes.push((await path.getAttribute('d'))!);
  }
  expect(new Set(shapes).size).toBe(6);
});

test('the shape updates even when the tab is hidden', async ({ page }) => {
  // requestAnimationFrame is suspended in a background tab; the component
  // must snap rather than leave a stale shape.
  await page.goto('/problems/');
  await page.locator('.blob').scrollIntoViewIfNeeded();
  const path = page.locator('.blob-figure path');
  const before = await path.getAttribute('d');

  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.locator('.blob-controls button').nth(5).click();
  await expect.poll(async () => path.getAttribute('d'), { timeout: 2000 }).not.toBe(before);
});

test('respects prefers-reduced-motion', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/problems/');
  await page.locator('.blob').scrollIntoViewIfNeeded();
  const path = page.locator('.blob-figure path');
  const before = await path.getAttribute('d');
  await page.locator('.blob-controls button').nth(3).click();
  await expect.poll(async () => path.getAttribute('d'), { timeout: 1500 }).not.toBe(before);
  await ctx.close();
});
