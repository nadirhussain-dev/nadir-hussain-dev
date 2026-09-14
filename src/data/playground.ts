import { needsConfirmation, type Claim } from '@/types/content';

export const playgroundIntro = needsConfirmation(
  'This is a real simulation, not a loop of pre-recorded frames: a deterministic model of a payments pipeline, running in your browser. Push traffic up, break something, and watch where it gives way. The interesting failures in payments are rarely about throughput — they are about what happens to money when a processor gets slow.',
  'Playground intro, written in your voice. Confirm the framing.',
) satisfies Claim<string>;

export const playgroundNote = needsConfirmation(
  'The model is simplified, but the mechanisms are not invented: retry with exponential backoff, a circuit breaker tripping on failure rate over a rolling window, load shedding under saturation, and idempotency keys preventing double charges when an ambiguous timeout hides a charge that actually landed.',
  'Playground caveat. Confirm you are comfortable with this framing of what the model does and does not claim.',
) satisfies Claim<string>;
