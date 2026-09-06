# AGENTS.md

Notes for coding agents working in this repo. These can change as we learn
what works for this project.

This repository is to help me get back to publishing content on the web: a
consulting site, the writing that comes out of the same work, and maybe a book
later. My old blog is a separate thing at `~/Sites/personal/content`
(https://alexfinnarn.github.io/).

## How I want you to work with me

Use my current direction in conversation when it differs from these notes or
other repo docs, and update the relevant docs to match. I expect to try ideas,
change my mind, and sometimes replace working code or terminology. Explain
any practical consequences so we can work through them.

Use my edits as a guide to how I write: plain sentences, first person when
speaking for me, and an acknowledgment when something is unsettled. A lot of
the prose in this repo was generated from my prompts and reads like a
manifesto — short declarative fragments,
verdicts, rules. I rewrote several files in September 2026 to get rid of that.
Keep that in mind when drafting or editing.

Only describe a rule as decided when I have actually agreed to it. I caught
a doc saying issues carry only three labels and "nothing else," and another
saying to add a fifth reference site "only when
one of these stops teaching." I never decided either of those. If something
hasn't been decided, write that it hasn't been decided.

When missing information about my career, plans, or reasons affects the
result, ask. If the detail isn't needed for the task, leave it out and continue.
Phrases like "that is context, not a branding story unless we choose it" can
hide a gap in understanding instead of helping us resolve it.

Offer your interpretation and explain what supports it, while distinguishing
it from my stated views and the underlying facts. Check with me before
writing your conclusions into docs as though I decided them.

I'd like room to revisit options as the project develops. Recommendations
are useful; describe their reasons and tradeoffs without turning them into
boundaries I haven't chosen.

We keep the working record in GitHub issues, at
https://github.com/alexfinnarn/publishing/issues — so ephemeral planning stays
out of the durable docs and code. Labels are `site`, `writing`, `discovery`,
loosely used.

## Facts about me

Start with [inventory.md](inventory.md) for facts about my career. It is still
incomplete and I am filling it in. You can also use information I supply in
conversation or source documents, such as a résumé.

Use supported facts for case studies and other public content. Clients,
metrics, testimonials, and headshots should be real, and contact links should
work. Ask about missing facts when they are needed rather than inventing them.

## Layout

| Path | What |
|---|---|
| `site/` | The consulting site. Astro, static, deployed to GitHub Pages |
| `themes/` | Theme as an abstract idea, independent of any framework |
| `writing/` | Drafts |
| `books/` | Empty for now |
| `references/` | Notes on other sites, rhetoric |
| `inventory.md` | Career information collected so far |

The prose in `themes/` and `site/` is still in the generated voice and I am
reviewing it myself. Its framing is provisional. Check technical claims
against the code and relevant tests when relying on them for a task.

## The site

```bash
cd site
npm install
npm run dev            # http://localhost:4321/publishing/
npm run build          # 9 pages — what deploys
npm run build:matrix   # 45 pages — the test fixture
npm test               # Playwright, against the build
npm run check          # astro check
```

Astro 7's dev server can run in the background, so `npm run dev` may print a
pid and return while the server continues running. Use `npm run dev:status`
to check it, `npm run dev:logs` to read logs, and `npm run dev:stop` to stop it.
The current tests run against a build served by `scripts/serve.mjs`.

### Current site implementation

These describe the current implementation and its tests. If an experiment
changes one of these assumptions, update the relevant code, tests, and docs
together. The broader theme concept below also includes composition and
expression.

- Site themes choose markup while preserving content. Tests render every page
  in every theme and compare text and heading outline, with allowances for
  field ordering within content items.
- One version of each page ships, in the theme its frontmatter names. The
  `/t/<theme>/` routes exist only under `THEME_MATRIX=1` as a test fixture.
- Content passes data to components. Primitives represent kinds of content;
  variants express semantic differences checked through accessibility tests.
  Visual differences alone are handled through CSS tokens.
- The site uses static hosting and provides usable content with JavaScript
  disabled. `CareerBlob` on `/problems/` is currently the one island; a test
  checks which pages include islands.
- The site is served from `/publishing/`. Use `withBase()` in
  `src/lib/site.ts` for hand-written root-absolute URLs so they include that
  prefix. A missing prefix can break deployed links. The origin and base path
  are configured in `site/site.config.mjs`.
- `/design.json` describes the design system and is checked against the build.

CI (`.github/workflows/ci.yml`) runs `astro check`, the build, and Playwright on
every PR and push to `main`. `deploy.yml` publishes on pushes to `main` that
touch `site/`.

## Themes as a concept

[themes/README.md](themes/README.md) defines a theme as a reusable
communication policy: **material** (facts and their relationships) plus a
**communication brief** (audience and purpose) plus a **theme** (rules for
composing and presenting) produce a **publication**. The site implements only
part of that. Use the broader definition when exploring themes beyond the
current Astro implementation.
