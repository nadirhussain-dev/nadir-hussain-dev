import type { Span } from '@/data/spans';
import { systemsIntro } from '@/data/systems';
import { Section } from '@/components/ui/section';
import { ArchitectureMap } from './architecture-map';

/**
 * Server Component wrapper: the prose is static HTML, and only the diagram
 * ships as an island.
 */
export function SystemsSection({ span }: { span: Span }) {
  return (
    <Section span={span}>
      <p className="mb-12 max-w-2xl text-lead text-pretty text-paper-300">
        {systemsIntro.value}
      </p>
      <ArchitectureMap />
    </Section>
  );
}
