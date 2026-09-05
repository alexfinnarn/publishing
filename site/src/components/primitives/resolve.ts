import { getCollection } from 'astro:content';
import { BASE, themeOf } from '../../lib/site';
import { THEMES } from '../../lib/themes';
import { planFor, courseFor, type Course } from '../../lib/plan';
import type { PrimitiveName } from './registry';

/** Which course is this primitive serving on this page?
 *
 *  The whole plan is computed from the page's declared menu and the theme, so
 *  a primitive learns its variant with the rest of the page already accounted
 *  for — the composer decided, this only looks the answer up. Pure function of
 *  (path, primitive, occurrence); nothing accumulates while the page renders,
 *  which is what keeps concurrent rendering from changing the output.
 *
 *  Read at render time rather than module load, which keeps the cycle between
 *  themes.ts and the primitives harmless: by the time a page renders, both
 *  modules are populated. */
export async function resolveCourse(
  pathname: string, primitive: PrimitiveName, occurrence = 0,
): Promise<Course> {
  const themed = themeOf(pathname);
  const slug = pathname.slice(BASE.length)
    .replace(new RegExp(`^/t/${themed}`), '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.html$/, '') || 'index';

  const entry = (await getCollection('pages')).find(p => p.id === slug);
  const theme = themed ?? entry?.data.theme ?? 'paper';
  const render = THEMES[theme]?.render;
  const plan = planFor(entry?.data.courses ?? [], render);

  // A page that serves a primitive it never listed still renders — it just
  // takes the theme's standing choice with no ensemble awareness. Keeping the
  // menu and the body in step is the test suite's job, not a crash.
  return courseFor(plan, primitive, occurrence) ?? planFor([primitive], render)[0];
}

/** Just the variant, for a primitive that does not care about its position. */
export async function resolveVariant(
  pathname: string, primitive: PrimitiveName, occurrence = 0,
): Promise<string> {
  return (await resolveCourse(pathname, primitive, occurrence)).variant;
}
