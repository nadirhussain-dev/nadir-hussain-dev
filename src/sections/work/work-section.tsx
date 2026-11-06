import type { Span } from '@/data/spans';
import { projects } from '@/data/projects';
import { isPublishable } from '@/types/project';
import { Section } from '@/components/ui/section';
import { Book, type BookStyle } from './book';

/** Spine colours from the books in the artwork, with a slightly uneven stack. */
const LOOKS: readonly BookStyle[] = [
  { color: '#1f3a68', left: '0%', right: '3%' },
  { color: '#7a3b52', left: '3%', right: '1%' },
  { color: '#2e2a6b', left: '1%', right: '5%' },
  { color: '#1d4d5c', left: '4%', right: '1%' },
  { color: '#6f4a22', left: '0%', right: '3%' },
  { color: '#41519e', left: '2%', right: '1%' },
  { color: '#171214', left: '1%', right: '4%' },
  { color: '#5b3a7a', left: '3%', right: '0%' },
];

export function WorkSection({ span }: { span: Span }) {
  const published = projects.filter(isPublishable);

  return (
    <Section
      span={span}
      intro="Two client projects and six of my own. Open a book to see what I built and why."
      className="bg-gradient-to-b from-[#dcacb6] to-desk"
    >
      <div className="space-y-1 pr-2">
        {published.map((project, index) => (
          <Book
            key={project.slug}
            project={project}
            look={LOOKS[index % LOOKS.length] ?? LOOKS[0]!}
          />
        ))}
      </div>
    </Section>
  );
}
