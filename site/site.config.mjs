/** Where the site is published. The one place that knows.
 *
 *  Today this is a GitHub Pages project site, so everything lives under a
 *  base path. Launch — a real domain at the root — is `BASE = ''` here and a
 *  new SITE, and nothing else has to move: `astro.config.mjs`, the layout's
 *  canonical URLs, the static server, and the tests all read these.
 *
 *  Plain .mjs because `astro.config.mjs` and `scripts/serve.mjs` both import
 *  it outside of Astro's TypeScript pipeline.
 */

/** Origin, no trailing slash. Used for canonical and og: URLs and the sitemap. */
export const SITE = 'https://alexfinnarn.github.io';

/** Path below the origin, no trailing slash. '' when served from the root. */
export const BASE = '/publishing';
