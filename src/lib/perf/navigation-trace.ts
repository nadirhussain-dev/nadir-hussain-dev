/**
 * Builds a span waterfall from the Navigation Timing API.
 *
 * The hero shows the trace of the request that delivered the page the visitor
 * is currently looking at — measured in their browser, not mocked. That is the
 * whole point: a portfolio claiming systems literacy should be able to show
 * its own request breakdown rather than animate a decorative one.
 *
 * Pure. Takes timings in, returns spans out — no DOM access, no globals — so
 * it is unit-testable against synthetic timings.
 */

export type PhaseId =
  'dns' | 'tls' | 'request' | 'response' | 'dom' | 'paint' | 'hydrate';

export interface TracePhase {
  id: PhaseId;
  label: string;
  /** Milliseconds from navigation start. */
  start: number;
  /** Milliseconds. */
  duration: number;
  /** What this phase actually is, shown on hover/focus. */
  explain: string;
}

/** The subset of PerformanceNavigationTiming this module needs. */
export interface NavigationTimings {
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  secureConnectionStart: number;
  connectEnd: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  domInteractive: number;
}

const EXPLAIN: Record<PhaseId, string> = {
  dns: 'Resolving the hostname to an address. Usually cached; a cold lookup is the first thing a CDN removes.',
  tls: 'TLS handshake. One round trip on a resumed session, more on a cold one — which is why connection reuse matters.',
  request:
    'Time until the first byte comes back. This is the part a server, a cache or an edge location actually moves.',
  response:
    'Streaming the document down the wire. Bounded by payload size, not by latency.',
  dom: 'Parsing the document and building the DOM, up to interactive.',
  paint: 'First contentful paint — the first moment the page stopped being blank.',
  hydrate:
    'React attaching to the server-rendered HTML. Kept small here by shipping most of this page as Server Components.',
};

const LABEL: Record<PhaseId, string> = {
  dns: 'dns',
  tls: 'tls',
  request: 'request',
  response: 'response',
  dom: 'dom',
  paint: 'paint',
  hydrate: 'hydrate',
};

const phase = (
  id: PhaseId,
  start: number,
  end: number,
  origin: number,
): TracePhase | null => {
  const duration = end - start;
  // Sub-tenth-of-a-millisecond phases are noise, and a negative duration means
  // the browser did not record that phase at all (cache hits, early hints).
  if (!Number.isFinite(duration) || duration < 0.1) return null;
  return {
    id,
    label: LABEL[id],
    start: start - origin,
    duration,
    explain: EXPLAIN[id],
  };
};

/**
 * @param timings  Navigation Timing entry.
 * @param firstContentfulPaint  FCP in the same time base, when available.
 * @param hydrationDuration  Measured by the client on mount, when available.
 */
export function buildNavigationTrace(
  timings: NavigationTimings,
  firstContentfulPaint?: number,
  hydrationDuration?: number,
): TracePhase[] {
  const origin = timings.fetchStart;

  const phases = [
    phase('dns', timings.domainLookupStart, timings.domainLookupEnd, origin),
    // secureConnectionStart is 0 on a plain HTTP or reused connection.
    timings.secureConnectionStart > 0
      ? phase('tls', timings.secureConnectionStart, timings.connectEnd, origin)
      : null,
    phase('request', timings.requestStart, timings.responseStart, origin),
    phase('response', timings.responseStart, timings.responseEnd, origin),
    phase('dom', timings.responseEnd, timings.domInteractive, origin),
    firstContentfulPaint !== undefined
      ? phase('paint', timings.domInteractive, firstContentfulPaint, origin)
      : null,
  ].filter((entry): entry is TracePhase => entry !== null);

  if (hydrationDuration !== undefined && hydrationDuration >= 0.1) {
    const last = phases[phases.length - 1];
    phases.push({
      id: 'hydrate',
      label: LABEL.hydrate,
      start: last ? last.start + last.duration : 0,
      duration: hydrationDuration,
      explain: EXPLAIN.hydrate,
    });
  }

  return phases;
}

/** Total wall time covered by the trace, for scaling the bars. */
export function traceTotal(phases: readonly TracePhase[]): number {
  return phases.reduce((max, entry) => Math.max(max, entry.start + entry.duration), 0);
}

/** Formats a duration the way a tracing UI would. */
export function formatMs(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(2)}s`;
  if (value >= 10) return `${Math.round(value)}ms`;
  return `${value.toFixed(1)}ms`;
}
