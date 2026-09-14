import { chance, createRng, next, sampleLatency, type Rng } from './random';
import type { SimConfig, SimRequest, SimState, Stage } from './types';

/**
 * A payments pipeline under stress.
 *
 * Deliberately a payments flow rather than a generic "scale the boxes" toy,
 * because the interesting failures in payments are not about throughput. They
 * are about what happens to money when a downstream processor gets slow: the
 * retries that save you, and the double charges those same retries cause.
 *
 * The model is a fixed-timestep simulation rather than an event queue. Both
 * are deterministic, but a fixed step maps cleanly onto animation frames and
 * keeps the state small enough to render directly.
 *
 * No React, no DOM, no timers — see ./README.md.
 */

/** Base stage latencies in milliseconds, before failure modes are applied. */
const BASE = {
  service: 4,
  databaseWarm: 6,
  databaseCold: 34,
  databaseSlow: 420,
  psp: 130,
  pspTimeout: 2400,
  settle: 90,
} as const;

const BREAKER = {
  /** Outcomes kept in the rolling window. */
  windowSize: 24,
  /** Minimum observations before the rate is trusted. Avoids opening on noise. */
  minVolume: 12,
  /** Failure rate at which the breaker opens. */
  failureRate: 0.5,
  /** How long it stays open before admitting a probe. */
  openMs: 4000,
} as const;

/** Records a processor outcome and reports whether the breaker should open. */
const recordOutcome = (state: SimState, failed: boolean): boolean => {
  const window = state.breaker.recentOutcomes;
  window.push(failed);
  if (window.length > BREAKER.windowSize) window.shift();
  if (window.length < BREAKER.minVolume) return false;
  const failures = window.reduce((total, entry) => total + (entry ? 1 : 0), 0);
  return failures / window.length >= BREAKER.failureRate;
};

const RETRY = {
  maxAttempts: 3,
  /** Exponential backoff base; attempt n waits base * 2^(n-1). */
  baseMs: 120,
} as const;

/** Keeps the percentile window bounded so a long run cannot grow without limit. */
const LATENCY_WINDOW = 240;

export const createInitialState = (seed = 20260914): SimState => ({
  timeMs: 0,
  rngState: createRng(seed).state,
  nextId: 1,
  arrivalDebt: 0,
  active: [],
  queue: [],
  breaker: {
    state: 'closed',
    recentOutcomes: [],
    openedAt: 0,
    probeInFlight: false,
  },
  chargedKeys: new Set<string>(),
  latencies: [],
  stats: {
    accepted: 0,
    succeeded: 0,
    failed: 0,
    retried: 0,
    duplicatesPrevented: 0,
    shed: 0,
  },
});

const stageDuration = (
  stage: Stage,
  config: SimConfig,
  rng: Rng,
  attempts: number,
): number => {
  switch (stage) {
    case 'service':
      return sampleLatency(rng, BASE.service);
    case 'database': {
      if (config.failures.slowDatabase) return sampleLatency(rng, BASE.databaseSlow);
      // A cold cache does not fail; it just stops absorbing reads, so every
      // request pays the full database cost instead of the cached one.
      const warm = !config.failures.coldCache && chance(rng, 0.88);
      return sampleLatency(rng, warm ? BASE.databaseWarm : BASE.databaseCold);
    }
    case 'psp':
      return config.failures.pspTimeout
        ? sampleLatency(rng, BASE.pspTimeout)
        : sampleLatency(rng, BASE.psp);
    case 'settling':
      return sampleLatency(rng, BASE.settle);
    case 'backoff':
      return RETRY.baseMs * 2 ** Math.max(attempts - 1, 0);
  }
};

/** Whether the processor call fails on this attempt. */
const pspFails = (config: SimConfig, rng: Rng): boolean =>
  chance(rng, config.failures.pspTimeout ? 0.72 : 0.015);

const recordLatency = (state: SimState, latency: number): void => {
  state.latencies.push(latency);
  if (state.latencies.length > LATENCY_WINDOW) state.latencies.shift();
};

const complete = (state: SimState, request: SimRequest, ok: boolean): void => {
  if (ok) {
    state.stats.succeeded += 1;
    recordLatency(state, state.timeMs - request.startedAt);
  } else {
    state.stats.failed += 1;
  }
};

/**
 * Advances the simulation by `dtMs` of simulated time.
 *
 * Mutates and returns `state`. That is deliberate: the state is large enough
 * that cloning it every frame would dominate the frame budget, and the
 * function is still deterministic and side-effect free with respect to
 * everything outside the object it is handed.
 */
export function step(state: SimState, config: SimConfig, dtMs: number): SimState {
  const rng: Rng = { state: state.rngState };
  state.timeMs += dtMs;

  // --- Breaker recovery -----------------------------------------------------
  if (
    state.breaker.state === 'open' &&
    state.timeMs - state.breaker.openedAt >= BREAKER.openMs
  ) {
    state.breaker.state = 'half-open';
    state.breaker.probeInFlight = false;
  }

  // --- Arrivals -------------------------------------------------------------
  state.arrivalDebt += (config.rps * dtMs) / 1000;
  while (state.arrivalDebt >= 1) {
    state.arrivalDebt -= 1;
    state.stats.accepted += 1;

    // Backpressure: a saturated service tier sheds load rather than queueing
    // without limit. Shedding fast is kinder than timing out slowly.
    if (state.active.length >= config.concurrency) {
      state.stats.shed += 1;
      state.stats.failed += 1;
      continue;
    }

    const id = state.nextId++;
    state.active.push({
      id,
      idempotencyKey: `idem_${id}`,
      stage: 'service',
      remaining: stageDuration('service', config, rng, 1),
      attempts: 1,
      startedAt: state.timeMs,
      charged: false,
    });
  }

  // --- Advance in-flight work ----------------------------------------------
  const stillActive: SimRequest[] = [];

  for (const request of state.active) {
    request.remaining -= dtMs;
    if (request.remaining > 0) {
      stillActive.push(request);
      continue;
    }

    switch (request.stage) {
      case 'service': {
        request.stage = 'database';
        request.remaining = stageDuration('database', config, rng, request.attempts);
        stillActive.push(request);
        break;
      }

      case 'database': {
        // An open breaker fails fast instead of piling more load onto a
        // processor that is already struggling. The work is not lost — it is
        // parked for the worker to settle once the breaker recovers.
        if (state.breaker.state === 'open') {
          state.queue.push(request);
          break;
        }
        if (state.breaker.state === 'half-open') {
          if (state.breaker.probeInFlight) {
            state.queue.push(request);
            break;
          }
          state.breaker.probeInFlight = true;
        }
        request.stage = 'psp';
        request.remaining = stageDuration('psp', config, rng, request.attempts);
        stillActive.push(request);
        break;
      }

      case 'psp': {
        // Idempotency: a retry whose original attempt actually landed must not
        // charge again. This is the failure mode that makes naive retries
        // dangerous in a payment system.
        if (state.chargedKeys.has(request.idempotencyKey)) {
          state.stats.duplicatesPrevented += 1;
          complete(state, request, true);
          if (state.breaker.state === 'half-open') {
            state.breaker.state = 'closed';
            state.breaker.recentOutcomes = [];
            state.breaker.probeInFlight = false;
          }
          break;
        }

        if (pspFails(config, rng)) {
          const shouldTrip = recordOutcome(state, true);

          if (state.breaker.state === 'half-open') {
            // The probe failed, so reopen rather than admitting the backlog.
            state.breaker.state = 'open';
            state.breaker.openedAt = state.timeMs;
            state.breaker.probeInFlight = false;
          } else if (state.breaker.state === 'closed' && shouldTrip) {
            state.breaker.state = 'open';
            state.breaker.openedAt = state.timeMs;
            state.breaker.recentOutcomes = [];
          }

          if (request.attempts < RETRY.maxAttempts) {
            // A timeout is ambiguous: the charge may well have landed. Model
            // that honestly rather than assuming failure means nothing
            // happened.
            if (config.failures.pspTimeout && chance(rng, 0.3)) {
              state.chargedKeys.add(request.idempotencyKey);
            }
            request.attempts += 1;
            request.stage = 'backoff';
            request.remaining = stageDuration('backoff', config, rng, request.attempts);
            state.stats.retried += 1;
            stillActive.push(request);
          } else {
            complete(state, request, false);
          }
          break;
        }

        recordOutcome(state, false);
        if (state.breaker.state === 'half-open') {
          state.breaker.state = 'closed';
          state.breaker.recentOutcomes = [];
          state.breaker.probeInFlight = false;
        }
        state.chargedKeys.add(request.idempotencyKey);
        request.charged = true;
        request.stage = 'settling';
        request.remaining = stageDuration('settling', config, rng, request.attempts);
        stillActive.push(request);
        break;
      }

      case 'backoff': {
        request.stage = 'psp';
        request.remaining = stageDuration('psp', config, rng, request.attempts);
        stillActive.push(request);
        break;
      }

      case 'settling': {
        complete(state, request, true);
        break;
      }
    }
  }

  state.active = stillActive;

  // --- Drain the queue once the breaker allows it --------------------------
  if (state.breaker.state === 'closed' && state.queue.length > 0) {
    const room = Math.max(config.concurrency - state.active.length, 0);
    // Bounded per tick so recovery is gradual rather than a second stampede.
    const admit = Math.min(room, state.queue.length, 6);
    for (let index = 0; index < admit; index += 1) {
      const request = state.queue.shift();
      if (!request) break;
      request.stage = 'psp';
      request.remaining = stageDuration('psp', config, rng, request.attempts);
      state.active.push(request);
    }
  }

  // Keep the charged-key set bounded; old keys cannot be retried any more.
  if (state.chargedKeys.size > 4000) state.chargedKeys.clear();

  state.rngState = rng.state;
  return state;
}

/** Latency percentile over the recent window. Returns 0 when there is no data. */
export function percentile(latencies: readonly number[], p: number): number {
  if (latencies.length === 0) return 0;
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((p / 100) * sorted.length) - 1),
  );
  return sorted[index] ?? 0;
}

/** Exposed so the UI can seed a fresh run without reaching into the RNG. */
export const advanceRng = (state: SimState): number => {
  const rng: Rng = { state: state.rngState };
  const value = next(rng);
  state.rngState = rng.state;
  return value;
};
