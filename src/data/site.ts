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

  /**
   * Name variants people actually search for, supplied by Nadir.
   *
   * These are emitted as schema.org alternateName, which is the mechanism that
   * lets a search engine understand several strings refer to one person. It is
   * the single highest-value thing on this page for ranking on his own name.
   */
  alternateNames: verified(['Jam Nadir Hussain', 'Jam Nadir', 'Nadir']) satisfies Claim<
    readonly string[]
  >,

  /**
   * Areas of genuine expertise, emitted as schema.org knowsAbout.
   * Drawn from Nadir's own statement of focus — nothing added.
   */
  knowsAbout: verified([
    'Software Architecture',
    'Scalable Systems',
    'Distributed Systems',
    'Payments Engineering',
    'Backend Engineering',
    'Full-Stack Web Development',
    'TypeScript',
    'Next.js',
    'React',
    'Node.js',
    'PostgreSQL',
    'Product Development',
  ]) satisfies Claim<readonly string[]>,

  /** Google Search Console verification token. */
  googleSiteVerification: needsConfirmation(
    '',
    'Google Search Console verification token. Register the domain at search.google.com/search-console, paste the token here, then submit the sitemap — indexing will not happen quickly without it.',
  ) satisfies Claim<string>,

  /** Short positioning line. Drawn from Nadir's own description of his focus. */
  focus:
    'Scalable systems, architecture, modern web applications, payments, backend engineering, and product development.',

  /** Derived from the configured git remote (nadirhussain-dev/nadir-hussain-dev). */
  canonicalUrl: needsConfirmation(
    'https://nadir-hussain.dev',
    'Confirm the production domain. Repo name implies nadir-hussain.dev, but this has not been verified.',
  ) satisfies Claim<string>,

  /**
   * Confirmed by Nadir. Must stay a personal address — his employer address is
   * explicitly out of scope for this site and must never be committed here.
   */
  email: verified('nh262464@gmail.com') satisfies Claim<string>,

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
