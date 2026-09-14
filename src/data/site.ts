import { needsConfirmation, verified, type Claim } from '@/types/content';

/**
 * Canonical site-level facts.
 *
 * Anything marked `needsConfirmation` is a structural placeholder, not a
 * statement of fact. Run `pnpm content:audit` to list everything still
 * awaiting Nadir's confirmation.
 */
export const site = {
  name: 'Nadir Hussain',
  role: 'Full-Stack Software Engineer',

  /** Short positioning line. Drawn from Nadir's own description of his focus. */
  focus:
    'Scalable systems, architecture, modern web applications, payments, backend engineering, and product development.',

  /** Derived from the configured git remote (nadirhussain-dev/nadir-hussain-dev). */
  canonicalUrl: needsConfirmation(
    'https://nadir-hussain.dev',
    'Confirm the production domain. Repo name implies nadir-hussain.dev, but this has not been verified.',
  ) satisfies Claim<string>,

  email: verified('nhussain@plyaz.co.uk') satisfies Claim<string>,

  github: needsConfirmation(
    'https://github.com/nadirhussain-dev',
    'Two GitHub accounts are visible (nadirhussain-dev owns this repo, nadirhussain786 is the authenticated user). Confirm which to link publicly.',
  ) satisfies Claim<string>,

  linkedin: needsConfirmation(
    '',
    'LinkedIn URL not present in the repository. Provide it or the link will be omitted.',
  ) satisfies Claim<string>,

  location: needsConfirmation(
    '',
    'Location not present in the repository. Provide it or it will be omitted.',
  ) satisfies Claim<string>,
} as const;

export type Site = typeof site;
