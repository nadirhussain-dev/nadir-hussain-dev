'use client';

import { useId, useMemo, useState } from 'react';
import { matchRole } from '@/lib/fit/match';
import { MonoLabel } from '@/components/ui/mono-label';

const EXAMPLE =
  'Senior Full-Stack Engineer. React, Next.js and TypeScript on the frontend, NestJS and PostgreSQL on the backend. Stripe billing experience is a plus. You will design REST APIs, ship to mobile with React Native, and run on AWS with Kubernetes.';

export function FitMatcher() {
  const [text, setText] = useState('');
  const inputId = useId();
  const result = useMemo(() => matchRole(text), [text]);
  const hasInput = text.trim() !== '';

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <label htmlFor={inputId} className="mb-3 block">
          <MonoLabel tone="flow">Job description</MonoLabel>
        </label>
        <textarea
          id={inputId}
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={10}
          placeholder="Paste a job description here."
          className="w-full resize-y rounded-sm border border-rule bg-ink-850 p-4 text-paper-200 placeholder:text-paper-500 focus:border-signal focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setText(EXAMPLE)}
            className="min-h-9 rounded-sm border border-rule bg-ink-850 px-3 text-meta font-bold text-paper-200 transition-colors duration-(--duration-quick) hover:border-rule-strong"
          >
            Try an example
          </button>
          <p className="text-meta text-paper-500">
            Runs in your browser. Nothing is sent or saved.
          </p>
        </div>
      </div>

      <div aria-live="polite">
        {!hasInput ? (
          <p className="text-pretty text-paper-400">
            Each requirement I can back up shows the work that proves it. Anything I
            can’t back up is listed as a gap.
          </p>
        ) : result.coverage === null ? (
          <p className="text-pretty text-paper-400">
            No technical requirements recognised yet. Paste more of the description.
          </p>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-h2 font-bold text-paper-100">
                {result.coverage}%
              </span>
              <span className="text-meta text-paper-400">
                {result.matched.length} with proof, {result.gaps.length}{' '}
                {result.gaps.length === 1 ? 'gap' : 'gaps'}
              </span>
            </div>

            {result.matched.length > 0 && (
              <ul className="mt-6 border-b border-rule">
                {result.matched.map((skill) => (
                  <li key={skill.id} className="border-t border-rule py-3">
                    <a href={skill.href} className="group block">
                      <span className="font-medium text-paper-100 group-hover:text-signal">
                        {skill.label}
                      </span>
                      <span className="mt-0.5 block text-meta text-pretty text-paper-400">
                        {skill.proof}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {result.gaps.length > 0 && (
              <div className="mt-6">
                <MonoLabel className="mb-2 block">No public proof yet</MonoLabel>
                <ul className="flex flex-wrap gap-1.5">
                  {result.gaps.map((gap) => (
                    <li
                      key={gap}
                      className="rounded-xs border border-rule px-2 py-1 font-mono text-micro text-paper-400"
                    >
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
