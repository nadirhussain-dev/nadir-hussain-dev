'use client';

import { useState } from 'react';
import { useNavigationTrace } from '@/hooks/use-navigation-trace';
import { formatMs, traceTotal, type PhaseId } from '@/lib/perf/navigation-trace';
import { MonoLabel } from '@/components/ui/mono-label';
import { cn } from '@/lib/utils';

/**
 * The trace of the request that delivered this page.
 *
 * These are real Navigation Timing measurements from the visitor's own
 * browser, not a mock and not an animation on a loop. That is the entire
 * reason this exists: a portfolio claiming systems literacy should be able to
 * show its own request breakdown. It also means the numbers stay honest even
 * when they are unflattering.
 *
 * Renders nothing until measurements exist, so there is no layout shift and no
 * skeleton pretending to be data.
 */
export function LoadTrace() {
  const phases = useNavigationTrace();
  const [openPhase, setOpenPhase] = useState<PhaseId | null>(null);

  if (phases.length === 0) return null;

  const total = traceTotal(phases);
  const active = phases.find((phase) => phase.id === openPhase);

  return (
    <figure className="rule-frame m-0 w-full max-w-xl p-5 sm:p-6">
      <figcaption className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <MonoLabel tone="flow">this page load</MonoLabel>
        <MonoLabel>{formatMs(total)} total</MonoLabel>
      </figcaption>

      <ul className="space-y-1.5">
        {phases.map((phase) => {
          const isOpen = phase.id === openPhase;
          return (
            <li key={phase.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenPhase(isOpen ? null : phase.id)}
                onMouseEnter={() => setOpenPhase(phase.id)}
                className="group grid w-full grid-cols-[4.5rem_1fr_4rem] items-center gap-3 rounded-xs py-1 text-left sm:grid-cols-[5.5rem_1fr_4.5rem]"
              >
                <MonoLabel
                  tone={isOpen ? 'signal' : 'muted'}
                  className="truncate transition-colors duration-(--duration-quick)"
                >
                  {phase.label}
                </MonoLabel>

                {/* Positioned by start, sized by duration — a waterfall, so
                    causality is visible rather than implied. */}
                <span
                  aria-hidden="true"
                  className="relative block h-1.5 w-full overflow-hidden rounded-full bg-ink-800"
                >
                  <span
                    className={cn(
                      'absolute inset-y-0 rounded-full transition-colors duration-(--duration-quick)',
                      isOpen ? 'bg-signal' : 'bg-flow-dim group-hover:bg-flow',
                    )}
                    style={{
                      insetInlineStart: `${(phase.start / total) * 100}%`,
                      // Floor the width so a sub-millisecond phase stays
                      // visible instead of collapsing to nothing.
                      width: `max(2px, ${(phase.duration / total) * 100}%)`,
                    }}
                  />
                </span>

                <MonoLabel className="text-right tabular-nums">
                  {formatMs(phase.duration)}
                </MonoLabel>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Reserved height so opening an explanation never shifts the layout. */}
      <p
        aria-live="polite"
        className="mt-5 min-h-16 text-meta text-pretty text-paper-400 sm:min-h-12"
      >
        {active?.explain ?? 'Hover or select a phase to see what it covers.'}
      </p>

      <p className="mt-4 border-t border-rule pt-3 text-micro text-paper-500">
        Measured in your browser via the Navigation Timing API. Not a mock.
      </p>
    </figure>
  );
}
