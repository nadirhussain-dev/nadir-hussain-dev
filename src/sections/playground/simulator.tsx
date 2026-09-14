'use client';

import { useMemo, useState } from 'react';
import { useSimulation } from '@/hooks/use-simulation';
import type { FailureMode, SimConfig } from '@/lib/sim/types';
import { MonoLabel } from '@/components/ui/mono-label';
import { PipelineCanvas } from './pipeline-canvas';
import { cn } from '@/lib/utils';

const FAILURES: readonly {
  id: FailureMode;
  label: string;
  teaches: string;
}[] = [
  {
    id: 'coldCache',
    label: 'Cold cache',
    teaches:
      'Every read now reaches the database. Latency climbs, but nothing fails — a cache is a performance layer, not an availability one.',
  },
  {
    id: 'slowDatabase',
    label: 'Slow database',
    teaches:
      'Requests hold their slot for far longer, so the service tier saturates and starts shedding. The database never went down; capacity did.',
  },
  {
    id: 'pspTimeout',
    label: 'Processor timing out',
    teaches:
      'Retries fire, the breaker trips, and work parks instead of hammering a struggling processor. Watch duplicates prevented: a timeout is ambiguous, so some of those charges did land — the idempotency key is the only reason they are not charged twice.',
  },
];

const RPS_STEPS = [10, 50, 200, 1000, 5000] as const;

const BREAKER_TONE = {
  closed: 'text-status-ok',
  'half-open': 'text-status-warn',
  open: 'text-status-fail',
} as const;

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="min-w-0">
      <MonoLabel className="block truncate">{label}</MonoLabel>
      <span
        className={cn(
          'mt-1 block font-mono text-lead tabular-nums',
          tone ?? 'text-paper-100',
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function Simulator() {
  const [rpsIndex, setRpsIndex] = useState(1);
  const [failures, setFailures] = useState<Record<FailureMode, boolean>>({
    coldCache: false,
    slowDatabase: false,
    pspTimeout: false,
  });
  const [running, setRunning] = useState(true);

  const rps = RPS_STEPS[rpsIndex] ?? 50;

  // Memoised so the frame loop's config ref is not rewritten every render.
  const config = useMemo<SimConfig>(
    () => ({ rps, concurrency: 256, failures }),
    [rps, failures],
  );

  const { snapshot, onFrame, reset, reducedMotion } = useSimulation(config, running);

  const settled = snapshot.succeeded + snapshot.failed;
  const successRate = settled === 0 ? 100 : (snapshot.succeeded / settled) * 100;

  const activeLessons = FAILURES.filter((failure) => failures[failure.id]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
      <div className="min-w-0">
        <div className="rule-frame p-4 sm:p-5">
          <PipelineCanvas onFrame={onFrame} reducedMotion={reducedMotion} />
        </div>

        {/* The same state as text. The canvas is an illustration of these
            numbers, never the only way to read them. */}
        <div
          aria-live="polite"
          aria-atomic="false"
          className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3"
        >
          <Metric label="p50 latency" value={`${Math.round(snapshot.p50)}ms`} />
          <Metric label="p95 latency" value={`${Math.round(snapshot.p95)}ms`} />
          <Metric
            label="success rate"
            value={`${successRate.toFixed(1)}%`}
            tone={
              successRate > 99
                ? 'text-status-ok'
                : successRate > 90
                  ? 'text-status-warn'
                  : 'text-status-fail'
            }
          />
          <Metric label="in flight" value={snapshot.inFlight.toLocaleString()} />
          <Metric
            label="parked"
            value={snapshot.queueDepth.toLocaleString()}
            tone={snapshot.queueDepth > 0 ? 'text-status-fail' : undefined}
          />
          <Metric
            label="breaker"
            value={snapshot.breaker}
            tone={BREAKER_TONE[snapshot.breaker]}
          />
          <Metric label="retried" value={snapshot.retried.toLocaleString()} />
          <Metric label="shed" value={snapshot.shed.toLocaleString()} />
          <Metric
            label="dupes prevented"
            value={snapshot.duplicatesPrevented.toLocaleString()}
            tone={snapshot.duplicatesPrevented > 0 ? 'text-signal' : undefined}
          />
        </div>
      </div>

      {/* ---------------- Controls ---------------- */}
      <div className="min-w-0 space-y-8">
        <div>
          <label htmlFor="rps" className="block">
            <MonoLabel>incoming traffic</MonoLabel>
          </label>
          <output
            htmlFor="rps"
            className="mt-1 block font-mono text-h3 text-paper-100 tabular-nums"
          >
            {rps.toLocaleString()} <span className="text-paper-500">rps</span>
          </output>
          <input
            id="rps"
            type="range"
            min={0}
            max={RPS_STEPS.length - 1}
            step={1}
            value={rpsIndex}
            onChange={(event) => setRpsIndex(Number(event.target.value))}
            aria-valuetext={`${rps} requests per second`}
            className="mt-3 w-full accent-[var(--color-signal)]"
          />
          <div aria-hidden="true" className="mt-1 flex justify-between">
            {RPS_STEPS.map((value) => (
              <MonoLabel key={value}>
                {value >= 1000 ? `${value / 1000}k` : value}
              </MonoLabel>
            ))}
          </div>
        </div>

        <fieldset className="min-w-0 border-0 p-0">
          <legend className="mb-3 p-0">
            <MonoLabel>inject failure</MonoLabel>
          </legend>
          <div className="space-y-2">
            {FAILURES.map((failure) => {
              const checked = failures[failure.id];
              return (
                <label
                  key={failure.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-sm border px-3 py-2.5 transition-colors duration-(--duration-quick)',
                    checked
                      ? 'border-status-fail/60 bg-status-fail/10'
                      : 'border-rule bg-ink-850 hover:border-rule-strong',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      setFailures((current) => ({
                        ...current,
                        [failure.id]: event.target.checked,
                      }))
                    }
                    className="size-4 shrink-0 accent-[var(--color-status-fail)]"
                  />
                  <span className="text-paper-200">{failure.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            className="rounded-sm border border-rule bg-ink-850 px-4 py-2 font-mono text-meta text-paper-200 transition-colors duration-(--duration-quick) hover:border-rule-strong"
          >
            {running ? 'Pause' : 'Resume'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-sm border border-rule bg-ink-850 px-4 py-2 font-mono text-meta text-paper-200 transition-colors duration-(--duration-quick) hover:border-rule-strong"
          >
            Reset
          </button>
        </div>

        {/* Explains what the reader is looking at, rather than leaving the
            simulation as a toy with no takeaway. */}
        <div aria-live="polite" className="min-h-32">
          {activeLessons.length === 0 ? (
            <p className="text-meta text-pretty text-paper-400">
              Healthy. Raise the traffic or inject a failure to see where this pipeline
              gives way first.
            </p>
          ) : (
            <ul className="space-y-3">
              {activeLessons.map((lesson) => (
                <li key={lesson.id}>
                  <MonoLabel tone="signal">{lesson.label}</MonoLabel>
                  <p className="mt-1 text-meta text-pretty text-paper-400">
                    {lesson.teaches}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
