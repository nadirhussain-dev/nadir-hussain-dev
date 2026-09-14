import { SPANS } from '@/data/spans';
import { site } from '@/data/site';

/**
 * Architectural placeholder.
 *
 * The section modules land one per commit; this renders the trace spine so
 * the structure is verifiable before any of it is implemented.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-10 px-6 py-24">
      <header className="space-y-3">
        <p className="font-mono text-xs tracking-widest text-signal uppercase">
          trace · scaffold
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          {site.name}
        </h1>
        <p className="text-paper-100/60">{site.role}</p>
      </header>

      <ol className="space-y-2">
        {SPANS.map((span) => (
          <li
            key={span.id}
            className="flex items-baseline gap-3 font-mono text-sm"
            style={{ paddingInlineStart: `${span.depth * 1.5}rem` }}
          >
            <span className="text-flow">{span.label}</span>
            <span className="text-paper-100/40">{span.heading}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
