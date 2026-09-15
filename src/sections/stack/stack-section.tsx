import type { Span } from '@/data/spans';
import { ALL_TECHNOLOGIES } from '@/data/stack';
import { projects } from '@/data/projects';
import { isPublishable } from '@/types/project';
import { Section } from '@/components/ui/section';
import { StackExplorer, type TechnologyUsage } from './stack-explorer';

/**
 * Builds the technology-to-project mapping at build time.
 *
 * Done here rather than in the client component so the zod-validated project
 * data — and zod itself — stays out of the browser bundle. The data cannot
 * change after build, so shipping the schema to resolve it would be pure cost.
 */
function buildUsage(): TechnologyUsage {
  const usage: Record<string, string[]> = {};

  for (const technology of ALL_TECHNOLOGIES) {
    const key = technology.name.toLowerCase();
    usage[key] = projects
      .filter(isPublishable)
      .filter((project) => project.stack.some((item) => item.toLowerCase() === key))
      .map((project) => project.name);
  }

  return usage;
}

export function StackSection({ span }: { span: Span }) {
  return (
    <Section span={span}>
      <p className="mb-10 max-w-2xl text-lead text-pretty text-paper-300">
        A logo wall says &ldquo;I have heard of these&rdquo;. Grouping by the layer each
        tool operates at says something about how the system divides up, which is the
        only interesting thing a stack list can communicate.
      </p>
      <StackExplorer
        showDrafts={process.env.NODE_ENV !== 'production'}
        usage={buildUsage()}
      />
    </Section>
  );
}
