import type { Span } from '@/data/spans';
import { site } from '@/data/site';
import { identity } from '@/data/identity';
import { MonoLabel } from '@/components/ui/mono-label';
import { Hairline } from '@/components/ui/hairline';
import { LoadTrace } from './load-trace';

/**
 * The root span.
 *
 * A Server Component: the headline is the LCP element and ships as static HTML
 * with no JavaScript in front of it. Only the load trace is a client island,
 * and it renders nothing until it has real measurements, so it can never delay
 * or shift the headline.
 */
export function IdentitySection({ span }: { span: Span }) {
  return (
    <section
      id={span.id}
      aria-labelledby={`${span.id}-heading`}
      className="flex min-h-dvh scroll-mt-24 flex-col justify-center px-(--spacing-gutter) py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
        <div>
          <div className="mb-6 flex items-center gap-4">
            <MonoLabel tone="flow">{span.label}</MonoLabel>
            <Hairline className="w-16" />
            <MonoLabel>root span</MonoLabel>
          </div>

          <h1
            id={`${span.id}-heading`}
            className="text-h1 font-semibold tracking-tight text-balance text-paper-100"
          >
            {site.name}
          </h1>

          <p className="mt-4 text-h3 font-medium text-paper-300">{site.role}</p>

          <Hairline className="my-8 max-w-md" />

          <p className="max-w-xl text-lead text-pretty text-paper-200">
            {identity.statement.value}
          </p>
          <p className="mt-4 max-w-xl text-pretty text-paper-400">
            {identity.subStatement.value}
          </p>
        </div>

        <div className="lg:justify-self-end">
          <LoadTrace />
        </div>
      </div>
    </section>
  );
}
