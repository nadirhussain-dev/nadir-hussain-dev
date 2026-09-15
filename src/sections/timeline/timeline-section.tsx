import type { Span } from '@/data/spans';
import { experience } from '@/data/experience';
import { isPublishable } from '@/types/experience';
import { Section } from '@/components/ui/section';
import { TimelineEntry } from './timeline-entry';

export function TimelineSection({ span }: { span: Span }) {
  const isDev = process.env.NODE_ENV !== 'production';
  const publishable = experience.filter(isPublishable);
  const visible = isDev ? experience : publishable;

  return (
    <Section span={span}>
      {visible.length === 0 ? (
        <p className="max-w-2xl text-lead text-pretty text-paper-400">
          Employment history is not published here yet. Inventing an employer would be
          the single worst thing this site could do, so it stays empty until it is real.
        </p>
      ) : (
        <ol className="mt-4">
          {visible.map((entry, index) => (
            <TimelineEntry
              key={entry.slug}
              entry={entry}
              isDraft={!isPublishable(entry)}
              isCurrent={index === 0 && entry.endIso === ''}
            />
          ))}
        </ol>
      )}
    </Section>
  );
}
