import 'server-only';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Resume availability, resolved at build time.
 *
 * The file is detected rather than configured, so dropping a PDF into
 * public/resume/ publishes it with no code change — and, just as importantly,
 * the site never renders a download link to a file that is not there. A broken
 * resume link is worse than no resume link.
 */
const RESUME_PATH = 'resume/nadir-hussain-resume.pdf';

export interface ResumeStatus {
  available: boolean;
  /** Public URL. Only meaningful when `available`. */
  href: string;
  expectedPath: string;
}

export function getResumeStatus(): ResumeStatus {
  const absolute = join(process.cwd(), 'public', RESUME_PATH);
  return {
    available: existsSync(absolute),
    href: `/${RESUME_PATH}`,
    expectedPath: `public/${RESUME_PATH}`,
  };
}
