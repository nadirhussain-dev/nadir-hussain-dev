import type { Span } from '@/data/spans';
import { Section } from '@/components/ui/section';
import { StackExplorer } from './stack-explorer';

export function StackSection({ span }: { span: Span }) {
  return (
    <Section span={span}>
      <p className="mb-10 max-w-2xl text-lead text-pretty text-paper-300">
        A logo wall says &ldquo;I have heard of these&rdquo;. Grouping by the layer each
        tool operates at says something about how the system divides up, which is the
        only interesting thing a stack list can communicate.
      </p>
      <StackExplorer showDrafts={process.env.NODE_ENV !== 'production'} />
    </Section>
  );
}
