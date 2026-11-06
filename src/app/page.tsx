import { SiteNav } from '@/components/nav/site-nav';
import { SPANS, type Span, type SpanId } from '@/data/spans';
import { ContactSection } from '@/sections/contact/contact-section';
import { FitSection } from '@/sections/fit/fit-section';
import { GameSection } from '@/sections/game/game-section';
import { PlaygroundSection } from '@/sections/playground/playground-section';
import { StackSection } from '@/sections/stack/stack-section';
import { TimelineSection } from '@/sections/timeline/timeline-section';
import { WorkSection } from '@/sections/work/work-section';

type ResumeSpanId = Exclude<SpanId, 'identity'>;

const SECTIONS: Record<ResumeSpanId, (props: { span: Span }) => React.ReactNode> = {
  work: WorkSection,
  timeline: TimelineSection,
  stack: StackSection,
  fit: FitSection,
  playground: PlaygroundSection,
  contact: ContactSection,
};

/** The game first, then the same story as a normal resume. */
export default function Home() {
  return (
    <>
      <GameSection />
      <div id="resume">
        <SiteNav />
        {SPANS.filter((span) => span.id !== 'identity').map((span) => {
          const SectionComponent = SECTIONS[span.id as ResumeSpanId];
          return <SectionComponent key={span.id} span={span} />;
        })}
      </div>
    </>
  );
}
