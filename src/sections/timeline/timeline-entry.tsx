'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import type { Experience } from '@/types/experience';
import { MonoLabel } from '@/components/ui/mono-label';
import { cn } from '@/lib/utils';

/**
 * One role on the spine.
 *
 * A career is a waterfall of overlapping spans, so the timeline borrows the
 * same visual grammar as the rest of the site rather than inventing a second
 * one: a spine, a node per role, and detail on demand.
 */
export function TimelineEntry({
  entry,
  isDraft,
  isCurrent,
}: {
  entry: Experience;
  isDraft: boolean;
  isCurrent: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li className="relative pb-10 pl-8 last:pb-0 sm:pl-10">
      {/* Spine. Stops at the last node rather than trailing into nothing. */}
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-0 left-[3px] w-px bg-rule last:hidden"
      />
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-2 left-0 size-[7px] rounded-full',
          isCurrent ? 'bg-signal' : 'bg-flow-dim',
        )}
      />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-h3 font-medium text-paper-100">{entry.role}</h3>
        {isDraft && <MonoLabel tone="signal">draft</MonoLabel>}
      </div>

      <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-paper-300">{entry.company}</span>
        {entry.period !== '' && <MonoLabel>{entry.period}</MonoLabel>}
      </p>

      <p className="mt-3 max-w-2xl text-pretty text-paper-400">{entry.summary}</p>

      {(entry.responsibilities.length > 0 ||
        entry.impact.length > 0 ||
        entry.technologies.length > 0) && (
        <>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={panelId}
            className="mt-4 inline-flex items-center gap-2 rounded-xs font-mono text-micro tracking-[0.08em] text-paper-500 uppercase transition-colors duration-(--duration-quick) hover:text-paper-200"
          >
            <Plus
              aria-hidden="true"
              className={cn(
                'size-3.5 transition-transform duration-(--duration-considered)',
                open && 'rotate-45',
              )}
            />
            {open ? 'less' : 'detail'}
          </button>

          <div id={panelId} hidden={!open} className="mt-6 max-w-2xl space-y-6">
            {isDraft && entry.needs !== undefined && (
              <p className="border-l-2 border-signal bg-signal/5 px-4 py-3 text-meta text-paper-300">
                <strong className="font-medium text-signal">Draft.</strong>{' '}
                {entry.needs}
              </p>
            )}

            {entry.responsibilities.length > 0 && (
              <div>
                <MonoLabel className="mb-2 block">owned</MonoLabel>
                <ul className="space-y-2">
                  {entry.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3 text-pretty text-paper-300">
                      <span aria-hidden="true" className="text-flow-dim">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {entry.impact.length > 0 && (
              <div>
                {/* Distinct from 'owned': what you were assigned and what
                    changed because you were there are different claims. */}
                <MonoLabel className="mb-2 block">what changed</MonoLabel>
                <ul className="space-y-2">
                  {entry.impact.map((item) => (
                    <li key={item} className="flex gap-3 text-pretty text-paper-300">
                      <span aria-hidden="true" className="text-flow-dim">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {entry.technologies.length > 0 && (
              <div>
                <MonoLabel className="mb-2 block">technologies</MonoLabel>
                <ul className="flex flex-wrap gap-1.5">
                  {entry.technologies.map((item) => (
                    <li
                      key={item}
                      className="rounded-xs border border-rule px-2 py-1 font-mono text-micro text-paper-400"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </li>
  );
}
