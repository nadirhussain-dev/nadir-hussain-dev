'use client';

import { useSyncExternalStore } from 'react';
import { buildNavigationTrace, type TracePhase } from '@/lib/perf/navigation-trace';

/**
 * Reads the real Navigation Timing entry for this page load.
 *
 * Implemented with useSyncExternalStore rather than an effect-plus-setState.
 * Performance entries are external, browser-owned state, which is precisely
 * what this hook is for — and it keeps the server snapshot explicit, so the
 * hero renders identical HTML on the server and during hydration.
 *
 * The snapshot is computed once and cached at module scope because
 * getSnapshot runs on every render and must return a stable reference;
 * returning a fresh array would spin React into an infinite loop.
 */

const EMPTY: readonly TracePhase[] = [];

let cached: readonly TracePhase[] | null = null;

const computeSnapshot = (): readonly TracePhase[] => {
  if (cached !== null) return cached;

  // The first client render is the closest observable point to hydration.
  const now = performance.now();

  const [navigation] = performance.getEntriesByType(
    'navigation',
  ) as PerformanceNavigationTiming[];

  if (!navigation) {
    cached = EMPTY;
    return cached;
  }

  const paintTime = performance
    .getEntriesByType('paint')
    .find((entry) => entry.name === 'first-contentful-paint')?.startTime;

  // Hydration is the window between the page becoming visible and React
  // attaching to it.
  const hydrationStart = paintTime ?? navigation.domInteractive;

  cached = buildNavigationTrace(navigation, paintTime, now - hydrationStart);
  return cached;
};

/** Measurements never change after the load, so nothing ever needs to notify. */
const subscribe = (): (() => void) => () => {};

const getServerSnapshot = (): readonly TracePhase[] => EMPTY;

export function useNavigationTrace(): readonly TracePhase[] {
  return useSyncExternalStore(subscribe, computeSnapshot, getServerSnapshot);
}
