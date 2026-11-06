import type { Span } from '@/data/spans';
import { Section } from '@/components/ui/section';
import { FitMatcher } from './fit-matcher';

export function FitSection({ span }: { span: Span }) {
  return (
    <Section span={span}>
      <p className="mb-10 max-w-2xl text-lead text-pretty text-paper-300">
        Skip the scanning. Paste your job description and get each requirement matched
        to work you can open, plus an honest list of what isn’t here.
      </p>
      <FitMatcher />
    </Section>
  );
}
