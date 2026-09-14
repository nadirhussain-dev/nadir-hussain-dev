import { SPANS } from '@/data/spans';
import { Section } from '@/components/ui/section';
import { SectionPlaceholder } from '@/sections/section-placeholder';
import { IdentitySection } from '@/sections/identity/identity-section';
import { SystemsSection } from '@/sections/systems/systems-section';
import { PlaygroundSection } from '@/sections/playground/playground-section';
import { WorkSection } from '@/sections/work/work-section';
import { TimelineSection } from '@/sections/timeline/timeline-section';
import { StackSection } from '@/sections/stack/stack-section';

/**
 * The trace.
 *
 * Sections are rendered from the span registry so page order, rail order and
 * sitemap order cannot drift. Each span's placeholder is replaced by its real
 * section, one commit at a time.
 */
const PLACEHOLDER_NOTES: Record<string, string> = {
  contact: 'Contact and resume.',
};

export default function Home() {
  return (
    <div className="xl:pl-(--spacing-rail)">
      {SPANS.map((span) => {
        if (span.id === 'identity') {
          return <IdentitySection key={span.id} span={span} />;
        }
        if (span.id === 'systems') {
          return <SystemsSection key={span.id} span={span} />;
        }
        if (span.id === 'playground') {
          return <PlaygroundSection key={span.id} span={span} />;
        }
        if (span.id === 'work') {
          return <WorkSection key={span.id} span={span} />;
        }
        if (span.id === 'timeline') {
          return <TimelineSection key={span.id} span={span} />;
        }
        if (span.id === 'stack') {
          return <StackSection key={span.id} span={span} />;
        }
        return (
          <Section key={span.id} span={span}>
            <SectionPlaceholder note={PLACEHOLDER_NOTES[span.id] ?? ''} />
          </Section>
        );
      })}
    </div>
  );
}
