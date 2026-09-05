import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import Masthead from '../components/Masthead.astro';
import { PRIMITIVES } from '../components/primitives/registry';
import { THEMES, THEME_NAMES } from '../lib/themes';
import { planFor } from '../lib/plan';

/** The design system, as data.
 *
 *  Everything this site decides about presentation is already a value — the
 *  primitive vocabulary, each variant's claim and the announces it produces, a
 *  theme's standing choices, and the plan for each page. So it can describe
 *  itself, and that description can be checked against the pages it describes
 *  rather than drifting alongside them.
 *
 *  It is three things at once: the answer to "why is this a table here", the
 *  vocabulary a theme-builder has to read to offer legal choices, and the
 *  content/presentation split as something a stranger can inspect instead of
 *  taking on faith.
 *
 *  No timestamps, no ordering by anything but name — the artifact has to be
 *  byte-identical for identical inputs, like every other output here. */
export const GET: APIRoute = async () => {
  const pages = (await getCollection('pages')).sort((a, b) => a.id.localeCompare(b.id));

  const doc = {
    primitives: Object.fromEntries(
      Object.entries(PRIMITIVES).map(([name, p]) => [name, {
        baseline: p.baseline,
        variants: Object.fromEntries(
          Object.entries(p.variants as Record<string, { announces: string; claim: string }>)
            .map(([v, { announces, claim }]) => [v, { announces, claim }])),
      }])),

    themes: Object.fromEntries(
      THEME_NAMES.sort().map(name => {
        const t = THEMES[name];
        return [name, {
          label: t.label,
          scheme: t.scheme,
          use_for: t.use_for,
          design: t.design,
          language: t.language,
          /** Does it supply its own furniture above <main>? */
          chrome: t.Chrome === Masthead ? 'shared' : 'own',
          /** Escape-hatch announces overrides. Empty is the healthy state. */
          overrides: Object.keys(t.elements),
          render: t.render ?? {},
        }];
      })),

    pages: pages.map(entry => ({
      slug: entry.id,
      curated_theme: entry.data.theme,
      courses: entry.data.courses,
      /** What each theme would actually serve on this page, in order. */
      plans: Object.fromEntries(
        THEME_NAMES.sort().map(theme => [theme,
          planFor(entry.data.courses, THEMES[theme]?.render).map(c => ({
            primitive: c.primitive,
            variant: c.variant,
            announces: c.announces,
            // present only when a composition rule overrode the theme
            ...(c.because ? { because: c.because } : {}),
          }))])),
    })),
  };

  return new Response(JSON.stringify(doc, null, 2) + '\n',
    { headers: { 'content-type': 'application/json; charset=utf-8' } });
};
