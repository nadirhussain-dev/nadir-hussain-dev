import type { Span } from '@/data/spans';
import { projects } from '@/data/projects';
import { isPublishable } from '@/types/project';
import { Section } from '@/components/ui/section';
import { QuestEntry } from './quest-entry';

export function WorkSection({ span }: { span: Span }) {
  return (
    <Section
      span={span}
      intro="Two client projects and six of my own."
      className="bg-cream"
    >
      <div className="space-y-5">
        {projects.filter(isPublishable).map((project) => (
          <QuestEntry key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
