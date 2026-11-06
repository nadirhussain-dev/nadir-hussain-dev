import 'server-only';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * An optional finished illustration, detected at build time like the portrait.
 * Drop public/character/nadir.png (or .webp) in and it replaces the drawn
 * character everywhere, with no code change.
 */
export function getCharacterImage(): string | null {
  for (const extension of ['webp', 'png', 'avif', 'jpg']) {
    const relative = `character/nadir.${extension}`;
    if (existsSync(join(process.cwd(), 'public', relative))) return `/${relative}`;
  }
  return null;
}
