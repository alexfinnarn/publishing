import { PRIMITIVES, announcesOf, variantFor, type PrimitiveName }
  from '../components/primitives/registry';

/** A page's plan: what each course on it is going to be.
 *
 *  The page declares its courses in frontmatter — the menu, in order. The
 *  theme says what it claims each kind of thing is. This turns the two into a
 *  decision per course, BEFORE anything renders.
 *
 *  Computed up front rather than gathered as components render, and that is
 *  not a style preference: Astro may render components concurrently, so a plan
 *  accumulated during rendering would differ between builds. This is a pure
 *  function of (courses, theme) — same inputs, same page, always. */
export type Course = {
  /** Position in the menu, from 0. */
  index: number;
  primitive: PrimitiveName;
  variant: string;
  /** What the chosen variant announces itself as. */
  announces: string;
  /** Set when a composition rule overrode the theme's standing choice. */
  because?: string;
};

export type Plan = Course[];

export function planFor(courses: string[], render: Record<string, string> | undefined): Plan {
  const plan: Plan = courses.map((name, index) => {
    const primitive = name as PrimitiveName;
    if (!(primitive in PRIMITIVES)) {
      throw new Error(`page lists course "${name}", which is not a primitive. ` +
        `Known: ${Object.keys(PRIMITIVES).join(', ')}`);
    }
    const variant = variantFor(primitive, render);
    return { index, primitive, variant, announces: announcesOf(primitive, variant) };
  });

  return avoidAdjacentCollision(plan);
}

/** Two DIFFERENT kinds of thing sitting next to each other and announcing
 *  identically is the ensemble failing: a reader meets two definition lists in
 *  a row and is told nothing by the change. Repeats of the SAME primitive are
 *  left alone — three lists of posts should look like three lists of posts.
 *
 *  When it fires, the second course moves to a variant with a different root
 *  announces, if its primitive has one. If it has none, the collision stands:
 *  a vocabulary too small to fix it is a fact about the vocabulary, not
 *  something to paper over. */
function avoidAdjacentCollision(plan: Plan): Plan {
  for (let i = 1; i < plan.length; i++) {
    const prev = plan[i - 1], here = plan[i];
    if (prev.primitive === here.primitive) continue;
    if (prev.announces !== here.announces) continue;

    const alt = variantsOfPrimitive(here.primitive)
      .find(v => announcesOf(here.primitive, v) !== prev.announces);
    if (!alt) continue;

    plan[i] = { ...here, variant: alt, announces: announcesOf(here.primitive, alt),
                because: `would have announced as ${prev.announces} directly after ${prev.primitive}` };
  }
  return plan;
}

const variantsOfPrimitive = (p: PrimitiveName) => Object.keys(PRIMITIVES[p].variants);

/** The course a primitive is serving. A page may list the same primitive more
 *  than once; `occurrence` picks which, and defaults to the first — so an
 *  unnumbered primitive on a page with three post lists gets one consistent
 *  answer rather than a render-order-dependent one. */
export function courseFor(plan: Plan, primitive: PrimitiveName, occurrence = 0): Course | undefined {
  return plan.filter(c => c.primitive === primitive)[occurrence];
}
