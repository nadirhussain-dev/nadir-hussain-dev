import { SPANS } from '@/data/spans';
import { Section } from '@/components/ui/section';
import { SectionPlaceholder } from '@/sections/section-placeholder';
import { IdentitySection } from '@/sections/identity/identity-section';
import { SystemsSection } from '@/sections/systems/systems-section';

/**
 * The trace.
 *
 * Sections are rendered from the span registry so page order, rail order and
 * sitemap order cannot drift. Each span's placeholder is replaced by its real
 * section, one commit at a time.
 */
const PLACEHOLDER_NOTES: Record<string, string> = {
  work: 'Case studies. Awaiting verified project detail from Nadir.',
  timeline: 'Trajectory. Awaiting verified experience detail from Nadir.',
  stack: 'Stack organised by engineering layer.',
  playground: 'Payments resilience simulator.',
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
        return (
          <Section key={span.id} span={span}>
            <SectionPlaceholder note={PLACEHOLDER_NOTES[span.id] ?? ''} />
          </Section>
        );
      })}
    </div>
  );
}
