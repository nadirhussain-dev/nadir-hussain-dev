import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { FONT_SIZE_TOKENS } from '@/styles/type-scale';

/**
 * tailwind-merge has to be taught this project's custom font-size scale.
 *
 * Without this, it cannot tell `text-micro` (a size) from `text-signal` (a
 * colour) — it assumes any unknown `text-*` is a colour, so the two land in
 * the same conflict group and the size is silently dropped. That produced a
 * real bug: MonoLabel rendered at the inherited size with no visible error.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...FONT_SIZE_TOKENS] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
