# First theme-authoring exercise

Completed 2026-09-05 using existing broadsheet, without adding a theme,
dependency, runtime schema, or token compiler.

## Question and sequence

Can a short prose interface describe a working theme and guide a bounded
change without prescribing its implementation?

1. Read the CSS, chrome, theme.json, registry, and existing Home content.
2. Reconstruct [DESIGN.md](DESIGN.md) using the
   [provisional worksheet](../DESIGN.template.md).
3. Specify a header hit-area target before editing CSS.
4. Measure baseline header links in Chromium at 320, 375, 768, and 1280px.
5. Apply the extension and verify dimensions, overlap, keyboard behavior,
   existing contracts, and narrow/wide screenshots.
6. Revise the brief to distinguish the intended reference from observed output.

## Bounded extension

The brief asks for header links of at least 2.75rem in each dimension while keeping
compact newspaper typography. The implementation adds minimum dimensions and
inline-flex alignment to the six header links, and centers utility-row items
vertically. Existing flex wrapping puts email below availability on phones.
No new breakpoint or design token was necessary.

The initial extension used 44px; user feedback prompted rem-based minima so
hit areas scale with the reader's root font size. The measurements below use
the default 16px root size, where 2.75rem equals 44px. Existing fluid type,
gutters, and grid tracks remain in place.

| Width | Utility link height, before → after | Wordmark height, before → after | Navigation height, before → after |
| --- | --- | --- | --- |
| 320px | 16.8 → 44px | 20 → 44px | 17 → 44px |
| 375px | 16.8 → 44px | 20 → 44px | 17 → 44px |
| 768px | 18 → 44px | 22.2 → 44px | 18 → 44px |
| 1280px | 18 → 44px | 25.3 → 44px | 18 → 44px |

The narrow About link also grew from 41.9 to 44px wide. Every checked header
link fits within the viewport and no pair overlaps. Keyboard traversal from
the skip link follows utility email, wordmark, then the four navigation links;
each retains the 3px solid focus outline.

Visual review at 375px before/after and 1280px after retained serif type, warm
paper, rules, and red accents. The deliberate tradeoff is a taller header:
at 375px its bottom moves from about 289px to 375px, pushing content down.
No copy was shortened or hidden to compensate. This is a meaningful cost to
weigh in a later layout pass, not an invisible improvement.

## Verification

- `npx playwright test tests/broadsheet.spec.ts`: 5 passed, including a 20px
  root-font check where targets grow to at least 55px and still fit at 375px.
- Existing token, text-sequence, heading-outline, scheme, and contrast tests:
  5 passed, selected from tests/site.spec.ts.
- `npm run check`: 45 files, zero errors, warnings, or hints.
- The test runs built the 45-page theme matrix successfully.

This is Chromium header verification, not an all-page mobile, cross-browser,
zoom, screen-reader, or full accessibility audit. Existing contrast checks
sample selected content on theme home pages; they are not exhaustive.
The full test suite was not rerun for this bounded CSS change.

## What the interface taught us

**Intent and observation need separate labels.** The CSS and old brief say
centered masthead, but screenshots show a smaller left-aligned masthead.
The source loads theme CSS in the head while Astro also emits base styles;
the result warrants a focused cascade investigation. A brief reconstructed
only from comments would have repeated an unverified claim.

**Examples make language guidance usable, but this exercise did not test
copy generation.** The brief explains a headline/dek relationship and limits
it to authorized authoring. Existing conversational Home copy also shows why
“no second-person selling” needs interpretation. Test that with actual page
writing before formalizing editorial rules.

**A measurable target need not become a token.** The 2.75rem goal guided a small
local CSS rule. A shared interaction-size token might earn its place when
another theme needs the same decision; this example alone does not require it.

**Historical descriptions drift.** The four-flat-columns description predates
the nested lead/support primitive, and a CSS comment still names a private
Heading component that the registry no longer uses. The brief links to the
current render map instead of duplicating a second configuration.

**Reproducibility needs a boundary.** Theme application is deterministic, but
Chrome.astro inserts the build date. Complete HTML can differ across days with
unchanged sources. This exercise documents the exception without changing it.

## Next experiment

Use the same worksheet for a different theme and an actual authorized content
authoring task. Keep shared facts in the existing contract, numeric values in
CSS, runtime choices in theme.json, and explanatory examples in the brief.
Only promote repeated needs into types or shared rules after that comparison.
Cascade repair and semantic ownership remain separate open work.

The current theme.json design/language strings remain the short runtime-exported
summary. The new brief elaborates and records exceptions; no loader reads it.
If this format survives a second exercise, decide how to give prose one source
of truth rather than perpetually synchronizing summaries by hand.
