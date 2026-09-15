/**
 * Content integrity layer — types and helpers only.
 *
 * Deliberately free of zod. These helpers are imported by data modules that
 * client components read (the architecture map, the stack explorer), and
 * pulling a validation library into the browser to describe data that cannot
 * change after build is pure cost. The schemas live in ./content-schema.ts and
 * are imported only where validation actually runs, on the server.
 *
 * Every factual claim rendered on this site carries a `provenance`, and it has
 * no default: a claim must be explicitly marked verified by Nadir, or
 * explicitly marked a placeholder awaiting confirmation. There is no third
 * state, so content cannot be silently invented.
 */
export type Provenance = 'verified' | 'needs-confirmation';

export interface Claim<T> {
  value: T;
  provenance: Provenance;
  /** Why this is still unconfirmed. Required for placeholders. */
  note?: string;
}

/** Marks a confirmed fact. */
export const verified = <T>(value: T): Claim<T> => ({
  value,
  provenance: 'verified',
});

/** Marks a placeholder that must be confirmed before it is published. */
export const needsConfirmation = <T>(value: T, note: string): Claim<T> => ({
  value,
  provenance: 'needs-confirmation',
  note,
});

export const isVerified = <T>(claim: Claim<T>): boolean =>
  claim.provenance === 'verified';
