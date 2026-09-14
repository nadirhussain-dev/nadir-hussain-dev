import { SPANS, type SpanId, type Span } from '@/data/spans';
import { IdentitySection } from '@/sections/identity/identity-section';
import { SystemsSection } from '@/sections/systems/systems-section';
import { WorkSection } from '@/sections/work/work-section';
import { TimelineSection } from '@/sections/timeline/timeline-section';
import { StackSection } from '@/sections/stack/stack-section';
import { PlaygroundSection } from '@/sections/playground/playground-section';
import { ContactSection } from '@/sections/contact/contact-section';

/**
 * The trace.
 *
 * Sections are rendered from the span registry, so page order, rail order and
 * sitemap order all derive from one list and cannot drift apart.
 *
 * The registry is typed as a total map over SpanId: adding a span to the
 * registry without building its section is a type error rather than a silently
 * missing section.
 */
const SECTIONS: Record<SpanId, (props: { span: Span }) => React.ReactNode> = {
  identity: IdentitySection,
  systems: SystemsSection,
  work: WorkSection,
  timeline: TimelineSection,
  stack: StackSection,
  playground: PlaygroundSection,
  contact: ContactSection,
};

export default function Home() {
  return (
    <div className="xl:pl-(--spacing-rail)">
      {SPANS.map((span) => {
        const SectionComponent = SECTIONS[span.id];
        return <SectionComponent key={span.id} span={span} />;
      })}
    </div>
  );
}
