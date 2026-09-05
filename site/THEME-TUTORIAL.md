# Build your first theme

This is the human version of the process used in the
[first broadsheet exercise](src/themes/broadsheet/EXERCISE.md): write a small
brief, make one visible change, inspect it, and revise your understanding.
You do not need an agent, a token compiler, or a new component library.

The walkthrough uses `fieldnotes` as an example name and starts from `paper`.
It keeps existing content and component choices so you can learn the visual
layer first. The example is not installed in this repository; the commands
below are steps for you to perform. Pick another name if it already exists.

## 1. Choose a reading experience

Before opening CSS, write three sentences:

1. Who is reading, and what are they trying to do?
2. What concrete reference helps that experience?
3. What should stay recognizable on a narrow screen?

For example:

> Fieldnotes is for someone reading a detailed account of technical work.
> Borrow the readable serif text and understated hierarchy of a field journal.
> On a phone, preserve comfortable paragraphs and clear section boundaries.

This is a starting hypothesis. It does not require brown paper, handwriting,
notebook graphics, or any other literal decoration.

Choose existing content to work against: About for prose, Home for problems
and posts, and a case study for metadata and case links. Keep the words fixed
while you learn what the presentation changes.

## 2. Make the smallest working copy

Run these commands from the repository's `site/` directory. Use `npm install`
first only if dependencies are not already installed.

```sh
mkdir src/themes/fieldnotes
cp src/themes/paper/theme.json src/themes/fieldnotes/theme.json
cp public/styles/paper.css public/styles/fieldnotes.css
cp src/themes/DESIGN.template.md src/themes/fieldnotes/DESIGN.md
```

The plain `mkdir` deliberately fails if the directory already exists: inspect
that work instead of overwriting it. Check that `fieldnotes.css` is also unused
before copying. Rename the copied stylesheet's introductory comment so it no
longer claims to be paper or the only theme that adapts to color preference.

You now have three different responsibilities:

| File | Responsibility |
| --- | --- |
| `DESIGN.md` | Your intent, examples, boundaries, and open questions |
| `theme.json` | Runtime metadata, component choices, and a short prose summary |
| `fieldnotes.css` | Exact token values and theme-specific presentation |

Fill in Purpose, Design reference, Boundaries, and Acceptance examples in the
copied worksheet. Leave uncertain sections short. Fix its introductory link
to broadsheet to `../broadsheet/DESIGN.md`, since the copy is one level deeper.
The worksheet is not parsed by the build and has no required YAML frontmatter.

Replace the copied `theme.json` with this starting point:

```json
{
  "label": "fieldnotes",
  "scheme": "light dark",
  "design": "A readable field journal for technical accounts. Serif text, restrained hierarchy, comfortable paragraphs, and clear section boundaries.",
  "language": "Name the subject and describe what happened. Preserve uncertainty and qualifications supported by the evidence.",
  "use_for": "An experiment using existing prose and case studies.",
  "render": {
    "chronology": "date-keyed",
    "problems": "peer-set",
    "posts": "date-keyed",
    "cases": "peer-set",
    "case-meta": "field-pairs"
  },
  "note": "Starts from paper's light and dark colors and shared chrome. See DESIGN.md for the authoring experiment."
}
```

Keep `scheme: "light dark"` while the copied CSS uses `light-dark()` and
`color-scheme: light dark`. Those declarations must agree. You can explore a
single scheme later by changing both the declaration and all paired colors.

## 3. Register it and see it unchanged

In [src/lib/themes.ts](src/lib/themes.ts), add an import beside the existing
brief imports:

```ts
import fieldnotesBrief from '../themes/fieldnotes/theme.json';
```

Add this entry inside the existing `THEMES` object:

```ts
fieldnotes: { ...fieldnotesBrief, Chrome: Masthead, elements: {} },
```

Names connect the registry entry, theme directory, and public stylesheet.
There is no automatic directory discovery in the runtime registry.

Build the fixture and serve it:

```sh
npm run build:matrix
node scripts/serve.mjs dist 4321
```

Leave the server running and open
[the fieldnotes About fixture](http://localhost:4321/publishing/t/fieldnotes/about/).
Other useful fixtures are `/publishing/t/fieldnotes/` and
`/publishing/t/fieldnotes/cases/cu-giving/` on the same server. These URLs assume
the current `/publishing` base in site.config.mjs. Use another port if 4321 is
already occupied. Stop this server with Ctrl-C when finished.

At this checkpoint it should look like paper. That confirms the plumbing
before you introduce design differences. Production pages still use their
existing themes; fixture routes do not ship in the normal build.

The server serves built files: after each edit, run `npm run build:matrix`
in a second terminal and refresh after it finishes. Do not use `npm run serve`
for this exercise: it performs a production build, which removes the fixture.
Avoid running tests and rebuilding manually at the same time; both use dist.

## 4. Change one visual relationship

Inside `fieldnotes.css`, replace these existing token declarations:

```css
--font-body: var(--font-serif, Georgia, serif);
--font-display: var(--font-body);
--measure: 60ch;
--headline-measure: 20ch;
```

Rebuild and compare the same About page with
`/publishing/t/paper/about/`. Read a paragraph; look at heading wraps. Ask what
the change improved, and where it made reading worse. Do not change the whole
palette, layout, and type scale before you can answer that.

For subsequent experiments, use units according to their job:

| Need | Useful starting point |
| --- | --- |
| Paragraph measure | `ch`, such as `60ch` |
| Type and interaction minima | `rem`, so they follow root font size |
| Fluid size with limits | `clamp(1rem, .96rem + .2vw, 1.125rem)` |
| Available layout space | `%`, fractional grid tracks, `minmax()` |
| Gutters | A bounded fluid value such as `clamp(1rem, 4vw, 3rem)` |
| Fine decorative rule | A small fixed width can be appropriate |

Percentages alone do not ensure responsive behavior. A percentage hit area
can become too small; an unbounded viewport font can become too large.
Broadsheet's first exercise used `2.75rem` minima for header links while keeping
fluid page layout. A percentage also depends on its containing block, so
inspect the actual component rather than guessing from the viewport.

The required tokens are listed at the top of
[base.css](src/styles/base.css). Keep them all, even when a token's value is
unchanged from paper. Exact color values live in CSS; describe their roles in
your brief instead of maintaining a second palette there.

## 5. Use language guidance deliberately

Language guidance affects an author making copy decisions. It does not cause
the build to rewrite a page when its theme changes.

As a separate exercise in your DESIGN.md, write an illustrative headline and
dek, then a counterexample:

> Headline: Publishing across departments
>
> Dek: A case study of the workflow, ownership, and tooling involved.
>
> Counterexample dek: How publishing works across departments.

Explain why the first dek adds information and the second repeats the title.
Label these as examples so an agent does not mistake them for replacement copy.
Do not invent client facts to demonstrate a tone.

If you later choose to revise real content, edit its canonical MDX explicitly.
Every theme fixture should then contain that same revised copy. Shared
accuracy rules belong to the site; audience-specific language belongs in the
relevant page or theme brief. Note ambiguities rather than writing absolute
rules such as “never hedge.”

## 6. Know when to stop at CSS

Keep paper's render map for the first experiment. Consult the
[primitive registry](src/components/primitives/registry.ts) before changing it:
`peer-set`, `ranked-sequence`, and `lead-and-supporting` make different claims
about the content, not merely different visual arrangements.

If you want columns or a rule, first try styling the existing component.
Do not introduce ranking just to get a numbered appearance. Ownership of
semantic choices is still an open design question in this project.

A custom `Chrome.astro` is optional when the header genuinely needs a different
structure. Broadsheet provides a working example, but also known discrepancies
between its intended design and rendered cascade. For your first theme, keep
`Chrome: Masthead` and `elements: {}`. Adding element overrides also encounters
an intentional existing test: investigate the underlying need instead of
deleting that check to get a green suite.

When a CSS declaration appears to do nothing, inspect browser computed styles
and the winning rule. Base styles, normalize, and theme styles can compete.
The broadsheet exercise found exactly this; adding more tokens or `!important`
without understanding the cascade would obscure the problem.

## 7. Check the result

Run the narrow checks first:

```sh
npm run check
npx playwright test tests/site.spec.ts --grep 'tokens base|same words|same heading|colour scheme|clears WCAG'
```

Playwright builds and serves its own theme matrix. The checks verify required
tokens, preserved text and headings, scheme declarations, and sampled contrast.
Read failures before changing tests. The color test samples selected elements
on each theme's Home fixture; passing is not an exhaustive contrast audit.

Manually inspect your three representative pages:

- At 320, 375, 768, and 1280 CSS pixels, check wrapping, overflow, and reading order.
- Increase browser zoom and the default font size; check that text and links
  remain usable. Do not shrink text or hide content just to make it fit.
- Tab through navigation and page links. Confirm visible focus and enough
  space to activate links without hitting their neighbors.
- Inspect both light and dark preferences because this example claims both.
- Compare what you see with your brief. Record mismatches as evidence.

Then run `npm test`. One known adjustment is required when adding a fifth
theme: the first test in [site.spec.ts](tests/site.spec.ts) currently expects
45 HTML pages. With the current nine content pages and five themes, the
expected matrix is `9 × (1 + 5) = 54` pages. Update that assertion deliberately,
or derive it from content and theme counts; do not remove the fixture check.
The production page count stays nine. If you added content too, calculate
from the actual content count rather than copying 54.

## 8. Assign it to a page only when ready

You can complete the whole experiment in the fixture. To use fieldnotes on a
production page, add `'fieldnotes'` to the theme `z.enum(...)` in
[src/content.config.ts](src/content.config.ts), then change that page's
frontmatter to `theme: fieldnotes`. Keep its courses and body unchanged unless
you are deliberately making an editorial change too.

Run checks again, then `npm run build` and inspect the curated page. Production
builds omit `/t/` routes. These local steps do not publish; the repository's
existing deployment workflow runs when changes are pushed to main.

## 9. Write down what happened

Create `EXERCISE.md` beside your brief with these short sections:

```markdown
# Fieldnotes exercise
## Question
What reading experience was I trying to improve?
## Change
What did I actually change, and why?
## Evidence
Which pages, widths, schemes, and checks did I inspect?
## Tradeoffs
What improved, what got worse, and what remains uncertain?
## Next experiment
What is the smallest useful thing to try next?
```

Revise DESIGN.md to reflect what survived implementation. Keep intended and
observed behavior distinct. This is where the interface emerges: promote a
decision into a shared rule or type only when working examples justify it.

If you involve an agent, you can keep the design work yours:

> Read my brief and review my theme against it. Identify discrepancies and
> show the evidence. Separate mechanical failures from design judgments.
> Do not edit files yet; help me choose the next small experiment.

The useful comparison is where you and the agent made different interpretations
of the same brief. Refine that wording or add an example before reaching for
a larger schema.
