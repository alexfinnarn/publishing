#!/usr/bin/env node
/* Build: content/*.md × themes/* -> static HTML.
 *
 * Output has two shapes:
 *
 *   /<page>.html               the CURATED site. Each page in the theme its
 *                              frontmatter names. This is what a stranger gets.
 *   /t/<theme>/<page>.html     the WHOLE site in one theme, for every theme.
 *
 * The `t/` namespace keeps theme directories from sitting at the site root
 * where they read like pages. Change it with THEME_PREFIX below or the
 * environment variable of the same name; set it empty to put themes at the
 * root again.
 *
 * Because each theme holds a complete copy at its own depth, ordinary
 * relative links stay inside the current theme with no rewriting. Only the
 * theme switcher needs computed paths.
 *
 * Content is theme-agnostic markdown. A theme supplies tokens (theme.css),
 * optional chrome overrides (head.html / foot.html), and a theme.json
 * describing its design and language targets — that file is written for
 * whoever (or whatever) adds the next page.
 *
 * Nothing runs at request time.
 */
import { marked } from 'marked';
import fs from 'node:fs';
import path from 'node:path';

/* Where the per-theme copies of the site live, below the site root.
   Empty string puts them at the root. */
const THEME_PREFIX = process.env.THEME_PREFIX ?? 't';

const root    = path.dirname(new URL(import.meta.url).pathname);
const CONTENT = path.join(root, 'content');
const THEMES  = path.join(root, 'themes');
const PARTS   = path.join(root, 'parts');

marked.setOptions({ mangle: false, headerIds: false });

/* --- frontmatter ------------------------------------------------------- */
function frontmatter(src) {
  if (!src.startsWith('---')) return [{}, src];
  const end = src.indexOf('\n---', 3);
  if (end === -1) return [{}, src];
  const data = {};
  for (const line of src.slice(4, end).split('\n')) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) data[m[1]] = m[2].trim().replace(/^["'](.*)["']$/, '$1');
  }
  return [data, src.slice(end + 4).replace(/^\n/, '')];
}

/* --- themes ------------------------------------------------------------ */
const themes = fs.readdirSync(THEMES, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => {
    const dir = path.join(THEMES, e.name);
    const read = f => fs.existsSync(path.join(dir, f))
      ? fs.readFileSync(path.join(dir, f), 'utf8') : null;
    const meta = JSON.parse(read('theme.json') || '{}');
    return {
      name: e.name,
      label: meta.label || e.name,
      themeable: meta.themeable !== false,
      head: read('head.html') || fs.readFileSync(path.join(PARTS, 'head.html'), 'utf8'),
      foot: read('foot.html') || fs.readFileSync(path.join(PARTS, 'foot.html'), 'utf8'),
    };
  });
const byName = Object.fromEntries(themes.map(t => [t.name, t]));

/* Output directory for a theme's full copy of the site. */
const themeDir = t => THEME_PREFIX ? `${THEME_PREFIX}/${t.name}` : t.name;

/* --- pages ------------------------------------------------------------- */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name))
    : e.name.endsWith('.md') ? [path.join(dir, e.name)] : []);
}

const pages = walk(CONTENT).sort().map(file => {
  const rel = path.relative(CONTENT, file).replace(/\.md$/, '.html');
  const [fm, md] = frontmatter(fs.readFileSync(file, 'utf8'));
  return { rel, fm, md };
});

/* --- render ------------------------------------------------------------ */
function emit(page, theme, prefix) {
  const { rel, fm, md } = page;
  const out    = path.join(root, prefix, rel);
  // depth below the site root, for assets
  const depth  = (prefix ? prefix.split('/').length : 0) + rel.split('/').length - 1;
  const ROOT   = '../'.repeat(depth);
  // Back to the root of the CURRENT theme's copy. Nav and in-content links
  // use this, so navigation never leaves the theme you are reading in.
  const HOME   = '../'.repeat(rel.split('/').length - 1);
  // ROOT already walks back to the site root, so the same page in another
  // theme is just ROOT + theme + rel. The curated copy is ROOT + rel.
  const link = (href, label, current) =>
    `<li><a href="${href}"${current ? ' aria-current="true"' : ''}>${label}</a></li>`;

  const switcher = [
    link(`${ROOT}${rel}`, 'Curated', prefix === ''),
    ...themes.filter(t => t.themeable)
      .map(t => link(`${ROOT}${themeDir(t)}/${rel}`, t.label, prefix === themeDir(t))),
  ].join('\n        ');

  // Path vars must be substituted BEFORE markdown parsing: marked
  // percent-encodes braces inside [text](...) link syntax, so {{HOME}}
  // survives in raw HTML blocks but not in markdown links.
  const paths = s => s.replace(/\{\{(ROOT|HOME|THEME)\}\}/g,
    (_, k) => ({ ROOT, HOME, THEME: theme.name })[k]);

  const slot = (k, cls) => fm[k] ? `<p class="${cls}">${marked.parseInline(paths(fm[k]))}</p>` : '';

  const body = [
    slot('kicker', 'kicker'),
    fm.title ? `<h1>${marked.parseInline(paths(fm.title))}</h1>` : '',
    slot('dek', 'lede'),
    marked.parse(paths(md)),
  ].filter(Boolean).join('\n');

  const slug = rel.replace(/\.html$/, '').replace(/\//g, '-');
  const vars = {
    PAGE: slug,
    BUILD_DATE: new Date().toLocaleDateString('en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }),
    TITLE: fm.head_title || `${(fm.title || 'Alex Finnarn').replace(/<[^>]+>/g, '')} — Alex Finnarn`,
    DESC: fm.description || '',
    ROOT, HOME, THEME: theme.name, THEME_LABEL: theme.label,
    THEME_SWITCHER: switcher, BODY: body,
    CUR_PROBLEMS: fm.nav === 'problems' ? ' aria-current="page"' : '',
    CUR_ABOUT:    fm.nav === 'about'    ? ' aria-current="page"' : '',
    CUR_WRITING:  fm.nav === 'writing'  ? ' aria-current="page"' : '',
    CUR_CONTACT:  fm.nav === 'contact'  ? ' aria-current="page"' : '',
  };
  const fill = s => s.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, fill(theme.head) + fill(body) + fill(theme.foot));
  written.push(path.relative(root, out));
}

/* --- go ---------------------------------------------------------------- */
/* Clean up exactly what the previous build wrote, then record this one.
   Going by a manifest rather than by the current THEME_PREFIX means changing
   the prefix does not orphan the old directories. */
const MANIFEST = path.join(root, '.build-manifest.json');
const written = [];

if (fs.existsSync(MANIFEST)) {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).files || [];
  for (const f of prev) fs.rmSync(path.join(root, f), { force: true });
  // prune directories the removals emptied, deepest first
  const dirs = [...new Set(prev.map(f => path.dirname(f)).filter(d => d !== '.'))];
  for (const d of dirs.sort((a, b) => b.length - a.length)) {
    let cur = d;
    while (cur && cur !== '.') {
      try { fs.rmdirSync(path.join(root, cur)); } catch { break; }
      cur = path.dirname(cur);
    }
  }
}

console.log('curated site (per-page theme):');
for (const p of pages) {
  const t = byName[p.fm.theme || 'paper'];
  if (!t) throw new Error(`${p.rel}: unknown theme "${p.fm.theme}"`);
  emit(p, t, '');
  console.log(`  /${p.rel.padEnd(28)} ${t.label}`);
}

console.log('\nfull site per theme:');
for (const t of themes) {
  for (const p of pages) emit(p, t, themeDir(t));
  console.log(`  /${themeDir(t)}/`.padEnd(31) + `${pages.length} pages`);
}

fs.writeFileSync(MANIFEST, JSON.stringify({ themePrefix: THEME_PREFIX, files: written }, null, 2) + '\n');

console.log(`\ndone. ${pages.length} pages × ${themes.length} themes + curated = ${written.length} files.`);
