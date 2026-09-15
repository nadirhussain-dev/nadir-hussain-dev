import 'server-only';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Portrait availability, resolved at build time.
 *
 * Detected rather than configured, the same way the resume is: drop a file in
 * and it appears, with no code change and no broken image if it is absent.
 * Several extensions are accepted so the file does not have to be converted
 * first.
 */
const DIRECTORY = 'portrait';
const BASENAME = 'nadir-hussain';
const EXTENSIONS = ['webp', 'avif', 'jpg', 'jpeg', 'png'] as const;

export interface PortraitStatus {
  available: boolean;
  src: string;
  expectedPath: string;
}

export function getPortraitStatus(): PortraitStatus {
  for (const extension of EXTENSIONS) {
    const relative = `${DIRECTORY}/${BASENAME}.${extension}`;
    if (existsSync(join(process.cwd(), 'public', relative))) {
      return {
        available: true,
        src: `/${relative}`,
        expectedPath: `public/${relative}`,
      };
    }
  }

  return {
    available: false,
    src: '',
    expectedPath: `public/${DIRECTORY}/${BASENAME}.jpg`,
  };
}
