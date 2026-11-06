import type { Span } from '@/data/spans';
import { cn } from '@/lib/utils';

/** One band of the page, with its own background set by the caller. */
export function Section({
  span,
  intro,
  children,
  className,
}: {
  span: Span;
  intro?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={span.id}
      aria-labelledby={`${span.id}-heading`}
      className={cn('px-(--spacing-gutter) py-20 md:py-28', className)}
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-10 max-w-2xl md:mb-14">
          <h2 id={`${span.id}-heading`} className="text-h2 font-bold text-balance">
            {span.heading}
          </h2>
          {intro !== undefined && <p className="mt-4 text-lead text-pretty">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
