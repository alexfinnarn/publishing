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

/** The path the site is served from, with no trailing slash — '/publishing'
 *  on GitHub Pages, '' from a domain root. Set in `site.config.mjs`; Astro
 *  hands it to us as BASE_URL. Every root-absolute URL we write by hand has
 *  to go through here, because Astro only rewrites the ones it generates. */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** A site-root path ('/about/'), as an href the browser can follow. */
export const withBase = (path: string) => `${BASE}${path}`;

/** Base path for a page rendered in a theme. Undefined is the curated copy. */
export const themeBase = (theme?: string) =>
  theme ? withBase(`/${THEME_PREFIX}/${theme}`) : BASE;

/** The theme a URL is being rendered in, or undefined for the curated copy.
 *  Derived from the path so a component does not have to be told. */
export const themeOf = (pathname: string) =>
  pathname.slice(BASE.length).match(new RegExp(`^/${THEME_PREFIX}/([^/]+)/`))?.[1];
