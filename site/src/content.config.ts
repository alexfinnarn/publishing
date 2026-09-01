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
    /** The page's menu: which primitives it serves, in the order it serves
     *  them. The composer plans the whole run before anything renders, so a
     *  course can be chosen with the rest of the page in view. A test asserts
     *  this matches what the body actually uses. */
    courses: z.array(z.string()).default([]),
    /** Optional themed slots. A theme renders them if present, nothing if not. */
    kicker: z.string().optional(),
    dek: z.string().optional(),
    /** Overrides the generated <title> when the page title is not the whole story. */
    headTitle: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { pages };
