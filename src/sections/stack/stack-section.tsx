import type { Span } from '@/data/spans';
import { STACK } from '@/data/stack';
import { Section } from '@/components/ui/section';

/** Skills, grouped by the layer of a product they work on. */
export function StackSection({ span }: { span: Span }) {
  return (
    <Section span={span} className="bg-sky">
      <div className="grid gap-5 md:grid-cols-2">
        {STACK.map((layer) => (
          <div key={layer.id} className="panel p-5">
            <h3 className="font-sans font-extrabold">{layer.label}</h3>
            <p className="font-display text-h3">
              {layer.technologies.map((technology) => technology.name).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
