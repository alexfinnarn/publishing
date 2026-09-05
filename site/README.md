# Site

The consulting website. Astro, static output, one island.

```bash
npm install
npm run dev            # http://localhost:4321/publishing/
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
| `src/content/pages/**.mdx` | The pages: prose, data, and a menu of courses. Theme-agnostic — nothing here knows how it will look |
| `src/components/primitives/` | The primitive vocabulary and its variants |
| `src/lib/plan.ts` | The composer: menu + theme → what each course will be |
| `src/pages/design.json.ts` | The design system describing itself, emitted at `/design.json` |
| `src/content.config.ts` | The frontmatter schema. A typo fails the build rather than rendering oddly |
| `public/styles/<theme>.css` | A theme's tokens and character |
| `src/themes/<theme>/` | The rest of the theme: its brief, and any chrome or elements it overrides |
| `src/lib/themes.ts` | The theme registry, and the element map each theme renders content through |
| `src/styles/base.css` | Structure only. Grid, chrome, components, accessibility. Defines no colours |
| `src/layouts/Page.astro` | Assembles a page from the theme's parts |
| `src/components/` | Chrome, `Link`, and `CareerBlob` (the island) |
| `src/pages/` | Routing. See below |
| `site.config.mjs` | Where the site is published: origin and base path |
| `tests/` | Playwright |

## One version of each page

Every page ships once, in the theme its frontmatter names: Home is
`broadsheet`, the CU case studies are `buff`, the VA one is `federal`, the rest
`paper`. `src/pages/[...slug].astro` renders them; Home has its own route
because Astro normalises `/x/index` to `/x/`, which a catch-all param cannot
match.

A theme is a property of a page, not a costume the reader chooses. There is no
switcher, and no second copy of the site to switch to.

### The theme fixture

The contract underneath the primitives — *a theme may choose the tags, never
the words or their order* — can only be checked by rendering the same content
more than one way. So the routes under `src/pages/t/[theme]/` still exist and
still build every page in every theme, but **only when `THEME_MATRIX` is set**:

```bash
npm run build          # 9 pages. What deploys.
npm run build:matrix   # 45 pages. What the tests run against.
```

Keep the property, drop the URLs. A test builds the deploy way, into a
throwaway directory, and fails if a single `/t/` page appears or if any page
still carries a switcher — an actual production build rather than a grep over
the workflow file.

Both build scripts clear `dist` first. Astro does not empty it, so a production
build on top of a matrix build would otherwise leave 36 orphaned fixture pages
sitting in the deploy — the same stale-output failure this project has hit
before.

`THEME_PREFIX` in `src/lib/site.ts` must match the directory name under
`src/pages/` — Astro route directories are static, so changing it means
renaming `src/pages/t/` too.

## Where it is published

`site.config.mjs` holds the two facts about the deploy, and it is the only
place that holds them:

```js
export const SITE = 'https://alexfinnarn.github.io';
export const BASE = '/publishing';
```

Today that is a GitHub Pages **project** site, so everything is served from
`/publishing/`. `.github/workflows/deploy.yml` builds and publishes on every
push to `main` that touches `site/` (Pages must be set to "GitHub Actions" as
its source once, in the repository settings). `ci.yml` runs `astro check`, the
build, and the tests on the same push, so the deploy workflow does not repeat
them.

Launch — a real domain at the root — is `BASE = ''` and a new `SITE` here, plus
a `CNAME`. Nothing else moves: `astro.config.mjs`, the canonical and `og:`
URLs, `scripts/serve.mjs`, and the Playwright `baseURL` all read these.

Astro only rewrites the URLs *it* generates. Every root-absolute URL written
by hand goes through `withBase()` in `src/lib/site.ts`, and a test fails any
`href` in the output that is missing the base path — that failure mode is
invisible locally at the root and total on the live site.

## Search engines and sharing

Each page carries a canonical URL, `og:` and `twitter:` tags, and a favicon.
Every page has one address, so nothing competes with anything. The 404 carries
`robots: noindex, follow` because it is not an address; the fixture copies
carry it too, and are filtered out of the sitemap (`@astrojs/sitemap`, at
`/publishing/sitemap-index.xml`), so a stray matrix build cannot be crawled.

There is no `robots.txt`: crawlers only read one at a domain root, and this
site does not own `alexfinnarn.github.io/`. It becomes worth adding at launch.

## Links inside content

Content writes ordinary root-absolute links: `[the work](/problems/)`.
`src/components/Link.astro` is mapped over both markdown links and literal
`<a>` elements in MDX, and prefixes them with the deploy's base path. Astro
only rewrites the URLs it generates itself, so a hand-written root-absolute
href 404s on a project site without this — a failure that is invisible locally
at the root and total live, which is why a test fails any href in the output
that is missing the base.

MDX matters here: a plain `.md` file passes raw HTML straight through without
element mapping, so links inside raw blocks would silently lose the base path.

## Themes

For a hands-on walkthrough, start with [Build your first theme](THEME-TUTORIAL.md).
It follows the same brief, implementation, and verification loop used by an agent.

Theme authoring is being exercised with a [provisional worksheet](src/themes/DESIGN.template.md).
The first [broadsheet brief](src/themes/broadsheet/DESIGN.md) and
[exercise record](src/themes/broadsheet/EXERCISE.md) distinguish intended design,
observed behavior, and one verified extension. These are authoring documents,
not additional build inputs or a required schema for every theme.

A theme is a directory, `src/themes/<name>/`, plus a stylesheet at
`public/styles/<name>.css`. Only two files are required:

| File | What it is |
|------|------------|
| `public/styles/<name>.css` | Tokens and character. Must define every token listed at the top of `src/styles/base.css`, and set `color-scheme` to the `scheme` it declares |
| `<name>/theme.json` | The brief: `label`, `scheme`, and a **design target** and **language target** in prose |
| `<name>/Chrome.astro` | *Optional.* Everything above `<main>`, when the furniture has to change shape |
| `<name>/elements.ts` | *Optional.* MDX element overrides — the theme's own markup for `h2`, `blockquote`, and so on |

Nothing in the build reads `design` or `language`; they are the brief for
whoever, or whatever, authors the next page or theme. `label` and `scheme` are
load-bearing. Themes are registered explicitly in `src/lib/themes.ts`, so a
missing file is a build error rather than a theme that silently renders as
`paper`.

Theme CSS lives in `public/` rather than `src/` on purpose: each page links
exactly one theme stylesheet, so bundling all four together would defeat it.

### Primitives and variants

Content hands components **data**, never markup. A **primitive** is a content
noun; a **variant** is a claim about what that content IS.

| Primitive | Variants | What each claims |
|---|---|---|
| `chronology` | `date-keyed` · `sequence` · `comparable-rows` | `<dl>` look it up by when · `<ol>` the order is the information · `<table>` read down a column |
| `problems` | `peer-set` · `lead-and-supporting` · `ranked-sequence` | four equals · one story with three under it · the order is an argument |
| `posts` | `date-keyed` · `title-led` | an archive · a reading list |
| `cases` | `peer-set` · `annotated-index` | further pages · context that belongs to the case |
| `case-meta` | `field-pairs` · `inline-attribution` | fields to look up · a sentence to read |

Two rules keep this from decaying into a second styling system, and both are
tested:

**A variant must change what a screen reader says.** Not "must change the
markup" — every variant is asserted against the accessibility tree it produces,
and one test fails if two ever collapse to the same announcement. If the only
difference is a class name, it is one variant and a token, and it belongs in
CSS.

**No variant is called `default`.** If a primitive's baseline claim cannot be
named, the primitive does not know what it is yet. There is a test for that
too, and another that fails on vocabulary no theme claims.

### The composer

A page declares its **menu** in frontmatter — the courses it serves, in order:

```yaml
courses: [cases, cases, cases, chronology]
```

`src/lib/plan.ts` turns that menu plus the theme's `render` map into a decision
per course **before anything renders**. That timing is not a preference: Astro
may render components concurrently, so a plan gathered as components render
would differ between builds. `planFor()` is a pure function of (menu, theme),
and a test runs it repeatedly to prove it.

One composition rule is in place: two **different** primitives sitting next to
each other and announcing identically is the ensemble failing — a reader meets
two definition lists in a row and learns nothing from the change. When that
would happen the second course moves to a variant with a different root
element. Repeats of the *same* primitive are left alone; three lists of posts
should look like three lists of posts.

With the current four themes the rule never actually fires — the themes'
standing choices already vary enough. A test exercises it on a synthetic
collision so it stays live code rather than a comment, and another asserts no
real page and theme combination trips it.

A test also holds the menu to the body: `courses` has to name exactly what the
page serves, in order.

### design.json

Everything this site decides about presentation is already a value — the
vocabulary, each variant's claim and what it announces as, a theme's standing
choices, the plan for every page. So the build emits it at `/design.json`.

It answers three things:

- **"Why is this a table here."** The plan knows, including `because` when a
  composition rule overrode the theme's standing choice.
- **What a theme-builder may legally offer.** The vocabulary plus what each
  choice claims, which is exactly what a form over `theme.json` needs.
- **The content/presentation split, inspectable.** A stranger can read the
  system rather than take the claim on faith.

It is checked against the build rather than maintained alongside it: one test
walks every page in every theme and asserts that what `design.json` says the
page serves is what the HTML actually serves, in order. An artifact that
describes a build without being held to it rots quietly, and a rotten one is
worse than none — the builder would read it and the "why" would start
answering wrong.

It carries no timestamp and sorts everything by name, so two builds of the same
input are byte-identical. A test enforces both.

### Contrast

Every theme is held to WCAG AA (4.5:1) for small text, in every colour scheme
its brief claims, measured from computed styles in a real browser — the colours
arrive through `light-dark()` and `var()` chains that no static reading of the
CSS resolves correctly. Body copy, muted text, links, and the colophon are
sampled against the nearest painted background, so cards sitting on
`--paper-warm` are checked on that rather than on the page.

### What a theme may change

**A theme picks the tags. It never picks the words or their order.**

That is the whole contract, and it is enforced rather than trusted. Two tests
render every page in every theme and assert that the text inside `<main>` is
identical in the same sequence, and that the heading outline matches. A theme
can wrap, retag, and restructure as much as it likes; the moment it changes
what the page says, or the order it says it in, the build fails.

The limit is what keeps the content portable to whatever comes next, and what
keeps reading and focus order following the content rather than the design.

Three themes use the plain masthead and the default elements. `broadsheet`
uses both escapes:

- **Chrome:** a centred masthead, a utility bar, and a dateline.
- **Elements:** its own `<h2>`, which wraps the headline text in a span. That
  is not decoration — an `<h2>` is a grid child, so it stretches to its column
  and a rule drawn on it runs the full width however short the headline is.
  The span shrink-wraps the words so the rule can hug them and wrap with them.
  No selector can do this to the `<h2>` itself. It is the same box-versus-content
  mismatch that `--headline-measure` exists to work around for `<h1>`.

`broadsheet` also turns Home into a lead-story layout via `[data-page="index"]`,
which is CSS Grid placement only.

### Light and dark

`paper` is the only theme that adapts to the reader: `color-scheme: light dark`
and every colour written as `light-dark()`. It is the theme with no institution
to be faithful to.

The other three are single-scheme **on purpose**, and their briefs say why. A
front page is ink on newsprint; CU gold and VA navy are institutional palettes
with no dark variant, and inventing one would be inventing the client. A test
holds each stylesheet to the `scheme` its brief declares, in both directions —
a theme claiming both schemes must use `light-dark()`, and one claiming a
single scheme must not.

## The island

`CareerBlob` on `/problems/` is the site's only interactive component. Six
career stages, each described as numbers — how many lobes, how far they push
out, how big — so any two shapes interpolate cleanly without a path-morphing
library. Facts come from `../inventory.md`.

It is `client:visible`, so **one deployed page ships any JavaScript** and the SVG
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

What is covered: that what deploys is one version of each page with no fixture
and no switcher, link integrity across every built page (including that each
carries the base path, and that nothing links into the fixture), the JavaScript
budget, one theme stylesheet per page, the theme token contract, canonical
URLs and `noindex`, the sitemap's contents,
static accessibility checks, the theme contract (same words in the same order
and the same heading outline in every theme, the declared colour scheme, and
that element overrides actually reach the page), and the island (hydration,
morphing, reduced motion, hidden tab, no-JS fallback).
