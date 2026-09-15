'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void): (() => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const getSnapshot = (): boolean => window.matchMedia(QUERY).matches;

/**
 * Assumes motion is allowed on the server, matching the CSS default, so the
 * server and hydration renders agree. The CSS media query handles the initial
 * paint on its own; this hook exists for behaviour that CSS cannot express —
 * here, how often the simulation redraws.
 */
const getServerSnapshot = (): boolean => false;

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
