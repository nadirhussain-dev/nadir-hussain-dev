import { SPANS, type Span, type SpanId } from '@/data/spans';
import { ContactSection } from '@/sections/contact/contact-section';
import { FitSection } from '@/sections/fit/fit-section';
import { IdentitySection } from '@/sections/identity/identity-section';
import { PlaygroundSection } from '@/sections/playground/playground-section';
import { StackSection } from '@/sections/stack/stack-section';
import { TimelineSection } from '@/sections/timeline/timeline-section';
import { WorkSection } from '@/sections/work/work-section';

const SECTIONS: Record<SpanId, (props: { span: Span }) => React.ReactNode> = {
  identity: IdentitySection,
  work: WorkSection,
  timeline: TimelineSection,
  stack: StackSection,
  fit: FitSection,
  playground: PlaygroundSection,
  contact: ContactSection,
};

export default function Home() {
  return SPANS.map((span) => {
    const SectionComponent = SECTIONS[span.id];
    return <SectionComponent key={span.id} span={span} />;
  });
}
