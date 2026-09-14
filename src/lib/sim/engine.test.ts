import { describe, expect, it } from 'vitest';
import { createInitialState, percentile, step } from './engine';
import type { SimConfig, SimState } from './types';

const config = (overrides: Partial<SimConfig> = {}): SimConfig => ({
  rps: 200,
  concurrency: 256,
  failures: { coldCache: false, slowDatabase: false, pspTimeout: false },
  ...overrides,
});

/** Runs the simulation for `ms` of simulated time at a fixed 16ms step. */
const run = (simConfig: SimConfig, ms: number, seed = 1): SimState => {
  const state = createInitialState(seed);
  for (let elapsed = 0; elapsed < ms; elapsed += 16) {
    step(state, simConfig, 16);
  }
  return state;
};

describe('determinism', () => {
  it('produces identical runs from the same seed', () => {
    const a = run(config(), 3000, 42);
    const b = run(config(), 3000, 42);
    expect(a.stats).toEqual(b.stats);
    expect(a.timeMs).toBe(b.timeMs);
  });

  it('produces different runs from different seeds', () => {
    const a = run(
      config({ failures: { coldCache: false, slowDatabase: false, pspTimeout: true } }),
      3000,
      1,
    );
    const b = run(
      config({ failures: { coldCache: false, slowDatabase: false, pspTimeout: true } }),
      3000,
      999,
    );
    expect(a.stats).not.toEqual(b.stats);
  });
});

describe('arrivals', () => {
  it('accepts roughly the configured rate', () => {
    const state = run(config({ rps: 100 }), 10_000);
    // 100 rps for 10s, allowing for the fractional carry between ticks.
    expect(state.stats.accepted).toBeGreaterThan(990);
    expect(state.stats.accepted).toBeLessThanOrEqual(1001);
  });

  it('still admits traffic below one arrival per tick', () => {
    // 5 rps at a 16ms step is 0.08 arrivals per tick — without the fractional
    // carry this would round to zero and admit nothing at all.
    const state = run(config({ rps: 5 }), 10_000);
    expect(state.stats.accepted).toBeGreaterThan(45);
  });
});

describe('backpressure', () => {
  it('sheds load once the service tier saturates', () => {
    const state = run(config({ rps: 4000, concurrency: 32 }), 4000);
    expect(state.stats.shed).toBeGreaterThan(0);
  });

  it('does not shed when there is headroom', () => {
    const state = run(config({ rps: 20, concurrency: 256 }), 4000);
    expect(state.stats.shed).toBe(0);
  });

  it('never exceeds the concurrency limit', () => {
    const simConfig = config({ rps: 5000, concurrency: 64 });
    const state = createInitialState(7);
    for (let elapsed = 0; elapsed < 5000; elapsed += 16) {
      step(state, simConfig, 16);
      expect(state.active.length).toBeLessThanOrEqual(simConfig.concurrency);
    }
  });
});

describe('circuit breaker', () => {
  it('opens when the processor starts failing', () => {
    const state = run(
      config({ failures: { coldCache: false, slowDatabase: false, pspTimeout: true } }),
      12_000,
    );
    expect(['open', 'half-open']).toContain(state.breaker.state);
  });

  it('stays closed while the processor is healthy', () => {
    const state = run(config(), 12_000);
    expect(state.breaker.state).toBe('closed');
  });

  it('parks work instead of losing it while open', () => {
    const state = run(
      config({ failures: { coldCache: false, slowDatabase: false, pspTimeout: true } }),
      12_000,
    );
    expect(state.queue.length).toBeGreaterThan(0);
  });

  it('recovers once the processor is healthy again', () => {
    const failing = config({
      failures: { coldCache: false, slowDatabase: false, pspTimeout: true },
    });
    const state = createInitialState(3);
    for (let elapsed = 0; elapsed < 12_000; elapsed += 16) step(state, failing, 16);
    expect(state.breaker.state).not.toBe('closed');

    // Processor comes back.
    for (let elapsed = 0; elapsed < 30_000; elapsed += 16) step(state, config(), 16);
    expect(state.breaker.state).toBe('closed');
    expect(state.queue.length).toBe(0);
  });
});

describe('idempotency', () => {
  it('prevents double charges when timeouts hide successful authorisations', () => {
    const state = run(
      config({ failures: { coldCache: false, slowDatabase: false, pspTimeout: true } }),
      20_000,
    );
    expect(state.stats.duplicatesPrevented).toBeGreaterThan(0);
  });

  it('charges each key at most once', () => {
    const state = run(
      config({ failures: { coldCache: false, slowDatabase: false, pspTimeout: true } }),
      12_000,
    );
    const charged = state.active.filter((request) => request.charged);
    const keys = new Set(charged.map((request) => request.idempotencyKey));
    expect(keys.size).toBe(charged.length);
  });
});

describe('failure modes', () => {
  it('a cold cache raises latency without failing requests', () => {
    const warm = run(config({ rps: 60 }), 12_000, 5);
    const cold = run(
      config({
        rps: 60,
        failures: { coldCache: true, slowDatabase: false, pspTimeout: false },
      }),
      12_000,
      5,
    );
    expect(percentile(cold.latencies, 50)).toBeGreaterThan(
      percentile(warm.latencies, 50),
    );
    expect(cold.stats.failed).toBe(warm.stats.failed);
  });

  it('a slow database drives latency up sharply', () => {
    const healthy = run(config({ rps: 60 }), 12_000, 5);
    const slow = run(
      config({
        rps: 60,
        failures: { coldCache: false, slowDatabase: true, pspTimeout: false },
      }),
      12_000,
      5,
    );
    // A healthy run already carries a heavy tail from the processor call, so
    // the slow database roughly doubles p95 rather than exploding it. Asserting
    // a larger multiple here would be asserting a model that is not true.
    expect(percentile(slow.latencies, 95)).toBeGreaterThan(
      percentile(healthy.latencies, 95) * 2,
    );
  });

  it('retries the processor before giving up', () => {
    const state = run(
      config({ failures: { coldCache: false, slowDatabase: false, pspTimeout: true } }),
      12_000,
    );
    expect(state.stats.retried).toBeGreaterThan(0);
  });
});

describe('accounting', () => {
  it('never loses a request', () => {
    const state = run(
      config({
        rps: 400,
        concurrency: 64,
        failures: { coldCache: true, slowDatabase: false, pspTimeout: true },
      }),
      15_000,
    );
    const settled = state.stats.succeeded + state.stats.failed;
    const outstanding = state.active.length + state.queue.length;
    expect(settled + outstanding).toBe(state.stats.accepted);
  });

  it('keeps the latency window bounded', () => {
    const state = run(config({ rps: 500 }), 30_000);
    expect(state.latencies.length).toBeLessThanOrEqual(240);
  });
});

describe('percentile', () => {
  it('returns 0 for an empty window', () => {
    expect(percentile([], 95)).toBe(0);
  });

  it('orders values before indexing', () => {
    expect(percentile([50, 10, 30, 20, 40], 50)).toBe(30);
  });

  it('reports the maximum at p100', () => {
    expect(percentile([5, 1, 9, 3], 100)).toBe(9);
  });
});
