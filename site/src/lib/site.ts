/** Where the THEME_MATRIX test fixture renders each page in every theme.
 *
 *  Not part of the site: the deploy builds one version of each page. These
 *  exist so the contract — a theme may choose the tags, never the words or
 *  their order — has something to compare against. Must match the directory
 *  name under `src/pages/`, since Astro route directories are static. */
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

/** The theme a fixture URL is being rendered in, or undefined for a real page
 *  (whose theme comes from its own frontmatter). Derived from the path so a
 *  primitive deep inside MDX does not have to be told. */
export const themeOf = (pathname: string) =>
  pathname.slice(BASE.length).match(new RegExp(`^/${THEME_PREFIX}/([^/]+)/`))?.[1];
