'use client';

import { useState } from 'react';
import { SPANS } from '@/data/spans';
import { useTraceProgress } from '@/hooks/use-trace-progress';
import { MonoLabel } from '@/components/ui/mono-label';
import { cn } from '@/lib/utils';

/**
 * The trace rail — navigation, scroll progress and hierarchy in one element.
 *
 * Each span is drawn as a bar whose width is proportional to how much of the
 * page that section actually occupies. Those widths are measured, not
 * authored, so the rail is a real scroll map rather than a decorated dot-nav.
 * Indentation encodes causal nesting, which is what a span waterfall means.
 *
 * Underneath it is a plain <nav> of in-page anchors: it works with JS disabled,
 * it is keyboard navigable for free, and smooth scrolling comes from CSS that
 * already respects prefers-reduced-motion.
 */
export function TraceRail() {
  const { activeId, extents, progress } = useTraceProgress();
  const [mobileOpen, setMobileOpen] = useState(false);

  const widestExtent = Math.max(
    ...extents.map((extent) => extent.extent),
    // Guard the first render, before anything has been measured.
    0.0001,
  );

  const activeSpan = SPANS.find((span) => span.id === activeId) ?? SPANS[0];

  const spanRows = SPANS.map((span) => {
    const measured = extents.find((extent) => extent.id === span.id);
    const width = measured ? (measured.extent / widestExtent) * 100 : 0;
    const isActive = span.id === activeId;

    return (
      <li key={span.id} style={{ paddingInlineStart: `${span.depth * 0.75}rem` }}>
        <a
          href={`#${span.id}`}
          aria-current={isActive ? 'true' : undefined}
          onClick={() => setMobileOpen(false)}
          className="group block rounded-xs py-2.5 xl:py-1.5"
        >
          <span
            className={cn(
              'block truncate font-mono text-micro tracking-[0.08em] uppercase transition-colors duration-(--duration-quick)',
              isActive ? 'text-signal' : 'text-paper-500 group-hover:text-paper-300',
            )}
          >
            {span.label}
          </span>
          {/* Measured extent. aria-hidden: the label already names the
              destination, so announcing a decorative width helps no one. */}
          <span
            aria-hidden="true"
            className={cn(
              'mt-1 block h-px transition-colors duration-(--duration-quick)',
              isActive ? 'bg-signal' : 'bg-flow-dim group-hover:bg-flow',
            )}
            style={{ width: `${Math.max(width, 6)}%` }}
          />
        </a>
      </li>
    );
  });

  return (
    <>
      {/* ---------------- Desktop rail ---------------- */}
      <nav
        aria-label="Trace"
        className="fixed top-0 z-40 hidden h-dvh w-(--spacing-rail) flex-col justify-center gap-6 pl-(--spacing-gutter) xl:flex"
      >
        <div className="flex items-center gap-2">
          <MonoLabel tone="flow">trace</MonoLabel>
          <span
            aria-hidden="true"
            className="h-1 w-1 animate-pulse rounded-full bg-signal"
          />
        </div>

        <div className="flex gap-3">
          {/* Playhead. A single transform-only element, so moving it never
              triggers layout. */}
          <div aria-hidden="true" className="relative w-px shrink-0 bg-rule">
            <span
              className="absolute left-1/2 h-6 w-px -translate-x-1/2 bg-signal"
              style={{ top: `${progress * 100}%` }}
            />
          </div>

          <ol className="min-w-0 flex-1 space-y-0.5">{spanRows}</ol>
        </div>
      </nav>

      {/* ---------------- Mobile bar ----------------
          A rail does not fit a phone, so mobile gets its own pattern rather
          than a shrunken desktop one: a slim status bar showing where you are,
          which expands to the full trace on demand. */}
      <nav
        aria-label="Trace"
        className="fixed inset-x-0 top-0 z-40 border-b border-rule bg-ink-900/85 backdrop-blur-md xl:hidden"
      >
        <div
          aria-hidden="true"
          className="h-px origin-left bg-signal transition-transform duration-(--duration-quick)"
          style={{ transform: `scaleX(${progress})` }}
        />
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="trace-mobile-list"
          className="flex h-[calc(var(--spacing-mobile-bar)-1px)] w-full items-center justify-between gap-4 px-(--spacing-gutter) text-left"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1 w-1 shrink-0 rounded-full bg-signal"
            />
            <MonoLabel tone="signal" className="truncate">
              {activeSpan?.label}
            </MonoLabel>
          </span>
          <MonoLabel>{mobileOpen ? 'close' : 'trace'}</MonoLabel>
        </button>

        <ol
          id="trace-mobile-list"
          hidden={!mobileOpen}
          className="border-t border-rule px-(--spacing-gutter) py-3"
        >
          {spanRows}
        </ol>
      </nav>
    </>
  );
}
