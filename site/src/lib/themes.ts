import paper from '../themes/paper.json';
import broadsheet from '../themes/broadsheet.json';
import buff from '../themes/buff.json';
import federal from '../themes/federal.json';

/** A theme's prose brief: its design and language targets. Nothing in the
 *  build reads these beyond `label` — they are the interface for whoever (or
 *  whatever) authors the next page or the next theme. */
export type ThemeBrief = {
  label: string;
  design: string;
  language: string;
  use_for: string;
  note?: string;
};

export const THEMES = { paper, broadsheet, buff, federal } as Record<string, ThemeBrief>;
export const THEME_NAMES = Object.keys(THEMES);
export type ThemeName = keyof typeof THEMES;
