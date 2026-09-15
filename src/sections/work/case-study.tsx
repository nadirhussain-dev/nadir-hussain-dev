'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Project } from '@/types/project';
import { MonoLabel } from '@/components/ui/mono-label';
import { Hairline } from '@/components/ui/hairline';
import { cn } from '@/lib/utils';

/**
 * A project as a decision log.
 *
 * Not a card with a screenshot. What makes engineering work legible is not
 * what was built but what was chosen and what it cost, so the centre of this
 * layout is a list of decisions, each naming the alternative that was rejected
 * — a decision with no stated alternative is just a description.
 *
 * Progressive disclosure: the summary is enough to decide whether to read on,
 * and the depth is one keystroke away rather than dumped on arrival.
 */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <MonoLabel className="mb-2 block">{label}</MonoLabel>
      {children}
    </div>
  );
}

export function CaseStudy({
  project,
  index,
  isDraft,
}: {
  project: Project;
  index: number;
  isDraft: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article className="border-t border-rule">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-start gap-4 py-6 text-left sm:gap-6 sm:py-8"
        >
          <MonoLabel
            tone="flow"
            aria-hidden="true"
            className="mt-2 hidden shrink-0 sm:block"
          >
            {String(index + 1).padStart(2, '0')}
          </MonoLabel>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-h3 font-medium text-paper-100">{project.name}</span>
              {project.period !== '' && <MonoLabel>{project.period}</MonoLabel>}
              {isDraft && <MonoLabel tone="signal">draft</MonoLabel>}
            </span>
            <span className="mt-1.5 block text-pretty text-paper-400">
              {project.summary}
            </span>
          </span>

          <ChevronDown
            aria-hidden="true"
            className={cn(
              'mt-1.5 size-5 shrink-0 text-paper-500 transition-transform duration-(--duration-considered)',
              open && 'rotate-180',
            )}
          />
        </button>
      </h3>

      <div id={panelId} hidden={!open} className="pb-10 sm:pl-[3.25rem]">
        {isDraft && project.needs !== undefined && (
          <p className="mb-8 border-l-2 border-signal bg-signal/5 px-4 py-3 text-meta text-paper-300">
            <strong className="font-medium text-signal">Draft.</strong> {project.needs}{' '}
            This entry is excluded from the production build.
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-8">
            <Field label="problem">
              <p className="text-pretty text-paper-300">{project.problem}</p>
            </Field>

            <Field label="constraints">
              <ul className="space-y-2">
                {project.constraints.map((constraint) => (
                  <li
                    key={constraint}
                    className="flex gap-3 text-pretty text-paper-300"
                  >
                    <span aria-hidden="true" className="text-flow-dim">
                      —
                    </span>
                    {constraint}
                  </li>
                ))}
              </ul>
            </Field>

            <Field label="architecture">
              <p className="text-pretty text-paper-300">{project.architecture}</p>
              {project.architectureNodes.length > 0 && (
                <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2">
                  {project.architectureNodes.map((node, nodeIndex) => (
                    <li key={node} className="flex items-center gap-1.5">
                      {nodeIndex > 0 && (
                        <span aria-hidden="true" className="text-flow-dim">
                          →
                        </span>
                      )}
                      <span className="rounded-xs border border-rule bg-ink-850 px-2 py-1 font-mono text-micro text-paper-300">
                        {node}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </Field>
          </div>

          <div className="space-y-8">
            <Field label="decisions">
              <ul className="space-y-5">
                {project.decisions.map((decision) => (
                  <li key={decision.choice}>
                    <p className="font-medium text-pretty text-paper-100">
                      {decision.choice}
                    </p>
                    <p className="mt-1 text-meta text-pretty text-paper-500">
                      instead of {decision.insteadOf}
                    </p>
                    <p className="mt-1.5 text-pretty text-paper-300">
                      {decision.because}
                    </p>
                  </li>
                ))}
              </ul>
            </Field>

            <Field label="what was hard">
              <ul className="space-y-2">
                {project.challenges.map((challenge) => (
                  <li key={challenge} className="flex gap-3 text-pretty text-paper-300">
                    <span aria-hidden="true" className="text-flow-dim">
                      —
                    </span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </Field>

            <Field label="outcome">
              <p className="text-pretty text-paper-300">{project.outcome}</p>
            </Field>

            {project.stack.length > 0 && (
              <>
                <Hairline />
                <Field label="stack">
                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.map((item) => (
                      <li
                        key={item}
                        className="rounded-xs border border-rule px-2 py-1 font-mono text-micro text-paper-400"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Field>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
