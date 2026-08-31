# Site

The consulting website. Content is markdown; presentation is themes.

```bash
node build.mjs        # writes 45 static HTML files
npx serve -l 4321 .
```

## How it is put together

| Path | What it is |
|------|------------|
| `content/**.md` | The pages. Theme-agnostic. Frontmatter + markdown (raw HTML blocks allowed) |
| `themes/<name>/` | `theme.css` (tokens + character), `theme.json` (design and language targets), optional `head.html` / `foot.html` chrome overrides |
| `css/base.css` | Structure only. The grid, chrome, components, accessibility. Consumes theme tokens, defines no colors |
| `parts/` | Default chrome, used by any theme that does not override it |
| `build.mjs` | Markdown × themes → HTML. Nothing runs at request time |

## Two output shapes

- **`/<page>.html`** — the curated site. Each page in the theme its
  frontmatter names: Home is `broadsheet`, the CU case studies are `buff`,
  the VA one is `federal`, everything else `paper`. This is what a stranger
  gets.
- **`/t/<theme>/<page>.html`** — the whole site in one theme, for every
  theme. The `t/` namespace keeps theme directories off the site root, where
  `paper/` and `buff/` would read like pages. Change it with `THEME_PREFIX`
  at the top of `build.mjs` or as an environment variable:

  ```bash
  THEME_PREFIX=preview node build.mjs   # -> /preview/<theme>/
  THEME_PREFIX= node build.mjs          # -> /<theme>/ at the root
  ```

  The build records what it wrote in `.build-manifest.json` (gitignored) and
  clears exactly that on the next run, so changing the prefix moves the
  output rather than leaving the old directories orphaned.

Because each theme holds a complete copy at its own depth, ordinary relative
links stay inside the current theme with no rewriting. The switcher in the
footer is the only thing that needs computed paths.

Variables available in chrome and in content:

| Variable | What it is |
|----------|------------|
| `{{HOME}}` | Root of the current theme. Use it for every internal link |
| `{{ROOT}}` | Root of the site. Assets, and hopping between themes |
| `{{PAGE}}` | Page slug (`index`, `cases-cu-giving`). Emitted as `data-page` on `<html>` so a theme can style one page specially |
| `{{BUILD_DATE}}` | Date of the build, for a dateline |

Substitution happens *before* markdown parsing — `marked` percent-encodes
braces inside `[text](...)` link syntax, so `{{HOME}}` in a markdown link
would otherwise break while surviving in raw HTML blocks.

`[data-page]` is how `broadsheet` turns Home into a real front page — an
outsized headline beside its dek, then four ruled columns, all above the
fold on a wide display. That is CSS Grid placement only; the markup is
identical to every other theme, and DOM order is untouched so focus order
still follows reading order.

## Adding a theme

Create `themes/<name>/theme.css` defining every token listed at the top of
`css/base.css`, plus `theme.json`. `--headline-measure` is worth knowing
about: Open Props' normalize caps headings at ~25ch, which fights the grid,
so `base.css` frees them and that token narrows `h1` again where a theme
wants it (`100%` on broadsheet, ~20ch on the rest). Override `head.html` / `foot.html` only if
the chrome itself has to change shape — `broadsheet` does, for a centred
masthead and a dateline. Then rebuild; it is picked up automatically and
appears in every switcher.

`theme.json` carries a **design target** and a **language target** in prose.
That file is written to be read by a person or a model authoring the next
page or the next theme — it is the brief, not configuration.

## Rules that are actually rules

**Static host.** No application server rendering a document per request. A
URL is not required to be one HTML file — a click may load another file that
already exists on the host. The host never invents a file at request time.

**The default stands with JS off.** There is currently no JavaScript on the
site at all, the theme switcher included. Interactivity layers on later,
opted into per element.

**Do not invent proof.** No fake clients, metrics, headshots, testimonials,
or a contact path that goes nowhere. Case studies in `content/cases/` are
built only from facts in `../inventory.md`; each one opens with a comment
naming what would deepen it. Do not add a metric you cannot source.

Everything else — how playful, which themes, what the offer sentence says —
is taste, and taste changes when we look at the thing.

## Next

[#8](https://github.com/alexfinnarn/publishing/issues/8) puts one touchable
box on these pages. [#10](https://github.com/alexfinnarn/publishing/issues/10)
is after that. Neither blocks shipping.
