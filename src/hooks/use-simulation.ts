'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createInitialState, percentile, step } from '@/lib/sim/engine';
import type { SimConfig, SimState } from '@/lib/sim/types';
import { useReducedMotion } from './use-reduced-motion';

/** The numbers shown to the reader. Sampled, not updated every frame. */
export interface SimSnapshot {
  p50: number;
  p95: number;
  inFlight: number;
  queueDepth: number;
  breaker: SimState['breaker']['state'];
  accepted: number;
  succeeded: number;
  failed: number;
  retried: number;
  duplicatesPrevented: number;
  shed: number;
}

/** Simulated milliseconds per step. Fixed, so behaviour never depends on frame rate. */
const STEP_MS = 16;
/** How often the React-visible numbers refresh. Fast enough to feel live, slow
 *  enough to be readable and to keep React out of the frame budget. */
const SNAPSHOT_INTERVAL_MS = 200;

/** Pre-run readout. A constant rather than a ref read, because refs must not
 *  be touched during render. */
const EMPTY_SNAPSHOT: SimSnapshot = {
  p50: 0,
  p95: 0,
  inFlight: 0,
  queueDepth: 0,
  breaker: 'closed',
  accepted: 0,
  succeeded: 0,
  failed: 0,
  retried: 0,
  duplicatesPrevented: 0,
  shed: 0,
};

const snapshotOf = (state: SimState): SimSnapshot => ({
  p50: percentile(state.latencies, 50),
  p95: percentile(state.latencies, 95),
  inFlight: state.active.length,
  queueDepth: state.queue.length,
  breaker: state.breaker.state,
  accepted: state.stats.accepted,
  succeeded: state.stats.succeeded,
  failed: state.stats.failed,
  retried: state.stats.retried,
  duplicatesPrevented: state.stats.duplicatesPrevented,
  shed: state.stats.shed,
});

/**
 * Drives the simulation on an animation frame loop.
 *
 * Two deliberate separations keep this cheap:
 *
 * 1. The simulation state lives in a ref, not in React state. It changes 60
 *    times a second; re-rendering at that rate would dominate the frame budget
 *    for no benefit.
 * 2. The canvas reads that ref directly through `onFrame`. Only the numeric
 *    readout goes through React, five times a second.
 *
 * Under reduced motion the simulation still runs — it is the substance of the
 * section, not decoration — but it advances in larger, less frequent steps so
 * nothing animates continuously.
 */
export function useSimulation(config: SimConfig, running: boolean) {
  const reducedMotion = useReducedMotion();

  const stateRef = useRef<SimState>(createInitialState());
  const configRef = useRef<SimConfig>(config);
  const frameRef = useRef<((state: SimState) => void) | null>(null);
  const [snapshot, setSnapshot] = useState<SimSnapshot>(EMPTY_SNAPSHOT);

  // Mirrored into a ref in an effect rather than during render, so the frame
  // loop can read the latest config without being torn down and restarted
  // every time a slider moves.
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const onFrame = useCallback((callback: (state: SimState) => void) => {
    frameRef.current = callback;
  }, []);

  const reset = useCallback(() => {
    stateRef.current = createInitialState();
    setSnapshot(snapshotOf(stateRef.current));
    frameRef.current?.(stateRef.current);
  }, []);

  useEffect(() => {
    if (!running) return;

    let raf = 0;
    let lastSnapshot = 0;
    let lastTime = performance.now();

    const tick = (now: number): void => {
      const elapsed = now - lastTime;
      lastTime = now;

      // Clamp so a backgrounded tab does not resume by simulating the minutes
      // it was away in a single frame.
      const budget = Math.min(elapsed, reducedMotion ? 400 : 48);
      for (let consumed = 0; consumed < budget; consumed += STEP_MS) {
        step(stateRef.current, configRef.current, STEP_MS);
      }

      frameRef.current?.(stateRef.current);

      if (now - lastSnapshot >= SNAPSHOT_INTERVAL_MS) {
        lastSnapshot = now;
        setSnapshot(snapshotOf(stateRef.current));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, reducedMotion]);

  return { snapshot, stateRef, onFrame, reset, reducedMotion } as const;
}
