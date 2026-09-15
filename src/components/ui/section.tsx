import type { Span } from '@/data/spans';
import { MonoLabel } from '@/components/ui/mono-label';
import { Hairline } from '@/components/ui/hairline';
import { cn } from '@/lib/utils';

/**
 * The shell every span renders into.
 *
 * Server Component: it is pure structure, so it costs nothing on the client.
 * Each section carries its span id as the anchor target and its label as
 * visible instrumentation, which is what ties the page body back to the rail.
 */
export function Section({
  span,
  children,
  className,
  headingVisible = true,
}: {
  span: Span;
  children: React.ReactNode;
  className?: string;
  /** Hero-like sections supply their own headline and hide the default one. */
  headingVisible?: boolean;
}) {
  const headingId = `${span.id}-heading`;

  return (
    <section
      id={span.id}
      aria-labelledby={headingId}
      className={cn('scroll-mt-24 px-(--spacing-gutter) py-24 md:py-32', className)}
    >
      <div className="reveal mx-auto w-full max-w-6xl">
        <header className={cn('mb-12 md:mb-16', !headingVisible && 'sr-only')}>
          <div className="mb-4 flex items-center gap-4">
            <MonoLabel tone="flow">{span.label}</MonoLabel>
            <Hairline className="flex-1" />
          </div>
          <h2
            id={headingId}
            className="text-h2 font-semibold text-balance text-paper-100"
          >
            {span.heading}
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}
