import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
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

test('the test build carries the site plus the theme fixture', () => {
  // The suite runs against `build:matrix`, which adds every page in every
  // theme under /t/ so the contract has something to compare against. What
  // DEPLOYS is nine pages — see 'what deploys is one version of each page'.
  const all = pages();
  expect(all.length).toBe(45);
  expect(all).toContain('/index.html');
  expect(all).toContain('/t/buff/cases/cu-giving/index.html');
});

test('what deploys is one version of each page, and no fixture', () => {
  // Builds the way the deploy does — no THEME_MATRIX — into a throwaway
  // directory. This is the guarantee that the fixture cannot ship: not a grep
  // over a workflow file, an actual production build.
  const out = 'dist-deploy-check';
  rmSync(out, { recursive: true, force: true });
  execFileSync('npx', ['astro', 'build', '--outDir', out], {
    env: { ...process.env, THEME_MATRIX: '' }, stdio: 'pipe',
  });

  const built: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) built.push(p.slice(out.length));
    }
  };
  walk(out);

  expect(built.filter(p => p.startsWith('/t/')), 'the fixture leaked into the deploy build')
    .toEqual([]);
  expect(built.length, 'one version of each content page').toBe(contentFiles().length);
  for (const p of built) {
    expect(readFileSync(join(out, p.slice(1)), 'utf8'), `${p} still ships the theme switcher`)
      .not.toContain('class="themes');
  }
  rmSync(out, { recursive: true, force: true });
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

test('nothing links into the theme fixture', () => {
  // A page has one address. Even in the matrix build, no link may point at a
  // /t/ URL — those pages do not exist on the deployed site, so a link to one
  // is a 404 waiting to ship.
  const leaks: string[] = [];
  for (const page of pages()) {
    const html = readFileSync(join(DIST, page.slice(1)), 'utf8');
    for (const m of html.matchAll(/href="([^"]*)"/g)) {
      if (m[1].startsWith(`${BASE}/t/`)) leaks.push(`${page} -> ${m[1]}`);
    }
  }
  expect(leaks, `links into the fixture:\n${leaks.join('\n')}`).toEqual([]);
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

/* ---------------------------------------------------------------------------
 * The theme contract.
 *
 * Themes are allowed to choose tags — their own chrome above <main>, their own
 * elements inside it. What they may never choose is the words or the order,
 * because that is what makes the content portable and what keeps reading and
 * focus order honest. These tests are that limit, written down.
 * ------------------------------------------------------------------------ */

/** Theme names, from the directories themselves, so adding a theme does not
 *  mean editing a test to remember it. */
function themeNames(): string[] {
  return readdirSync('src/themes', { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .sort();
}

function brief(theme: string) {
  return JSON.parse(readFileSync(`src/themes/${theme}/theme.json`, 'utf8'));
}

/** Content is compared in two halves, because a variant is allowed to reorder
 *  the FIELDS of an item but never the items themselves.
 *
 *  `posts/title-led` puts the link before the date and `posts/date-keyed` puts
 *  the date first — both are honest claims about which one is the key, and
 *  neither adds, drops, or moves a post. So the contract is:
 *
 *    - the prose around the items is identical, word for word and in order
 *    - the items appear in the same order, each carrying the same words
 *
 *  A theme may also add words of its own — a table's column headers, a
 *  separator — because a variant that changes what content IS sometimes has
 *  to say so. What it may not do is add them silently: theme copy carries
 *  `data-theme-copy` and is dropped here. (Marked elements must be leaves.) */
function flatten(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<([a-z]+)[^>]*\sdata-theme-copy[^>]*>[\s\S]*?<\/\1>/g, ' ')  // leaves only
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mainOf(page: string): string {
  const html = readFileSync(join(DIST, page.slice(1)), 'utf8');
  return html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? '';
}

/** Pull out every element carrying `attr`, depth-aware.
 *
 *  A regex with a backreference stops at the first closing tag, which is wrong
 *  the moment an item contains an element of its own kind — <span
 *  data-content-item><span class="k">…</span>…</span> silently truncates. So
 *  this counts nesting instead. Returns each match's inner HTML, and the
 *  source with those elements removed. */
function extractMarked(html: string, attr: string): { inner: string[]; rest: string } {
  const inner: string[] = [];
  let rest = '';
  const open = new RegExp(`<([a-z]+)[^>]*\\s${attr}[^>]*?(/?)>`, 'g');
  let cursor = 0, m: RegExpExecArray | null;

  while ((m = open.exec(html))) {
    if (m.index < cursor) continue;
    rest += html.slice(cursor, m.index);
    const tag = m[1];
    if (m[2] === '/') { cursor = open.lastIndex; continue; }   // self-closing

    const tags = new RegExp(`<(/?)${tag}\\b[^>]*?(/?)>`, 'g');
    tags.lastIndex = open.lastIndex;
    let depth = 1, t: RegExpExecArray | null, end = html.length;
    while ((t = tags.exec(html))) {
      if (t[2] === '/') continue;                              // self-closing
      depth += t[1] === '/' ? -1 : 1;
      if (depth === 0) { end = t.index; cursor = tags.lastIndex; break; }
    }
    inner.push(html.slice(open.lastIndex, end));
    open.lastIndex = cursor;
  }
  return { inner, rest: rest + html.slice(cursor) };
}

/** Each content item's words, sorted — so a reordered field passes and an
 *  added, dropped, or relocated word does not. Items stay in document order. */
function contentItems(page: string): string[] {
  return extractMarked(mainOf(page), 'data-content-item').inner
    .map(h => flatten(h).split(' ').sort().join(' '));
}

/** Everything that is not inside an item: the prose, in order, exactly. */
function mainText(page: string): string {
  return flatten(extractMarked(mainOf(page), 'data-content-item').rest);
}


/** The heading levels inside <main>, in order. */
function headingLevels(page: string): string[] {
  const html = readFileSync(join(DIST, page.slice(1)), 'utf8');
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? '';
  return [...main.matchAll(/<(h[1-6])\b/g)].map(m => m[1]);
}

/** Curated page path -> the same page in each theme. */
function copies(curated: string): [string, string][] {
  const rest = curated === '/index.html' ? '/index.html' : curated;
  return themeNames().map(t => [t, `/t/${t}${rest}`] as [string, string]);
}

test('every theme renders the same words in the same order', () => {
  const curatedPages = pages().filter(p => !p.startsWith('/t/') && p.endsWith('.html'));
  expect(curatedPages.length).toBeGreaterThan(5);

  const differences: string[] = [];
  for (const curated of curatedPages) {
    const expected = mainText(curated);
    const expectedItems = contentItems(curated).join(' | ');
    for (const [, copy] of copies(curated)) {
      if (!pages().includes(copy)) continue;      // 404 is not copied per theme
      if (mainText(copy) !== expected) differences.push(`${copy}: prose differs from ${curated}`);
      const items = contentItems(copy).join(' | ');
      if (items !== expectedItems) differences.push(`${copy}: items differ from ${curated}`);
    }
  }
  expect(differences, `a theme changed the content, not just the markup:\n${differences.join('\n')}`)
    .toEqual([]);
});

test('every theme keeps the same heading levels in the same order', () => {
  const curatedPages = pages().filter(p => !p.startsWith('/t/') && p.endsWith('.html'));
  for (const curated of curatedPages) {
    const expected = headingLevels(curated);
    for (const [, copy] of copies(curated)) {
      if (!pages().includes(copy)) continue;
      expect(headingLevels(copy), `${copy} changed the heading outline`).toEqual(expected);
    }
  }
});

test('a theme that declares a colour scheme actually ships it', () => {
  for (const theme of themeNames()) {
    const { scheme } = brief(theme);
    expect(['light', 'dark', 'light dark'], `${theme} must declare a scheme`).toContain(scheme);

    const css = readFileSync(`public/styles/${theme}.css`, 'utf8');
    expect(css, `${theme}.css should set color-scheme: ${scheme}`)
      .toContain(`color-scheme: ${scheme}`);

    // Declaring both schemes is a promise that every colour has both values.
    // A single-scheme theme has nothing to say about the other one.
    const usesLightDark = css.includes('light-dark(');
    expect(usesLightDark, `${theme} declares "${scheme}" but ${usesLightDark ? 'uses' : 'does not use'} light-dark()`)
      .toBe(scheme === 'light dark');
  }
});

test('the element escape hatch exists, and no theme needs it', () => {
  // Every theme currently overrides nothing. That is the healthy state: markup
  // that makes a claim belongs in a primitive variant, and markup that is a
  // styling hook belongs to every theme. If this ever fails, the question is
  // not "fix the test" — it is which of those two the new override should be.
  const src = readFileSync('src/lib/themes.ts', 'utf8');
  const overrides = [...src.matchAll(/elements: (\{[^}]*\})/g)].map(m => m[1].trim());
  expect(overrides.length).toBe(themeNames().length);
  expect(overrides.every(o => o === '{}'), `a theme is using the escape hatch: ${overrides}`)
    .toBe(true);

  // ...and the shared mapping still reaches the page in every theme.
  for (const theme of themeNames()) {
    const html = readFileSync(join(DIST, `t/${theme}/problems/index.html`), 'utf8');
    expect(html, `${theme} lost the shared <h2> mapping`).toContain('<span class="hed-text">');
  }
});

/* ---------------------------------------------------------------------------
 * The primitive vocabulary.
 *
 * A variant is a claim about what the content IS, so the test of a variant is
 * not "did the markup change" — it is "does a screen reader say something
 * different". These assert against the accessibility tree. If two variants
 * ever pass the same assertions, they are one variant and a token.
 * ------------------------------------------------------------------------ */

test('a theme may only name variants that exist', () => {
  const src = readFileSync('src/components/primitives/registry.ts', 'utf8');
  for (const theme of themeNames()) {
    const render = brief(theme).render ?? {};
    for (const [primitive, variant] of Object.entries(render)) {
      const declared = new RegExp(`^  '?${primitive}'?: \\{`, 'm');
      expect(declared.test(src), `${theme} names primitive "${primitive}", which no primitive declares`)
        .toBe(true);
      expect(src, `${theme}.render.${primitive} = "${variant}" is not a declared variant`)
        .toContain(`'${variant}':`);
    }
  }
});

test('no variant is called "default"', () => {
  const src = readFileSync('src/components/primitives/registry.ts', 'utf8');
  expect(src).not.toContain("'default'");
  expect(src).not.toContain('baseline: \'default\'');
});

test('chronology/date-keyed announces as a definition list', async ({ page }) => {
  await page.goto('t/paper/problems/');
  const dl = page.locator('dl.chronology-date-keyed');
  await expect(dl).toHaveCount(1);
  // seven spans of time, each paired with what happened in it
  await expect(dl.locator('dt')).toHaveCount(7);
  await expect(dl.locator('dd')).toHaveCount(7);
  await expect(page.locator('ol.chronology, table.chronology')).toHaveCount(0);
});

test('chronology/sequence announces as a counted, ordered list', async ({ page }) => {
  await page.goto('t/broadsheet/problems/');
  const ol = page.locator('ol.chronology-sequence');
  await expect(ol).toHaveCount(1);
  await expect(ol.getByRole('listitem')).toHaveCount(7);
  // an ordered list is a different role announcement than a definition list
  await expect(page.locator('dl.chronology, table.chronology')).toHaveCount(0);
});

test('chronology/comparable-rows announces as a table with real headers', async ({ page }) => {
  await page.goto('t/buff/problems/');
  const table = page.getByRole('table');
  await expect(table).toHaveCount(1);
  // column headers are what let a reader read down a column, and they are the
  // claim this variant makes that neither list does
  await expect(table.locator('thead th[scope="col"]')).toHaveCount(3);
  await expect(table.locator('tbody th[scope="row"]')).toHaveCount(7);
  await expect(table.getByRole('row')).toHaveCount(8);          // header + 7
  await expect(table.locator('caption')).toHaveCount(1);
  await expect(page.locator('dl.chronology, ol.chronology')).toHaveCount(0);
});

test('the three chronology variants are genuinely different to assistive tech', async ({ page }) => {
  const roles: Record<string, string[]> = {};
  for (const theme of ['paper', 'broadsheet', 'buff']) {
    await page.goto(`t/${theme}/problems/`);
    roles[theme] = await page.locator('.chronology').evaluateAll(els =>
      els.map(e => `${e.tagName.toLowerCase()}:${e.getAttribute('role') ?? 'implicit'}`));
  }
  // Same seven entries, three different things a reader is told they are.
  const shapes = Object.values(roles).map(r => r.join(','));
  expect(new Set(shapes).size, `variants collapsed to the same announcement: ${JSON.stringify(roles)}`)
    .toBe(3);
});

test('theme copy is labelled as the theme\'s own', () => {
  // The table variant adds words the content never wrote. Those are allowed,
  // but only because they say so — which is what keeps mainText() honest.
  const buff = readFileSync(join(DIST, 't/buff/problems/index.html'), 'utf8');
  const paper = readFileSync(join(DIST, 't/paper/problems/index.html'), 'utf8');
  expect(buff).toContain('<caption data-theme-copy>');
  expect(buff.match(/data-theme-copy/g)!.length).toBe(4);   // caption + 3 headers
  expect(paper).not.toContain('data-theme-copy');
});

test('every declared variant is claimed by some theme', () => {
  // A variant nothing uses is a claim nobody makes. Either a theme should take
  // it or it should not exist — dead vocabulary is how this layer rots.
  const src = readFileSync('src/components/primitives/registry.ts', 'utf8');
  const declared = [...src.matchAll(/^      '([a-z-]+)':/gm)].map(m => m[1]);
  const claimed = new Set(
    themeNames().flatMap(t => Object.values(brief(t).render ?? {}) as string[]));
  const orphans = [...new Set(declared)].filter(v => !claimed.has(v));
  expect(orphans, `no theme claims: ${orphans.join(', ')}`).toEqual([]);
});

test('problems variants make three different claims', async ({ page }) => {
  await page.goto('t/paper/');                          // peer-set
  await expect(page.locator('ul.problem-list-peer-set')).toHaveCount(1);
  await expect(page.locator('ul.problem-list-peer-set > li')).toHaveCount(4);

  await page.goto('t/buff/');                           // ranked-sequence
  await expect(page.locator('ol.problem-list-ranked-sequence')).toHaveCount(1);
  await expect(page.locator('ol.problem-list-ranked-sequence > li')).toHaveCount(4);

  await page.goto('t/broadsheet/');                     // lead-and-supporting
  const lead = page.locator('.problem-list-lead-and-supporting');
  await expect(lead.getByRole('article')).toHaveCount(1);
  await expect(lead.locator('ul.problem-support > li')).toHaveCount(3);
  // the lead is not announced as a list item, which is the whole claim
  await expect(lead.locator('> li')).toHaveCount(0);
  // ...and the heading outline the content wrote is untouched by all three
  await expect(page.locator('main h3')).toHaveCount(4);
});

test('posts, cases and case-meta variants change what is announced', async ({ page }) => {
  await page.goto('t/paper/writing/');
  await expect(page.locator('dl.post-list-date-keyed')).toHaveCount(3);
  await page.goto('t/broadsheet/writing/');
  await expect(page.locator('ul.post-list-title-led')).toHaveCount(3);
  await expect(page.locator('dl.posts')).toHaveCount(0);

  await page.goto('t/paper/problems/');
  await expect(page.locator('ul.case-list-peer-set')).toHaveCount(3);
  await page.goto('t/buff/problems/');
  await expect(page.locator('dl.case-list-annotated-index')).toHaveCount(3);

  await page.goto('t/paper/cases/cu-giving/');
  await expect(page.locator('dl.case-meta-field-pairs dt')).toHaveCount(3);
  await page.goto('t/broadsheet/cases/cu-giving/');
  // prose: no list to enter or exit at all
  await expect(page.locator('p.case-meta-inline-attribution')).toHaveCount(1);
  await expect(page.locator('.case-meta dl, .case-meta dt')).toHaveCount(0);
});

/* ---------------------------------------------------------------------------
 * The composer.
 *
 * A page declares its courses; the plan is computed from that menu and the
 * theme before anything renders. These hold the two halves together — the menu
 * has to describe the page the body actually serves, and the composition rule
 * has to be live code rather than a comment.
 * ------------------------------------------------------------------------ */

const COMPONENT_TO_PRIMITIVE: Record<string, string> = {
  Chronology: 'chronology', ProblemList: 'problems', PostList: 'posts',
  CaseList: 'cases', CaseMeta: 'case-meta',
};

function contentFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.mdx')) out.push(p);
    }
  };
  walk('src/content/pages');
  return out.sort();
}

test('every page menu describes the page the body actually serves', () => {
  for (const file of contentFiles()) {
    const src = readFileSync(file, 'utf8');
    const fm = src.match(/^---\n([\s\S]*?)\n---/)![1];
    const declared = (fm.match(/^courses:\s*\[(.*)\]/m)?.[1] ?? '')
      .split(',').map(s => s.trim()).filter(Boolean);

    const body = src.slice(src.indexOf('\n---', 3) + 4);
    const served = [...body.matchAll(/<(Chronology|ProblemList|PostList|CaseList|CaseMeta)[\s/>]/g)]
      .map(m => COMPONENT_TO_PRIMITIVE[m[1]]);

    expect(declared, `${file}: the menu and the body disagree`).toEqual(served);
  }
});

test('the composition rule is live code, not a comment', async () => {
  const { planFor } = await import('../src/lib/plan');

  // Two different primitives that would both announce as <dl> back to back.
  // paper claims cases=peer-set (ul) and posts=date-keyed (dl), so force the
  // collision directly: cases as annotated-index (dl) followed by posts (dl).
  const render = { cases: 'annotated-index', posts: 'date-keyed' };
  const plan = planFor(['cases', 'posts'], render);

  expect(plan[0].announces).toBe('dl');
  expect(plan[1].announces, 'the second course should have been moved off dl').not.toBe('dl');
  expect(plan[1].variant).toBe('title-led');
  expect(plan[1].because).toContain('would have announced as dl');

  // Repeats of the SAME primitive are left alone: three lists of posts should
  // look like three lists of posts.
  const repeats = planFor(['posts', 'posts', 'posts'], render);
  expect(repeats.map(c => c.variant)).toEqual(['date-keyed', 'date-keyed', 'date-keyed']);
});

test('the plan is a pure function of the menu and the theme', async () => {
  const { planFor } = await import('../src/lib/plan');
  const menu = ['problems', 'posts', 'chronology'];
  for (const theme of themeNames()) {
    const render = brief(theme).render;
    const once = JSON.stringify(planFor(menu, render));
    for (let i = 0; i < 5; i++) {
      expect(JSON.stringify(planFor(menu, render)), `${theme} planned differently`).toBe(once);
    }
  }
});

test('a page never serves two different kinds announcing the same way', async () => {
  const { planFor } = await import('../src/lib/plan');
  for (const file of contentFiles()) {
    const fm = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)![1];
    const menu = (fm.match(/^courses:\s*\[(.*)\]/m)?.[1] ?? '')
      .split(',').map(s => s.trim()).filter(Boolean);
    if (!menu.length) continue;

    for (const theme of themeNames()) {
      const plan = planFor(menu, brief(theme).render);
      for (let i = 1; i < plan.length; i++) {
        if (plan[i - 1].primitive === plan[i].primitive) continue;
        expect(plan[i].announces,
          `${file} in ${theme}: ${plan[i - 1].primitive} and ${plan[i].primitive} both announce as ${plan[i].announces}`)
          .not.toBe(plan[i - 1].announces);
      }
    }
  }
});

/* ---------------------------------------------------------------------------
 * design.json — the design system describing itself.
 *
 * An artifact that describes a build without being checked against it rots
 * quietly, and a rotten one is worse than none: the wizard would read it, and
 * "why is this a table here" would start answering wrong. So it is held to the
 * pages it claims to describe.
 * ------------------------------------------------------------------------ */

/** Where each primitive's rendered root announces its variant. */
const CLASS_PREFIX: Record<string, string> = {
  chronology: 'chronology', problems: 'problem-list', posts: 'post-list',
  cases: 'case-list', 'case-meta': 'case-meta',
};

const design = () => JSON.parse(readFileSync(join(DIST, 'design.json'), 'utf8'));

test('design.json describes every primitive, theme and page', () => {
  const d = design();
  const registry = readFileSync('src/components/primitives/registry.ts', 'utf8');

  expect(Object.keys(d.themes).sort()).toEqual(themeNames());
  for (const [name, p] of Object.entries<any>(d.primitives)) {
    expect(new RegExp(`^  '?${name}'?: \\{`, 'm').test(registry),
      `${name} is described but not declared`).toBe(true);
    for (const [variant, v] of Object.entries<any>(p.variants)) {
      expect(registry).toContain(`'${variant}': { announces: '${v.announces}'`);
      expect(v.claim.length, `${name}/${variant} has no claim`).toBeGreaterThan(20);
    }
  }
  // one entry per content page
  expect(d.pages.map((p: any) => p.slug)).toContain('problems');
  expect(d.pages.length).toBe(contentFiles().length);
});

test('design.json is reproducible — no build-varying values', () => {
  const raw = readFileSync(join(DIST, 'design.json'), 'utf8');
  // a timestamp would make every build a diff and every diff meaningless
  expect(raw).not.toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  expect(raw).not.toMatch(/"(generated|built|timestamp|date)"/);
  // stable ordering, so two builds of the same input are byte-identical
  const d = JSON.parse(raw);
  expect(Object.keys(d.themes)).toEqual([...Object.keys(d.themes)].sort());
  expect(d.pages.map((p: any) => p.slug))
    .toEqual([...d.pages.map((p: any) => p.slug)].sort());
});

test('design.json matches the HTML it describes, page by page and theme by theme', () => {
  const mismatches: string[] = [];

  for (const page of design().pages) {
    for (const [theme, plan] of Object.entries<any[]>(page.plans)) {
      if (!plan.length) continue;
      const file = page.slug === 'index'
        ? `t/${theme}/index.html`
        : `t/${theme}/${page.slug}/index.html`;
      const html = readFileSync(join(DIST, file), 'utf8');

      // what the page actually served, in document order. A root carries its
      // variant in a class, but not necessarily as the last one — the problem
      // list also carries `wide` — so match inside the attribute, not at its end.
      const prefixes = [...new Set(Object.values(CLASS_PREFIX))].join('|');
      const served = [...html.matchAll(
        new RegExp(`class="[^"]*?\\b(${prefixes})-([a-z][a-z-]*)`, 'g'))]
        .map(m => `${m[1]}-${m[2]}`);

      const claimed = plan.map(c => `${CLASS_PREFIX[c.primitive]}-${c.variant}`);
      if (served.join(' ') !== claimed.join(' ')) {
        mismatches.push(`${file}\n  design.json says: ${claimed.join(' ')}\n  page serves:      ${served.join(' ')}`);
      }
    }
  }
  expect(mismatches, `design.json has drifted from the build:\n${mismatches.join('\n')}`)
    .toEqual([]);
});

/* ---------------------------------------------------------------------------
 * Contrast.
 *
 * Accessibility is part of what this site claims to be good at, so the themes
 * are held to WCAG AA rather than eyeballed. Measured from computed styles in
 * a real browser, because the colours come through light-dark() and var()
 * chains that no static reading of the CSS would resolve correctly.
 * ------------------------------------------------------------------------ */

const AA_NORMAL = 4.5;

test('every theme clears WCAG AA in every scheme it claims', async ({ page }) => {
  const failures: string[] = [];

  for (const theme of themeNames()) {
    const schemes = brief(theme).scheme === 'light dark'
      ? (['light', 'dark'] as const)
      : ([brief(theme).scheme] as ('light' | 'dark')[]);

    for (const scheme of schemes) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(`t/${theme}/`);

      const measured = await page.evaluate(() => {
        const lum = (c: string) => {
          const [r, g, b] = c.match(/\d+(\.\d+)?/g)!.slice(0, 3).map(Number)
            .map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const ratio = (a: string, b: string) => {
          const [x, y] = [lum(a), lum(b)];
          return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2);
        };
        // walk up for the nearest painted background, since cards sit on
        // --paper-warm rather than on the page
        const groundOf = (el: Element): string => {
          for (let n: Element | null = el; n; n = n.parentElement) {
            const bg = getComputedStyle(n).backgroundColor;
            if (bg && !/rgba?\([^)]*,\s*0\)/.test(bg)) return bg;
          }
          return getComputedStyle(document.body).backgroundColor;
        };
        // small text only: large text has a lower bar and would hide failures
        const samples: Record<string, string> = {
          body: 'main p', muted: '.evidence', link: 'main a', colophon: '.colophon a',
        };
        const out: Record<string, number> = {};
        for (const [name, sel] of Object.entries(samples)) {
          const el = document.querySelector(sel);
          if (!el) continue;
          out[name] = ratio(getComputedStyle(el).color, groundOf(el));
        }
        return out;
      });

      for (const [what, value] of Object.entries(measured)) {
        if (value < AA_NORMAL) failures.push(`${theme}/${scheme} ${what}: ${value}:1`);
      }
    }
  }

  await page.emulateMedia({ colorScheme: null });
  expect(failures, `below WCAG AA (${AA_NORMAL}:1):\n${failures.join('\n')}`).toEqual([]);
});
