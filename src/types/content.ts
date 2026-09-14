import { z } from 'zod';

/**
 * Content integrity layer.
 *
 * Every factual claim rendered on this site is parsed through these schemas.
 * The `provenance` field is mandatory and has no default: a claim must be
 * explicitly marked as verified by Nadir, or explicitly marked as a
 * placeholder awaiting confirmation. There is no third state, so content
 * cannot be silently invented — an unmarked claim fails to parse at build
 * time rather than shipping as though it were true.
 */
export const provenanceSchema = z.enum(['verified', 'needs-confirmation']);
export type Provenance = z.infer<typeof provenanceSchema>;

/** A value that is only rendered in production once Nadir has confirmed it. */
export const claimSchema = <T extends z.ZodTypeAny>(value: T) =>
  z.object({
    value,
    provenance: provenanceSchema,
    /** Why this is still unconfirmed. Required for placeholders. */
    note: z.string().optional(),
  });

export type Claim<T> = {
  value: T;
  provenance: Provenance;
  note?: string;
};

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
