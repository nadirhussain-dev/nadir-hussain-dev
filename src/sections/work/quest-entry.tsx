'use client';

import { useEffect, useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { ProjectDetails, type ProjectView } from '@/components/game/project-details';
import { cn } from '@/lib/utils';

/** One project in the quest log. Links from the terminal arrive with it open. */
export function QuestEntry({ project }: { project: ProjectView }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const openIfTargeted = (): void => {
      if (window.location.hash === `#${project.slug}`) setOpen(true);
    };
    openIfTargeted();
    window.addEventListener('hashchange', openIfTargeted);
    return () => window.removeEventListener('hashchange', openIfTargeted);
  }, [project.slug]);

  return (
    <article id={project.slug} className="panel scroll-mt-24">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center gap-4 p-5 text-left sm:px-7"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-display text-h3 leading-tight">
              {project.name}
            </span>
            <span className="mt-1 block font-sans font-bold text-pretty">
              {project.summary}
            </span>
          </span>
          <Plus
            aria-hidden="true"
            className={cn('size-7 shrink-0 transition-transform', open && 'rotate-45')}
          />
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="px-5 pb-6 sm:px-7">
        <ProjectDetails project={{ ...project, summary: project.period }} />
      </div>
    </article>
  );
}
