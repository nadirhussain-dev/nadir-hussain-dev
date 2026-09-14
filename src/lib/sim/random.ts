/**
 * Deterministic PRNG (mulberry32).
 *
 * The simulation must be reproducible: the same seed and the same inputs have
 * to produce the same run, or the tests below it are worthless and a visitor
 * comparing two configurations would be comparing noise. Math.random cannot
 * give that, so the generator state is carried explicitly in the sim state.
 */
export interface Rng {
  state: number;
}

export const createRng = (seed: number): Rng => ({ state: seed >>> 0 });

/** Returns a float in [0, 1) and advances the generator. */
export function next(rng: Rng): number {
  rng.state = (rng.state + 0x6d2b79f5) >>> 0;
  let t = rng.state;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** True with probability `p`. */
export const chance = (rng: Rng, p: number): boolean => next(rng) < p;

/**
 * Samples a latency around `base` with a long right tail.
 *
 * Real service latencies are not symmetric — the tail is what actually hurts,
 * and a normal distribution would hide exactly the behaviour this simulation
 * exists to show.
 */
export function sampleLatency(rng: Rng, base: number): number {
  const u = Math.max(next(rng), 1e-9);
  // Log-normal-ish: median stays near base, with occasional multiples of it.
  return base * Math.exp(-Math.log(u) * 0.45) * 0.7;
}
