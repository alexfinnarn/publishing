import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BASE } from '../site.config.mjs';

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
      const href = m[1].split('#')[0];
      if (!href || href.startsWith('//')) continue;
      // Every site-root href has to carry the deploy's base path; without it
      // the link 404s on GitHub Pages even though the file is right there.
      if (BASE && !href.startsWith(BASE + '/')) {
        broken.push(`${page} -> ${href} (missing base path)`);
        continue;
      }
      const target = href.slice(BASE.length);
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
    const themed = [...html.matchAll(new RegExp(`href="${BASE}/styles/([a-z]+)\\.css"`, 'g'))];
    expect(themed.length, `${page} should link one theme stylesheet`).toBe(1);
  }
});

test('themed pages keep their links inside the theme', async ({ page }) => {
  await page.goto('t/buff/problems/');
  const hrefs = await page.locator('main a').evaluateAll(
    els => els.map(e => e.getAttribute('href')!).filter(h => h.startsWith('/')));
  expect(hrefs.length).toBeGreaterThan(0);
  expect(hrefs.every(h => h.startsWith(`${BASE}/t/buff/`))).toBe(true);
});

test('the curated copy has no theme prefix in its links', async ({ page }) => {
  await page.goto('problems/');
  const hrefs = await page.locator('main a').evaluateAll(
    els => els.map(e => e.getAttribute('href')!).filter(h => h.startsWith('/')));
  expect(hrefs.some(h => h.startsWith(`${BASE}/t/`))).toBe(false);
});

test('the theme switcher offers every theme and marks the current one', async ({ page }) => {
  await page.goto('t/federal/about/');
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

test('one page is canonical and the copies say so', () => {
  const canonical = (page: string) =>
    readFileSync(join(DIST, page.slice(1)), 'utf8')
      .match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const noindexed = (page: string) =>
    readFileSync(join(DIST, page.slice(1)), 'utf8').includes('name="robots"');

  for (const page of pages()) expect(canonical(page), page).toBeTruthy();

  // A themed copy points at the curated page it is a copy of, and keeps
  // itself out of the index. The curated pages do neither.
  expect(canonical('/t/buff/about/index.html'))
    .toBe(canonical('/about/index.html'));
  expect(noindexed('/t/buff/about/index.html')).toBe(true);
  expect(noindexed('/about/index.html')).toBe(false);
  expect(noindexed('/404.html'), '404 is not an address').toBe(true);
});

test('the sitemap lists the curated pages and only those', () => {
  const xml = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  expect(locs.length).toBe(8);          // five pages plus three case studies
  expect(locs.some(l => l.includes('/t/'))).toBe(false);
  expect(locs.some(l => l.includes('404'))).toBe(false);
});

test('pages are accessible in the ways we can check statically', async ({ page }) => {
  for (const url of ['', 'problems/', 'cases/cu-giving/', 't/broadsheet/']) {
    await page.goto(url);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.locator('a.skip')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const imgs = await page.locator('img:not([alt])').count();
    expect(imgs, `${url} has images without alt`).toBe(0);
  }
});
