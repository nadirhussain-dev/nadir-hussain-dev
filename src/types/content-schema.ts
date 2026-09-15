import { z } from 'zod';
import type { Provenance } from './content';

/**
 * Runtime validation for content.
 *
 * Server-only by convention: importing this from a client component would ship
 * zod to the browser. The split exists for that reason — see ./content.ts.
 */
export const provenanceSchema: z.ZodType<Provenance> = z.enum([
  'verified',
  'needs-confirmation',
]);
