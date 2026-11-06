import type { Span } from '@/data/spans';
import { site } from '@/data/site';
import { identity } from '@/data/identity';
import { Hairline } from '@/components/ui/hairline';
import { MonoLabel } from '@/components/ui/mono-label';
import { TerminalButton } from '@/components/terminal/terminal-button';
import { getResumeStatus } from '@/lib/resume';

/**
 * The opening shot.
 *
 * The headline is static HTML over the 3D room, so it stays the LCP element and
 * never waits for WebGL. On desktop the camera frames the character to the
 * right of this text; on phones, above it.
 */
export function IdentitySection({ span }: { span: Span }) {
  const resume = getResumeStatus();

  return (
    <section
      id={span.id}
      aria-labelledby={`${span.id}-heading`}
      className="hero-veil flex min-h-dvh scroll-mt-24 flex-col justify-end px-(--spacing-gutter) pt-[50dvh] pb-10 lg:justify-center lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl">
          <MonoLabel tone="flow">Build · Innovate · Grow</MonoLabel>

          <h1
            id={`${span.id}-heading`}
            className="neon-text mt-4 text-h1 font-semibold tracking-tight text-balance"
          >
            {site.name}
          </h1>

          <p className="mt-3 text-h3 font-medium text-paper-200">{site.role}</p>

          <Hairline className="my-6 max-w-md lg:my-8" />

          <p className="text-lead text-pretty text-paper-100">
            {identity.statement.value}
          </p>
          <p className="mt-4 hidden text-pretty text-paper-300 sm:block">
            {identity.subStatement.value}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <a
              href="#fit"
              className="inline-flex min-h-11 items-center rounded-lg border border-signal bg-signal/15 px-4 font-mono text-meta text-signal transition-colors duration-(--duration-quick) hover:bg-signal/25"
            >
              Check me against your role
            </a>
            {resume.available && (
              <a
                href={resume.href}
                download
                className="inline-flex min-h-11 items-center rounded-lg border border-rule-strong bg-ink-850/80 px-4 font-mono text-meta text-paper-100 transition-colors duration-(--duration-quick) hover:border-signal"
              >
                Download CV
              </a>
            )}
            <TerminalButton />
          </div>
        </div>
      </div>
    </section>
  );
}
