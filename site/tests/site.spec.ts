import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

/** Every generated page, as site-root paths. */
function pages(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) out.push('/' + p.slice(DIST.length + 1));
    }
  };
  walk(DIST);
  return out.sort();
}

test('builds the curated site plus every theme', () => {
  const all = pages();
  expect(all.length).toBe(45);
  expect(all).toContain('/index.html');
  expect(all).toContain('/t/buff/cases/cu-giving/index.html');
});

test('every internal link resolves', () => {
  const all = new Set(pages().map(p => p.replace(/\/index\.html$/, '/')));
  const broken: string[] = [];

  for (const page of pages()) {
    const html = readFileSync(join(DIST, page.slice(1)), 'utf8');
    for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const target = m[1].split('#')[0];
      if (!target || target.startsWith('//')) continue;
      // assets live on disk as-is; pages are directories with index.html
      const onDisk = target.endsWith('/') || target.includes('.');
      const exists = onDisk
        ? all.has(target) || fileExists(target)
        : all.has(target + '/');
      if (!exists) broken.push(`${page} -> ${target}`);
    }
  }
  expect(broken, `broken links:\n${broken.join('\n')}`).toEqual([]);
});

function fileExists(p: string) {
  try { readFileSync(join(DIST, p.slice(1))); return true; } catch { return false; }
}

test('only the pages with an island ship JavaScript', () => {
  const withJs = pages().filter(p =>
    readFileSync(join(DIST, p.slice(1)), 'utf8').includes('astro-island'));
  // /problems/ in the curated copy and in each of the four themes
  expect(withJs.length).toBe(5);
  expect(withJs.every(p => p.includes('problems'))).toBe(true);
});

test('each page loads exactly one theme stylesheet', () => {
  for (const page of pages()) {
    const html = readFileSync(join(DIST, page.slice(1)), 'utf8');
    const themed = [...html.matchAll(/href="\/styles\/([a-z]+)\.css"/g)];
    expect(themed.length, `${page} should link one theme stylesheet`).toBe(1);
  }
});

test('themed pages keep their links inside the theme', async ({ page }) => {
  await page.goto('/t/buff/problems/');
  const hrefs = await page.locator('main a').evaluateAll(
    els => els.map(e => e.getAttribute('href')!).filter(h => h.startsWith('/')));
  expect(hrefs.length).toBeGreaterThan(0);
  expect(hrefs.every(h => h.startsWith('/t/buff/'))).toBe(true);
});

test('the curated copy has no theme prefix in its links', async ({ page }) => {
  await page.goto('/problems/');
  const hrefs = await page.locator('main a').evaluateAll(
    els => els.map(e => e.getAttribute('href')!).filter(h => h.startsWith('/')));
  expect(hrefs.some(h => h.startsWith('/t/'))).toBe(false);
});

test('the theme switcher offers every theme and marks the current one', async ({ page }) => {
  await page.goto('/t/federal/about/');
  const links = page.locator('.themes a');
  await expect(links).toHaveCount(5);            // Curated + 4 themes
  await expect(page.locator('.themes a[aria-current="true"]')).toHaveText('federal');
});

test('every theme defines the tokens base.css requires', () => {
  const base = readFileSync('src/styles/base.css', 'utf8');
  const contract = [...base.matchAll(/--[a-z0-9-]+/g)]
    .map(m => m[0])
    .filter(t => base.slice(0, base.indexOf('*/')).includes(t));   // the header comment
  const required = [...new Set(contract)];
  expect(required.length).toBeGreaterThan(8);

  for (const theme of ['paper', 'broadsheet', 'buff', 'federal']) {
    const css = readFileSync(`public/styles/${theme}.css`, 'utf8');
    const missing = required.filter(t => !css.includes(`${t}:`));
    expect(missing, `${theme}.css is missing ${missing.join(', ')}`).toEqual([]);
  }
});

test('pages are accessible in the ways we can check statically', async ({ page }) => {
  for (const url of ['/', '/problems/', '/cases/cu-giving/', '/t/broadsheet/']) {
    await page.goto(url);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.locator('a.skip')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const imgs = await page.locator('img:not([alt])').count();
    expect(imgs, `${url} has images without alt`).toBe(0);
  }
});
