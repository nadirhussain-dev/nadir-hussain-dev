'use client';

import { useEffect, useId, useState } from 'react';
import { Plus } from 'lucide-react';
import type { Project } from '@/types/project';
import { cn } from '@/lib/utils';

export interface BookStyle {
  color: string;
  left: string;
  right: string;
}

/** One project as a book in the stack. Opening it shows what mattered. */
export function Book({ project, look }: { project: Project; look: BookStyle }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Links from the terminal and the role matcher arrive with the book open.
  useEffect(() => {
    const openIfTargeted = (): void => {
      if (window.location.hash === `#${project.slug}`) setOpen(true);
    };
    openIfTargeted();
    window.addEventListener('hashchange', openIfTargeted);
    return () => window.removeEventListener('hashchange', openIfTargeted);
  }, [project.slug]);

  return (
    <article
      id={project.slug}
      data-open={open}
      className="book scroll-mt-24"
      style={
        {
          '--book': look.color,
          '--book-left': look.left,
          '--book-right': look.right,
        } as React.CSSProperties
      }
    >
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-4 pr-4 pl-7 text-left sm:py-5 sm:pr-7 sm:pl-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
        >
          <span className="text-h3 leading-tight font-bold">{project.name}</span>
          <span className="order-3 col-span-2 mt-1 font-sans text-meta font-medium text-pretty text-white/85 md:order-none md:col-span-1 md:mt-0">
            {project.period}
          </span>
          <Plus
            aria-hidden="true"
            className={cn(
              'size-6 transition-transform duration-300',
              open && 'rotate-45',
            )}
          />
        </button>
      </h3>

      <div id={panelId} hidden={!open} className="px-7 pb-8 sm:px-9">
        <p className="max-w-2xl text-lead text-pretty">{project.summary}</p>

        {project.decisions.length > 0 && (
          <>
            <h4 className="mt-7 font-bold">Key decisions</h4>
            <ul className="mt-2 grid max-w-4xl gap-x-8 gap-y-4 md:grid-cols-2">
              {project.decisions.slice(0, 2).map((decision) => (
                <li key={decision.choice} className="text-pretty">
                  <strong className="block">{decision.choice}</strong>
                  <span className="text-white/90">{decision.because}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <h4 className="mt-7 font-bold">Result</h4>
        <p className="mt-1 max-w-2xl text-pretty text-white/90">{project.outcome}</p>

        <p className="mt-5 text-meta font-medium text-white/85">
          {project.stack.join(', ')}
        </p>

        {project.source !== undefined && (
          <a
            href={project.source}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-bold underline underline-offset-4"
          >
            View the code
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
