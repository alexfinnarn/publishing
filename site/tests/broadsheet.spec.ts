import { test, expect } from '@playwright/test';

// The first theme-authoring exercise: preserve compact newspaper chrome
// while making its links usable at narrow widths. These are product targets,
// not a general assertion of WCAG conformance.
for (const width of [320, 375, 768, 1280]) {
  test(`broadsheet header links fit and remain tappable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    const links = page.locator('.utility a, .masthead a');
    await expect(links).toHaveCount(6);
    const boxes = await links.evaluateAll(els => els.map(el => {
      const { x, y, width, height, right, bottom } = el.getBoundingClientRect();
      return { label: el.textContent?.trim(), x, y, width, height, right, bottom };
    }));
    for (const box of boxes) {
      expect(box.width, `${box.label} width`).toBeGreaterThanOrEqual(44);
      expect(box.height, `${box.label} height`).toBeGreaterThanOrEqual(44);
      expect(box.x, `${box.label} left edge`).toBeGreaterThanOrEqual(0);
      expect(box.right, `${box.label} right edge`).toBeLessThanOrEqual(width);
    }
    for (let i = 0; i < boxes.length; i++) {
      for (const other of boxes.slice(i + 1)) {
        const a = boxes[i];
        expect(a.right <= other.x || other.right <= a.x ||
          a.bottom <= other.y || other.bottom <= a.y,
        `${a.label} overlaps ${other.label}`).toBe(true);
      }
    }
    // Start from the skip link to check the real tab sequence through chrome.
    await page.locator('.skip').focus();
    for (const link of await links.all()) {
      await page.keyboard.press('Tab');
      await expect(link).toBeFocused();
      await expect(link).toHaveCSS('outline-style', 'solid');
      await expect(link).toHaveCSS('outline-width', '3px');
    }
  });
}

test('broadsheet header targets grow with the reader font size', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('./');
  await page.addStyleTag({ content: 'html { font-size: 20px !important; }' });
  for (const link of await page.locator('.utility a, .masthead a').all()) {
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(55);
    expect(box!.height).toBeGreaterThanOrEqual(55);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
  }
});
