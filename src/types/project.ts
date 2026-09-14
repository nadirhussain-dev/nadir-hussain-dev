import { z } from 'zod';
import { provenanceSchema } from './content';

/**
 * A project case study.
 *
 * Shaped as a decision log rather than a description, because what makes
 * engineering work legible is not what was built but what was chosen and what
 * it cost. Every project carries its own provenance: a project whose content
 * Nadir has not confirmed is a draft, and drafts never render in production.
 */
export const decisionSchema = z.object({
  /** The choice made. */
  choice: z.string().min(1),
  /** What was rejected. Naming the alternative is what makes a decision real. */
  insteadOf: z.string().min(1),
  /** Why. */
  because: z.string().min(1),
});

export type Decision = z.infer<typeof decisionSchema>;

export const projectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  /** One line, shown before the reader commits to opening it. */
  summary: z.string().min(1),
  /** e.g. "2024 — present". Empty string renders nothing. */
  period: z.string(),
  /** Nadir's role on this project. Empty string renders nothing. */
  role: z.string(),

  problem: z.string().min(1),
  constraints: z.array(z.string()).min(1),
  architecture: z.string().min(1),
  /** Tiers of the system, rendered as a compact flow. */
  architectureNodes: z.array(z.string()),
  decisions: z.array(decisionSchema),
  challenges: z.array(z.string()),
  outcome: z.string().min(1),
  stack: z.array(z.string()),

  provenance: provenanceSchema,
  /** Required for drafts: what Nadir still needs to supply or correct. */
  needs: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;

/** Parses and validates the project list, failing loudly on malformed content. */
export const parseProjects = (input: unknown): Project[] =>
  z.array(projectSchema).parse(input);

export const isPublishable = (project: Project): boolean =>
  project.provenance === 'verified';
