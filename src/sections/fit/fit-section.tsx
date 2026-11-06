import type { Span } from '@/data/spans';
import { Section } from '@/components/ui/section';
import { FitMatcher } from './fit-matcher';

export function FitSection({ span }: { span: Span }) {
  return (
    <Section
      span={span}
      intro="See what I can prove with real work, and what I can’t."
      className="light bg-coin"
    >
      <FitMatcher />
    </Section>
  );
}
