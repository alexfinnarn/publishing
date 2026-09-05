import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

import Link from '../components/Link.astro';
import Masthead from '../components/Masthead.astro';
import Heading from '../components/Heading.astro';
import Chronology from '../components/primitives/Chronology.astro';
import ProblemList from '../components/primitives/ProblemList.astro';
import PostList from '../components/primitives/PostList.astro';
import CaseList from '../components/primitives/CaseList.astro';
import CaseMeta from '../components/primitives/CaseMeta.astro';

import paperBrief from '../themes/paper/theme.json';
import broadsheetBrief from '../themes/broadsheet/theme.json';
import buffBrief from '../themes/buff/theme.json';
import federalBrief from '../themes/federal/theme.json';

import BroadsheetChrome from '../themes/broadsheet/Chrome.astro';

/** A theme's prose brief: `src/themes/<name>/theme.json`.
 *
 *  Nothing in the build reads `design` or `language` — they are the interface
 *  for whoever, or whatever, authors the next page or the next theme. `label`
 *  and `scheme` are load-bearing: `scheme` is the colour schemes the theme
 *  actually supports, and a test holds its stylesheet to it. */
export type ThemeBrief = {
  label: string;
  scheme: 'light' | 'dark' | 'light dark';
  /** What this theme claims each primitive is: primitive -> variant name.
   *  Omitting one takes that primitive's baseline claim. This is the field
   *  that makes theme.json load-bearing rather than documentation. */
  render?: Record<string, string>;
  design: string;
  language: string;
  use_for: string;
  note?: string;
};

/** What a theme may contribute beyond `public/styles/<name>.css`.
 *
 *  Astro publishes no component type, so both slots are loose. What keeps them
 *  honest is the contract, not the type: a theme picks the tags, never the
 *  words or their order. `tests/site.spec.ts` asserts that every theme renders
 *  the same text in the same sequence. */
export type Component = AstroComponentFactory;

export type ThemeParts = {
  /** Everything above <main>. Defaults to the plain masthead. */
  Chrome: Component;
  /** MDX element overrides, merged over DEFAULT_ELEMENTS.
   *
   *  The escape hatch, and currently unused by every theme — which is the
   *  state it should be in. Markup a theme needs is either a claim about the
   *  content, and belongs in a primitive variant, or it is a styling hook, and
   *  belongs to every theme. Reaching for this means neither was true, and
   *  that is worth arguing about before it ships. */
  elements: Record<string, Component>;
};

export type Theme = ThemeBrief & ThemeParts;

/** Element mappings every theme gets. `Link` rewrites root-absolute hrefs so a
 *  reader stays in the theme they are reading — the one override that is
 *  behaviour rather than presentation, which is why no theme may drop it. */
const DEFAULT_ELEMENTS: Record<string, Component> = { a: Link, h2: Heading };

/** The primitive vocabulary, handed to every theme.
 *
 *  Content writes <Chronology entries={...} /> and never imports it — it
 *  arrives through the component map, so the MDX carries no knowledge that
 *  themes exist. Each primitive reads the current theme's `render` map to
 *  learn which claim it is making. See components/primitives/registry.ts. */
const PRIMITIVE_COMPONENTS: Record<string, Component> = {
  Chronology, ProblemList, PostList, CaseList, CaseMeta,
};

/** The registry. A theme is added by dropping a directory under `src/themes/`
 *  and naming it here — explicitly, so a missing file is a build error rather
 *  than a theme that silently renders as paper. */
export const THEMES = {
  paper:      { ...paperBrief,      Chrome: Masthead,         elements: {} },
  broadsheet: { ...broadsheetBrief, Chrome: BroadsheetChrome, elements: {} },
  buff:       { ...buffBrief,       Chrome: Masthead,         elements: {} },
  federal:    { ...federalBrief,    Chrome: Masthead,         elements: {} },
} as Record<string, Theme>;

export const THEME_NAMES = Object.keys(THEMES);
export type ThemeName = keyof typeof THEMES;

export const themeOrDie = (name: string): Theme => {
  const theme = THEMES[name];
  if (!theme) throw new Error(`unknown theme "${name}" — add it to src/lib/themes.ts`);
  return theme;
};

/** The MDX element map for a theme: the defaults, with its overrides on top. */
export const elementsFor = (name: string): Record<string, Component> =>
  ({ ...DEFAULT_ELEMENTS, ...PRIMITIVE_COMPONENTS, ...themeOrDie(name).elements });
