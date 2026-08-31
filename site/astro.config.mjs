// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { SITE, BASE } from './site.config.mjs';

export default defineConfig({
  output: 'static',
  // Absolute URLs for canonical/og tags and the sitemap. See site.config.mjs.
  site: SITE,
  base: BASE,
  // Extensionless URLs. Directory format keeps a theme's index at
  // /t/<theme>/ rather than /t/<theme>.html, so every themed page sits at a
  // consistent depth and the theme can always be read off the path.
  build: { format: 'directory' },
  compressHTML: false,
  scopedStyleStrategy: 'where',
  integrations: [
    mdx(),
    react(),
    // The per-theme copies are the same content four more times. They are for
    // a visitor to play with, not for a search engine to pick a winner from,
    // so they stay out of the sitemap and carry noindex + a canonical back to
    // the curated page (see Page.astro).
    sitemap({ filter: page => !page.includes('/t/') }),
  ],
});
