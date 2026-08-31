// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  // Extensionless URLs. Directory format keeps a theme's index at
  // /t/<theme>/ rather than /t/<theme>.html, so every themed page sits at a
  // consistent depth and the theme can always be read off the path.
  build: { format: 'directory' },
  compressHTML: false,
  scopedStyleStrategy: 'where',
  integrations: [mdx(), react()],
});
