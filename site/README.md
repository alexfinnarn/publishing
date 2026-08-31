# Site

The consulting website. Astro, static output, one island.

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # -> dist/
npm run serve          # build, then serve dist/ on 4321 (what ships)
npm test               # Playwright, against the build
npm run check          # astro check
```

### If `npm run dev` looks like it failed

Astro 7's dev server can run as a **background daemon**. When it does, the
command prints a pid and returns to your prompt immediately — it did not
crash. Running it again then reports *"Dev server already running"*, which
reads like a port error but is not.

```bash
npm run dev:status     # is one running, and on what pid
npm run dev:stop       # stop it
npm run dev:logs       # tail its output
```

If a stale one is wedged, `npm run dev:stop` is the fix; failing that,
`lsof -ti:4321 | xargs kill`. The same applies to `astro preview`, which is
why the test suite uses `scripts/serve.mjs` on its own port instead.

## How it is put together

| Path | What it is |
|------|------------|
| `src/content/pages/**.mdx` | The pages. Theme-agnostic — nothing here knows how it will look |
| `src/content.config.ts` | The frontmatter schema. A typo fails the build rather than rendering oddly |
| `public/styles/<theme>.css` | A theme's tokens and character |
| `src/themes/<theme>.json` | That theme's design and language targets, in prose |
| `src/styles/base.css` | Structure only. Grid, chrome, components, accessibility. Defines no colours |
| `src/layouts/Page.astro` | Picks the stylesheet and chrome for a theme |
| `src/components/` | Chrome, `Link`, and `CareerBlob` (the island) |
| `src/pages/` | Routing. See below |
| `tests/` | Playwright |

## Two output shapes

- **`/`, `/problems/`, `/cases/…`** — the curated site. Each page in the theme
  its frontmatter names: Home is `broadsheet`, the CU case studies are `buff`,
  the VA one is `federal`, the rest `paper`. This is what a stranger gets.
- **`/t/<theme>/…`** — the whole site in one theme, for every theme.

Both come from the same content entries. `src/pages/[...slug].astro` renders
the curated copy; `src/pages/t/[theme]/[...slug].astro` does the cross product
in `getStaticPaths`. Home has its own route because Astro normalises
`/x/index` to `/x/`, which a catch-all param cannot match.

`THEME_PREFIX` in `src/lib/site.ts` must match the directory name under
`src/pages/` — Astro route directories are static, so changing it means
renaming `src/pages/t/` too.

## Links inside content

Content writes ordinary root-absolute links: `[the work](/problems/)`.
`src/components/Link.astro` is mapped over both markdown links and literal
`<a>` elements in MDX, and prefixes them with the current theme's base — so a
reader stays in whichever theme they are reading. The base is derived from the
URL being rendered, which keeps the component self-contained.

MDX matters here: a plain `.md` file passes raw HTML straight through without
element mapping, so links inside raw blocks would silently escape the theme.

## Themes

A theme is two files: `public/styles/<name>.css` and `src/themes/<name>.json`.
The stylesheet must define every token listed at the top of `src/styles/base.css`
— a test enforces that. The JSON carries a **design target** and a **language
target** in prose; nothing in the build reads it beyond `label`. It is the
brief for whoever, or whatever, authors the next page or theme.

Theme CSS lives in `public/` rather than `src/` on purpose: each page links
exactly one theme stylesheet, so bundling all four together would defeat it.

`broadsheet` also overrides the chrome (centred masthead, dateline) and turns
Home into a lead-story layout via `[data-page="index"]`. That is CSS Grid
placement only — the markup is identical in every theme and DOM order is
untouched, so reading and focus order still follow the content.

## The island

`CareerBlob` on `/problems/` is the site's only interactive component. Six
career stages, each described as numbers — how many lobes, how far they push
out, how big — so any two shapes interpolate cleanly without a path-morphing
library. Facts come from `../inventory.md`.

It is `client:visible`, so **5 of 45 pages ship any JavaScript** and the SVG
renders server-side: the shape is there before React is, and without it. The
stage buttons are hidden when JS is unavailable rather than offered dead, and
the same chronology is on the page as text either way.

## Rules that are actually rules

**Static host.** No application server rendering a document per request.

**The default stands with JS off.** Islands are the deliberate exception, one
component at a time. A test asserts how many pages ship JavaScript, so adding
more is a decision rather than a drift.

**Do not invent proof.** No fake clients, metrics, headshots, testimonials, or
a contact path that goes nowhere. Case studies are built only from facts in
`../inventory.md`; each opens with a comment naming what would deepen it.

## Testing

`npm test` builds, serves `dist/` with `scripts/serve.mjs`, and runs
Playwright against it. Tests run against the **build**, never the dev server —
under Vite HMR and React dev mode the island behaves differently, which is a
good way to waste an afternoon. That is why the suite uses its own port and
never reuses a running server.

What is covered: link integrity across all 45 pages, the JavaScript budget,
one theme stylesheet per page, theme-scoped links in both directions, the
theme token contract, the switcher, static accessibility checks, and the
island (hydration, morphing, reduced motion, hidden tab, no-JS fallback).
