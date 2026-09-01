/** Content hands primitives data, never markup. These are the shapes.
 *  Nothing here knows that themes exist. */

export type Problem = {
  title: string;
  blurb: string;
  /** Where the claim is backed up — engagements, not adjectives. */
  evidence: string;
  href: string;
  cta: string;
};

export type Post = {
  /** How the date should read. Omitted when only the year is known. */
  date?: string;
  /** Machine-readable, for <time datetime>. */
  datetime?: string;
  title: string;
  href: string;
};

export type CaseRef = {
  title: string;
  href: string;
  /** Client and years. */
  context: string;
};

export type Field = { k: string; v: string };
