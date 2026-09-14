'use client';

import { useEffect, useState } from 'react';
import { SPANS, type SpanId } from '@/data/spans';

export interface SpanExtent {
  id: SpanId;
  /** Where this span starts, as a fraction of total page scroll height. */
  start: number;
  /** How much of the page this span occupies, as a fraction. */
  extent: number;
}

export interface TraceProgress {
  activeId: SpanId | null;
  extents: readonly SpanExtent[];
  /** Overall read position, 0–1. */
  progress: number;
}

/**
 * Measures the page as a span waterfall.
 *
 * The rail draws each span's bar at a width proportional to how much of the
 * page that section actually occupies, so the bar lengths are real measured
 * data rather than decoration — the rail doubles as a scroll map.
 *
 * Uses IntersectionObserver for the active span and a rAF-coalesced scroll
 * handler for the playhead. No unthrottled scroll listeners.
 */
export function useTraceProgress(): TraceProgress {
  const [activeId, setActiveId] = useState<SpanId | null>(null);
  const [extents, setExtents] = useState<readonly SpanExtent[]>([]);
  const [progress, setProgress] = useState(0);

  // Measure section geometry. Re-measured on resize because the fluid type
  // scale changes section heights continuously, not just at breakpoints.
  useEffect(() => {
    const measure = (): void => {
      const pageHeight = document.documentElement.scrollHeight;
      if (pageHeight === 0) return;

      const next: SpanExtent[] = [];
      for (const span of SPANS) {
        const element = document.getElementById(span.id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        next.push({
          id: span.id,
          start: (rect.top + window.scrollY) / pageHeight,
          extent: rect.height / pageHeight,
        });
      }
      setExtents(next);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  // Active span.
  useEffect(() => {
    const elements = SPANS.map((span) => document.getElementById(span.id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the viewport among those visible,
        // so the rail never flickers between two overlapping sections.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
          );
        const top = visible[0];
        if (top) setActiveId(top.target.id as SpanId);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Playhead.
  useEffect(() => {
    let frame = 0;

    const update = (): void => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };

    const onScroll = (): void => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  return { activeId, extents, progress };
}
