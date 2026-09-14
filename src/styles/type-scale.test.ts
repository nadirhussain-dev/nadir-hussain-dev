import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FONT_SIZE_TOKENS } from './type-scale';
import { cn } from '@/lib/utils';

const tokensCss = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

describe('type scale', () => {
  it('matches the --text-* tokens declared in tokens.css', () => {
    const declared = [...tokensCss.matchAll(/^\s*--text-([a-z0-9]+):/gm)].map(
      (match) => match[1],
    );

    expect(new Set(declared)).toEqual(new Set(FONT_SIZE_TOKENS));
  });
});

describe('cn', () => {
  it('keeps a font size alongside a text colour', () => {
    // Regression: tailwind-merge treated `text-micro` as a colour and dropped
    // it when merged with `text-signal`.
    expect(cn('text-micro', 'text-signal')).toBe('text-micro text-signal');
  });

  it('still resolves genuine font-size conflicts', () => {
    expect(cn('text-body', 'text-h1')).toBe('text-h1');
  });

  it('still resolves genuine colour conflicts', () => {
    expect(cn('text-paper-100', 'text-signal')).toBe('text-signal');
  });
});
