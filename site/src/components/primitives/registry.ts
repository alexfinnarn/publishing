/** The primitive vocabulary.
 *
 *  A primitive is a content noun. A variant is a claim about what that content
 *  IS — not what it looks like. Two rules keep the layer from decaying into a
 *  second styling system:
 *
 *    1. A variant must change what a screen reader says. If two variants sound
 *       the same to assistive tech, they are one variant and a token, and the
 *       difference belongs in CSS.
 *    2. No variant is called "default". If a primitive's baseline claim cannot
 *       be named, the primitive does not yet know what it is.
 *
 *  `tests/site.spec.ts` holds both: every variant named by a theme must exist
 *  here, and each one is asserted against the accessibility tree it produces. */
export const PRIMITIVES = {
  chronology: {
    /** Used when a theme names no preference. Not a "default" — a claim. */
    baseline: 'date-keyed',
    variants: {
      'date-keyed': { announces: 'dl',
        claim:
          'A description list. Each span of time is the key; what happened in it is the description. Says: look things up by when.' },
      'sequence': { announces: 'ol',
        claim:
          'An ordered list. Says: these happened in this order, and the order is the information.' },
      'comparable-rows': { announces: 'table',
        claim:
          'A table with real column headers. Says: these are the same kind of thing measured the same way, so you may read down a column.' },
    },
  },

  problems: {
    baseline: 'peer-set',
    variants: {
      'peer-set': { announces: 'ul',
        claim:
          'An unordered list. Says: these four are alternatives of equal standing, and none of them is the headline.' },
      'lead-and-supporting': { announces: 'article+ul',
        claim:
          'One article, then a list of the rest. Says: the first is the story and the others hang off it — the claim a front page makes.' },
      'ranked-sequence': { announces: 'ol',
        claim:
          'An ordered list. Says: read these in this order, because the order is an argument.' },
    },
  },

  posts: {
    baseline: 'date-keyed',
    variants: {
      'date-keyed': { announces: 'dl',
        claim:
          'A description list keyed by date. Says: this is an archive, and when a thing was written is how you find it.' },
      'title-led': { announces: 'ul',
        claim:
          'An unordered list with the title first. Says: this is a reading list, and the date is context rather than the key.' },
    },
  },

  cases: {
    baseline: 'peer-set',
    variants: {
      'peer-set': { announces: 'ul',
        claim:
          'An unordered list of links. Says: here are some further pages, take any.' },
      'annotated-index': { announces: 'dl',
        claim:
          'A description list. Says: each case has context that belongs to it, so the link is a term and the engagement is its description.' },
    },
  },

  'case-meta': {
    baseline: 'field-pairs',
    variants: {
      'field-pairs': { announces: 'dl',
        claim:
          'A description list. Says: these are named fields of the same record, and you may look one up.' },
      'inline-attribution': { announces: 'p',
        claim:
          'A paragraph. Says: this is a sentence of provenance, not a data structure — read it, do not scan it.' },
    },
  },
} as const;

export type PrimitiveName = keyof typeof PRIMITIVES;

export const variantsOf = (p: PrimitiveName) =>
  Object.keys(PRIMITIVES[p].variants) as string[];

/** What a variant announces itself as — usually a single tag, but a signature
 *  when the variant produces more than one ('article+ul'). The composer
 *  reasons about the shape of a page from these without rendering anything,
 *  and two courses sharing a signature is what the adjacency rule is for. */
export const announcesOf = (p: PrimitiveName, variant: string): string =>
  (PRIMITIVES[p].variants as Record<string, { announces: string }>)[variant].announces;

/** The variant a theme has chosen for a primitive, or the primitive's baseline
 *  claim when it has not said. Throws on a name no primitive offers, so a typo
 *  in a theme's brief is a build failure rather than a silent fallback. */
export function variantFor(
  primitive: PrimitiveName,
  render: Record<string, string> | undefined,
): string {
  const chosen = render?.[primitive];
  if (!chosen) return PRIMITIVES[primitive].baseline;
  if (!variantsOf(primitive).includes(chosen)) {
    throw new Error(
      `theme asks for ${primitive} variant "${chosen}", which does not exist. ` +
      `Available: ${variantsOf(primitive).join(', ')}`);
  }
  return chosen;
}
