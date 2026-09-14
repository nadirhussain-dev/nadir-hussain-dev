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

  /**
   * Must be a personal address. Nadir's employer address is explicitly out of
   * scope for this site and must never be committed here.
   */
  email: needsConfirmation(
    '',
    'Personal contact email needed. Do not use a work address. The contact section omits the link until this is supplied.',
  ) satisfies Claim<string>,

  /** Confirmed by Nadir: link the nadirhussain786 account publicly. */
  github: verified('https://github.com/nadirhussain786') satisfies Claim<string>,

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
