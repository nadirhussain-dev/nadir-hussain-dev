import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { contrastRatio } from './contrast';

/**
 * Contrast is measured against the real tokens, parsed from tokens.css, so the
 * test cannot drift from the stylesheet. A warm neutral ramp is exactly the
 * kind of palette that looks fine and measures badly, which is why this is a
 * test rather than a judgement call.
 */
const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

const token = (name: string): string => {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,8});`));
  if (!match?.[1]) throw new Error(`Token --color-${name} not found in tokens.css`);
  return match[1];
};

const GROUND = token('ink-900');
/** Panels and chips sit on this, and it is lighter, so it is the harder case. */
const PANEL = token('ink-850');

/** WCAG AA: 4.5 for body text, 3.0 for large text and UI boundaries. */
const AA_BODY = 4.5;
const AA_LARGE = 3;

describe('body text contrast on the page ground', () => {
  const cases: readonly [string, number][] = [
    ['paper-100', AA_BODY],
    ['paper-200', AA_BODY],
    ['paper-300', AA_BODY],
    ['paper-400', AA_BODY],
    // Used for genuine body copy — the playground caveat, the stack layer
    // descriptions, the 'instead of' line in case studies — so it is held to
    // the body threshold, not the large-text one. It previously sat at 4.15
    // and failed.
    ['paper-500', AA_BODY],
  ];

  for (const [name, minimum] of cases) {
    it(`${name} meets ${minimum}:1 on the ground`, () => {
      expect(contrastRatio(token(name), GROUND)).toBeGreaterThanOrEqual(minimum);
    });

    it(`${name} meets ${minimum}:1 on panels`, () => {
      // Panels are lighter than the ground, so this is the harder case and the
      // one that actually catches regressions.
      expect(contrastRatio(token(name), PANEL)).toBeGreaterThanOrEqual(minimum);
    });
  }
});

describe('accent text contrast', () => {
  it('signal is readable on the ground', () => {
    expect(contrastRatio(token('signal'), GROUND)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('signal is readable on panels', () => {
    expect(contrastRatio(token('signal'), PANEL)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('flow is readable on the ground', () => {
    expect(contrastRatio(token('flow'), GROUND)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('flow is readable on panels', () => {
    expect(contrastRatio(token('flow'), PANEL)).toBeGreaterThanOrEqual(AA_BODY);
  });
});

describe('status colours in the simulator', () => {
  // These encode state, so they must be readable, not merely distinguishable.
  for (const name of ['status-ok', 'status-warn', 'status-fail']) {
    it(`${name} is readable on the ground`, () => {
      expect(contrastRatio(token(name), GROUND)).toBeGreaterThanOrEqual(AA_BODY);
    });
  }
});

describe('non-text contrast', () => {
  it('the focus ring is visible against the ground', () => {
    // WCAG 2.2 requires 3:1 for focus indicators.
    expect(contrastRatio(token('signal'), GROUND)).toBeGreaterThanOrEqual(AA_LARGE);
  });

  it('the rule hairline is perceivable against the ground', () => {
    // Structural, not a UI boundary a user must operate, so AA_LARGE is the
    // right bar rather than 4.5.
    expect(contrastRatio(token('paper-400'), GROUND)).toBeGreaterThanOrEqual(AA_LARGE);
  });
});
