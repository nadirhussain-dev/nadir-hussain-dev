'use client';

import { useState } from 'react';
import { STACK, ALL_TECHNOLOGIES } from '@/data/stack';
import { projects } from '@/data/projects';
import { isPublishable } from '@/types/project';
import { MonoLabel } from '@/components/ui/mono-label';
import { cn } from '@/lib/utils';

/**
 * The stack grouped by the layer each technology operates at.
 *
 * Selecting one shows what Nadir does with it and which published case studies
 * use it. Those project links are derived from the project data rather than
 * maintained by hand, so the two can never disagree — and a technology whose
 * note is still a draft says so plainly instead of asserting expertise.
 */
export function StackExplorer({ showDrafts }: { showDrafts: boolean }) {
  const [selectedId, setSelectedId] = useState(ALL_TECHNOLOGIES[0]?.id ?? '');

  const selected =
    ALL_TECHNOLOGIES.find((technology) => technology.id === selectedId) ??
    ALL_TECHNOLOGIES[0];

  // Derived, never hand-maintained: only published projects can claim a stack.
  const usedIn = projects
    .filter(isPublishable)
    .filter((project) =>
      project.stack.some((item) => item.toLowerCase() === selected?.name.toLowerCase()),
    );

  const isDraft = selected?.provenance !== 'verified';

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
      <div className="min-w-0 space-y-8">
        {STACK.map((layer) => (
          <div key={layer.id}>
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <MonoLabel tone="flow">{layer.label}</MonoLabel>
              <span className="text-meta text-pretty text-paper-500">{layer.role}</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {layer.technologies.map((technology) => {
                const active = technology.id === selectedId;
                return (
                  <li key={technology.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(technology.id)}
                      aria-pressed={active}
                      className={cn(
                        'min-h-9 rounded-sm border px-3 py-1.5 font-mono text-meta transition-colors duration-(--duration-quick)',
                        active
                          ? 'border-signal bg-signal/10 text-signal'
                          : 'border-rule bg-ink-850 text-paper-300 hover:border-rule-strong',
                      )}
                    >
                      {technology.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div
        aria-live="polite"
        className="rule-frame min-w-0 p-5 sm:p-6 lg:sticky lg:top-24 lg:self-start"
      >
        <h3 className="text-h3 font-medium text-paper-100">{selected?.name}</h3>

        {isDraft ? (
          showDrafts ? (
            <p className="mt-4 border-l-2 border-signal bg-signal/5 px-4 py-3 text-meta text-paper-300">
              <strong className="font-medium text-signal">Draft.</strong>{' '}
              {selected?.note}
            </p>
          ) : (
            <p className="mt-4 text-pretty text-paper-400">
              Listed as part of the stack. The detail on how it is used is not written
              yet, and a generic description would say nothing.
            </p>
          )
        ) : (
          <p className="mt-4 text-pretty text-paper-300">{selected?.note}</p>
        )}

        <div className="mt-6 border-t border-rule pt-5">
          <MonoLabel className="mb-2 block">used in</MonoLabel>
          {usedIn.length === 0 ? (
            <p className="text-meta text-paper-500">
              No published case study references it yet.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {usedIn.map((project) => (
                <li key={project.slug}>
                  <a
                    href="#work"
                    className="rounded-xs border border-rule px-2 py-1 font-mono text-micro text-paper-300 transition-colors duration-(--duration-quick) hover:border-rule-strong hover:text-paper-100"
                  >
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
