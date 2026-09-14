import { SPANS } from '@/data/spans';
import { site } from '@/data/site';
import { MonoLabel } from '@/components/ui/mono-label';
import { Hairline } from '@/components/ui/hairline';

/**
 * Architectural placeholder.
 *
 * Renders the trace spine so the structure is verifiable before any span is
 * implemented. Each span is replaced by its real section, one per commit.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-center gap-12 px-(--spacing-gutter) py-24">
      <header className="space-y-4">
        <MonoLabel tone="signal">trace · scaffold</MonoLabel>
        <h1 className="text-h1 font-semibold tracking-tight text-balance">
          {site.name}
        </h1>
        <p className="text-lead text-paper-400">{site.role}</p>
      </header>

      <Hairline />

      <ol className="space-y-3">
        {SPANS.map((span) => (
          <li
            key={span.id}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
            style={{ paddingInlineStart: `${span.depth * 1.5}rem` }}
          >
            <MonoLabel tone="flow" className="w-44 shrink-0">
              {span.label}
            </MonoLabel>
            <span className="text-meta text-paper-400">{span.heading}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
