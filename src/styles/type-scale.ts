/**
 * The font-size token names declared in tokens.css.
 *
 * Duplicated here because tailwind-merge needs them at runtime and cannot read
 * the stylesheet. Keep this in sync with the `--text-*` tokens; the test in
 * type-scale.test.ts fails if they drift.
 */
export const FONT_SIZE_TOKENS = [
  'micro',
  'meta',
  'body',
  'lead',
  'h3',
  'h2',
  'h1',
] as const;

export type FontSizeToken = (typeof FONT_SIZE_TOKENS)[number];
