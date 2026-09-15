export type FailureMode = 'coldCache' | 'slowDatabase' | 'pspTimeout';

export interface SimConfig {
  /** Incoming payment attempts per second. */
  rps: number;
  failures: Readonly<Record<FailureMode, boolean>>;
  /** Concurrent requests the service tier can hold. Backpressure comes from here. */
  concurrency: number;
}

export type Stage = 'service' | 'database' | 'psp' | 'backoff' | 'settling';

export interface SimRequest {
  id: number;
  /** Stable across retries — this is what makes deduplication possible. */
  idempotencyKey: string;
  stage: Stage;
  /** Sim-time ms remaining in the current stage. */
  remaining: number;
  attempts: number;
  startedAt: number;
  /** True once the charge has actually been authorised downstream. */
  charged: boolean;
}

export type BreakerState = 'closed' | 'open' | 'half-open';

export interface SimStats {
  accepted: number;
  succeeded: number;
  failed: number;
  retried: number;
  /** Retries that arrived after the charge already landed. */
  duplicatesPrevented: number;
  /** Requests shed because the service tier was saturated. */
  shed: number;
}

export interface SimState {
  timeMs: number;
  rngState: number;
  nextId: number;
  /** Fractional arrivals carried between ticks so low RPS still works. */
  arrivalDebt: number;
  active: SimRequest[];
  /** Awaiting a worker after the breaker opened. */
  queue: SimRequest[];
  breaker: {
    state: BreakerState;
    /**
     * Rolling window of recent processor outcomes, true meaning failure.
     *
     * A real breaker trips on failure RATE over a window, not on consecutive
     * failures: under partial failure, interleaved successes keep resetting a
     * consecutive counter and the breaker never opens when it most needs to.
     */
    recentOutcomes: boolean[];
    openedAt: number;
    probeInFlight: boolean;
  };
  /** Idempotency keys that have already resulted in a charge. */
  chargedKeys: Set<string>;
  /** Recent completion latencies, for percentiles. */
  latencies: number[];
  stats: SimStats;
}
