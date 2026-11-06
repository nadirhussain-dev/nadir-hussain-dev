import type { Span } from '@/data/spans';
import { STACK } from '@/data/stack';
import { Section } from '@/components/ui/section';

/** Each layer is one lit shelf, as in the artwork. */
export function StackSection({ span }: { span: Span }) {
  return (
    <Section span={span} className="bg-mist">
      <div className="space-y-6">
        {STACK.map((layer) => (
          <div
            key={layer.id}
            className="grid gap-x-8 gap-y-1 border-b-4 border-lamp pb-3 md:grid-cols-[11rem_minmax(0,1fr)] md:items-baseline"
          >
            <h3 className="font-sans text-meta font-bold">{layer.label}</h3>
            <p className="font-display text-h3 font-semibold">
              {layer.technologies.map((technology) => technology.name).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
