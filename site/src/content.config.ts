import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Pages of the site. Theme-agnostic: nothing here knows how it will look,
 *  beyond naming which theme the curated copy should use. */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    /** Theme for the curated copy at the site root. */
    theme: z.enum(['paper', 'broadsheet', 'buff', 'federal']).default('paper'),
    /** Which nav item to mark current. */
    nav: z.enum(['home', 'problems', 'about', 'writing', 'contact', 'none']).default('none'),
    /** Optional themed slots. A theme renders them if present, nothing if not. */
    kicker: z.string().optional(),
    dek: z.string().optional(),
    /** Overrides the generated <title> when the page title is not the whole story. */
    headTitle: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { pages };
