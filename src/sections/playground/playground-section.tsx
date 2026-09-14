import type { Span } from '@/data/spans';
import { playgroundIntro, playgroundNote } from '@/data/playground';
import { Section } from '@/components/ui/section';
import { Simulator } from './simulator';

export function PlaygroundSection({ span }: { span: Span }) {
  return (
    <Section span={span}>
      <p className="mb-10 max-w-2xl text-lead text-pretty text-paper-300">
        {playgroundIntro.value}
      </p>
      <Simulator />
      <p className="mt-10 max-w-2xl border-t border-rule pt-5 text-meta text-pretty text-paper-500">
        {playgroundNote.value}
      </p>
    </Section>
  );
}
