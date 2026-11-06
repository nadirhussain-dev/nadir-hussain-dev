import type { Span } from '@/data/spans';
import { Section } from '@/components/ui/section';
import { Simulator } from './simulator';

export function PlaygroundSection({ span }: { span: Span }) {
  return (
    <div className="bg-night text-white">
      <Section
        span={span}
        intro="A working payment simulator. Turn up the traffic, make the processor time out, and watch the system stop double charges."
      >
        <Simulator />
      </Section>
    </div>
  );
}
