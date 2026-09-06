# Broadsheet

First authoring exercise, 2026-09-05. This provisional brief reconstructs the
working theme, then guides a narrow extension to its header links. It uses
DESIGN.md's prose-first approach without introducing token frontmatter or a
compiler. The section names are a local worksheet, not a claim of full format
conformance. [Exercise record](EXERCISE.md).

## Purpose

A prospective consulting client lands on Home to understand Alex's work,
find evidence relevant to their problem, and reach a case study or contact.
Broadsheet gives that entry page a recognizable editorial hierarchy.
Other pages render in it only through the theme matrix fixture.

## Design reference

Borrow a newspaper front page's centered serif masthead, double rules,
dateline, warm paper, and restrained red accent. Rules separate stories;
the utility bar carries availability and contact. Preserve this character
when the page becomes a narrow reading column.

That is the intended reference. Browser review in this exercise found that
the built masthead is left-aligned and smaller than that target: existing
cascade behavior wins over parts of the theme CSS. The extension preserves
that baseline; restoring the intended masthead is a separate decision.

## Language

The short language target remains in [theme.json](theme.json), also exposed by
design.json. This section explains how to use it rather than replacing it.

For explicitly authorized page writing, lead with a supported fact; use the
dek to add scope or evidence. Preserve meaningful qualifications. Specific
facts must come from the content's sources, never from the visual reference.

Illustrative pair, not replacement site copy:

- Headline: “Publishing across departments”
- Dek: “A case study of the workflow, ownership, and tooling involved.”
- Counterexample dek: “How publishing works across departments.” It repeats
  the headline without helping the reader decide whether to continue.

Existing Home copy is input to this exercise, not text to rewrite to fit the
brief. Its conversational call to action is a tension with the short brief's
“no second-person selling” instruction, to resolve in an editorial exercise.
Changing the rendering theme never rewrites canonical copy.

Theme-owned chrome contains availability, discipline, location, and a date.
These are factual assertions, not newspaper decoration to invent. Shared
navigation labels come from [site.ts](../../lib/site.ts).

## Visual decisions

[broadsheet.css](../../../public/styles/broadsheet.css) owns the exact values:
ink and muted ink carry text, paper and warm paper provide surfaces, rule
separates sections, and accent identifies links and headline details.
The shared required token list is at the top of
[base.css](../../styles/base.css). Do not maintain a second palette here.

Body and display type share a serif family. Fluid steps, gutters, and headline
measure produce the scale; uppercase tracking distinguishes utility metadata.
Touch space may grow without enlarging the masthead's visual emphasis.

## Components and layout

[Chrome.astro](Chrome.astro) supplies the utility bar, masthead, navigation,
and dateline. The registry uses shared Heading and primitive components;
broadsheet currently has no element overrides. CSS's comment about a private
Heading component is historical, not an instruction to create one.

The render map in theme.json currently selects lead-and-supporting problems,
title-led posts, sequence chronology, annotated-index cases, and
inline-attribution case metadata.
Home serves problems followed by posts. At wide widths, headline and dek sit
beside each other; the following call to action spans the wide track.

The older claim of four flat problem columns does not describe the nested
lead-and-supporting primitive reliably. Treat its layout as unresolved;
this header exercise does not change that primitive or its semantics.

## Responsive behavior

Existing CSS changes header spacing below 40rem and front-page layout at
64rem; the 48–64rem rule concerns the problem grid. Shared components keep
their existing behavior. Theme-specific chrome justifies a theme-local rule.

Extension: at every width, utility, wordmark, and primary navigation links
have at least 2.75rem of hit area in both dimensions (44 CSS pixels at the
default 16px root size), scaling with the reader's base font size. This is this
exercise's usability target, not a claim that every link must meet that size
for WCAG AA. Let navigation wrap naturally; keep the email readable. On
narrow screens, give contact its own row if necessary. Preserve DOM order.

The theme remains light-only, as declared in theme.json. It adds no motion
or JavaScript; shared focus and reduced-motion styles still apply.

## Boundaries

The existing [theme interface](../../lib/themes.ts) and
[site contract](../../../README.md) govern runtime artifacts: explicit
registration, required tokens, valid variants, the same main text sequence
and heading outline across themes, and supported color schemes.

This exercise may change only header presentation, its focused regression
checks, and authoring documentation. It preserves copy, routes, render map,
and dependencies. It does not resolve whether themes should select semantic
relationships. Keep that question open rather than encoding a new rule.

## Acceptance examples

Use existing Home at 320, 375, 768, and 1280 CSS pixels. Check header link hit
areas, wrapping, horizontal fit, and keyboard order from skip link through
contact. Inspect narrow and wide screenshots for retained newspaper character.
Run the existing token, text, heading, scheme, and contrast checks.

The header is shared by every broadsheet fixture page; do not describe this
exercise as an all-page mobile audit. Automated dimensions do not substitute
for editorial review or a full accessibility audit.

## Open questions

- Which language rules belong to the shared voice versus the page's audience?
- Should content authorize lead/support and ranking relationships explicitly?
- Should the dateline identify build time? It currently uses the build's date,
  so complete HTML can change between days despite identical source inputs.
- Does the nested problem layout still meet the intended desktop composition?
- What survives this worksheet when a second, different theme is exercised?
