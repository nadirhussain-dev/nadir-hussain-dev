import { Game } from '@/components/game/game';
import { projects } from '@/data/projects';
import { getResumeStatus } from '@/lib/resume';
import { isPublishable } from '@/types/project';

export function GameSection() {
  const resume = getResumeStatus();

  return (
    <Game
      resumeHref={resume.available ? resume.href : null}
      projects={projects.filter(isPublishable).map((project) => ({
        slug: project.slug,
        name: project.name,
        summary: project.summary,
        period: project.period,
        outcome: project.outcome,
        stack: project.stack,
        source: project.source,
        decisions: project.decisions.map(({ choice, because }) => ({
          choice,
          because,
        })),
      }))}
    />
  );
}
