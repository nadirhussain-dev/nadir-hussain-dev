import { needsConfirmation, type Claim } from '@/types/content';

/**
 * Hero copy.
 *
 * Marked needs-confirmation on purpose. Positioning copy is written in Nadir's
 * voice and makes implicit claims about how he works, so it is his to approve
 * rather than mine to assert. It stays in the content audit until he signs off
 * on the wording.
 */
export const identity = {
  statement: needsConfirmation(
    'I build systems that hold their shape under load — from the interface, through the API, down to the infrastructure that serves it.',
    'Hero positioning line. Written from the stated focus; confirm the wording reads as your voice.',
  ) satisfies Claim<string>,

  subStatement: needsConfirmation(
    'Most of my work lives where product decisions meet architectural ones: payments, data flow, and the parts of a system that are expensive to get wrong.',
    'Hero secondary line. Confirm this reflects the work you actually want to lead with.',
  ) satisfies Claim<string>,
} as const;
