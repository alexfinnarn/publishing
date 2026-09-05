/** One span of working life. Content supplies these as data, not as markup —
 *  which is the point: the same seven entries become a list, a sequence, or a
 *  table depending only on what the theme claims they are. */
export type Entry = {
  /** A span or a year, as it should read. */
  when: string;
  /** The organisation. */
  where: string;
  /** Role or engagement, when there is one worth naming. */
  role?: string;
  /** What happened there. */
  what: string;
};
