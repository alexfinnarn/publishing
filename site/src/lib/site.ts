/** Where the per-theme copies of the site live, below the site root.
 *  NOTE: this must match the directory name under `src/pages/`. Changing it
 *  means renaming `src/pages/t/` to match — Astro route directories are
 *  static. `scripts/check-links.mjs` asserts the two agree. */
export const THEME_PREFIX = 't';

export const NAV = [
  { key: 'problems', href: '/problems/', label: 'Problems I solve' },
  { key: 'about',    href: '/about/',    label: 'About' },
  { key: 'writing',  href: '/writing/',  label: 'Writing' },
  { key: 'contact',  href: '/contact/',  label: 'Contact' },
] as const;

export const EMAIL = 'alex.finnarn@gmail.com';

/** Base path for a page rendered in a theme. '' is the curated copy. */
export const themeBase = (theme?: string) =>
  theme ? `/${THEME_PREFIX}/${theme}` : '';

/** Prefix root-absolute links in rendered content with the theme base.
 *  Content writes ordinary links like `/problems.html`; this keeps a reader
 *  inside whichever theme they are in. Doing it here rather than with a
 *  template variable means markdown link syntax never sees a placeholder. */
export const rebase = (html: string, base: string) =>
  base ? html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`) : html;
