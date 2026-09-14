import { z } from 'zod';
import { provenanceSchema } from './content';

/**
 * A role in the trajectory.
 *
 * `impact` is separate from `responsibilities` on purpose: what you were
 * assigned and what actually changed because you were there are different
 * claims, and conflating them is how portfolios end up sounding like job
 * descriptions.
 */
export const experienceSchema = z.object({
  slug: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  /** Display string, e.g. "2023 — present". Empty renders nothing. */
  period: z.string(),
  /** ISO year-months for ordering and bar placement. Empty disables the bar. */
  startIso: z.string(),
  /** Empty string means current. */
  endIso: z.string(),
  summary: z.string().min(1),
  responsibilities: z.array(z.string()),
  impact: z.array(z.string()),
  technologies: z.array(z.string()),
  provenance: provenanceSchema,
  needs: z.string().optional(),
});

export type Experience = z.infer<typeof experienceSchema>;

export const parseExperience = (input: unknown): Experience[] =>
  z.array(experienceSchema).parse(input);

export const isPublishable = (entry: Experience): boolean =>
  entry.provenance === 'verified';
