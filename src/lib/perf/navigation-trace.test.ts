import { describe, expect, it } from 'vitest';
import {
  buildNavigationTrace,
  formatMs,
  traceTotal,
  type NavigationTimings,
} from './navigation-trace';

const timings = (overrides: Partial<NavigationTimings> = {}): NavigationTimings => ({
  fetchStart: 100,
  domainLookupStart: 100,
  domainLookupEnd: 110,
  secureConnectionStart: 115,
  connectEnd: 140,
  requestStart: 140,
  responseStart: 200,
  responseEnd: 220,
  domInteractive: 300,
  ...overrides,
});

describe('buildNavigationTrace', () => {
  it('reports phases relative to fetchStart', () => {
    const [dns] = buildNavigationTrace(timings());
    expect(dns?.id).toBe('dns');
    expect(dns?.start).toBe(0);
    expect(dns?.duration).toBe(10);
  });

  it('omits TLS on a reused or plain connection', () => {
    // The browser reports secureConnectionStart as 0 when no handshake ran.
    const phases = buildNavigationTrace(timings({ secureConnectionStart: 0 }));
    expect(phases.map((p) => p.id)).not.toContain('tls');
  });

  it('omits phases the browser did not record', () => {
    // A memory-cache hit collapses DNS to a zero-length window.
    const phases = buildNavigationTrace(
      timings({ domainLookupStart: 100, domainLookupEnd: 100 }),
    );
    expect(phases.map((p) => p.id)).not.toContain('dns');
  });

  it('includes paint only when FCP is available', () => {
    expect(buildNavigationTrace(timings()).map((p) => p.id)).not.toContain('paint');
    expect(buildNavigationTrace(timings(), 340).map((p) => p.id)).toContain('paint');
  });

  it('appends hydration after the last measured phase', () => {
    const phases = buildNavigationTrace(timings(), 340, 12);
    const hydrate = phases.at(-1);
    const paint = phases.at(-2);
    expect(hydrate?.id).toBe('hydrate');
    expect(hydrate?.start).toBe((paint?.start ?? 0) + (paint?.duration ?? 0));
    expect(hydrate?.duration).toBe(12);
  });

  it('never emits a negative duration', () => {
    // Clock skew and early hints can invert these in the wild.
    const phases = buildNavigationTrace(timings({ domInteractive: 150 }));
    expect(phases.every((p) => p.duration >= 0)).toBe(true);
  });
});

describe('traceTotal', () => {
  it('spans the end of the last phase', () => {
    expect(traceTotal(buildNavigationTrace(timings()))).toBe(200);
  });

  it('is zero for an empty trace', () => {
    expect(traceTotal([])).toBe(0);
  });
});

describe('formatMs', () => {
  it('formats sub-10ms with one decimal', () => {
    expect(formatMs(4.26)).toBe('4.3ms');
  });

  it('rounds milliseconds above 10', () => {
    expect(formatMs(142.6)).toBe('143ms');
  });

  it('switches to seconds above 1000ms', () => {
    expect(formatMs(1420)).toBe('1.42s');
  });
});
