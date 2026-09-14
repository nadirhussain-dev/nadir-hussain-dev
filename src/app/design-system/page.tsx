import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MonoLabel } from '@/components/ui/mono-label';
import { Hairline } from '@/components/ui/hairline';

/**
 * Internal design-system reference.
 *
 * Exists so the token system can be reviewed as a system rather than inferred
 * from finished sections. It 404s outside development, so it never reaches
 * production or the sitemap.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

const INK = ['950', '900', '850', '800', '700', '600', '500'] as const;
const PAPER = ['100', '200', '300', '400', '500'] as const;
const ACCENTS = [
  { name: 'signal', job: 'live / active state only' },
  { name: 'flow', job: 'data in motion only' },
  { name: 'status-ok', job: 'simulator: healthy' },
  { name: 'status-warn', job: 'simulator: degraded' },
  { name: 'status-fail', job: 'simulator: failing' },
] as const;

const TYPE = [
  { cls: 'text-h1 font-semibold tracking-tight', label: 'text-h1' },
  { cls: 'text-h2 font-semibold tracking-tight', label: 'text-h2' },
  { cls: 'text-h3 font-medium', label: 'text-h3' },
  { cls: 'text-lead text-paper-300', label: 'text-lead' },
  { cls: 'text-body', label: 'text-body' },
  { cls: 'text-meta font-mono text-paper-400', label: 'text-meta' },
  { cls: 'text-micro font-mono tracking-widest uppercase', label: 'text-micro' },
] as const;

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <MonoLabel tone="flow">{title}</MonoLabel>
        <Hairline className="flex-1" />
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main className="mx-auto max-w-5xl space-y-20 px-(--spacing-gutter) py-24">
      <header className="space-y-3">
        <MonoLabel tone="signal">internal · not indexed</MonoLabel>
        <h1 className="text-h1 font-semibold tracking-tight">Design system</h1>
      </header>

      <Group title="neutrals · warm ramp">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {INK.map((step) => (
            <div key={step} className="space-y-2">
              <div
                className="h-20 rounded-sm border border-rule"
                style={{ backgroundColor: `var(--color-ink-${step})` }}
              />
              <MonoLabel>ink-{step}</MonoLabel>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {PAPER.map((step) => (
            <div key={step} className="space-y-2">
              <div
                className="h-20 rounded-sm border border-rule"
                style={{ backgroundColor: `var(--color-paper-${step})` }}
              />
              <MonoLabel>paper-{step}</MonoLabel>
            </div>
          ))}
        </div>
      </Group>

      <Group title="accents · one job each">
        <ul className="space-y-3">
          {ACCENTS.map((accent) => (
            <li key={accent.name} className="flex items-center gap-4">
              <span
                className="size-10 shrink-0 rounded-sm"
                style={{ backgroundColor: `var(--color-${accent.name})` }}
              />
              <MonoLabel className="w-32 shrink-0">{accent.name}</MonoLabel>
              <span className="text-meta text-paper-400">{accent.job}</span>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="type scale">
        <div className="space-y-6">
          {TYPE.map((entry) => (
            <div key={entry.label} className="space-y-1">
              <MonoLabel>{entry.label}</MonoLabel>
              <p className={entry.cls}>Systems are built from decisions.</p>
            </div>
          ))}
        </div>
      </Group>

      <Group title="structure">
        <div className="rule-frame p-8">
          <p className="text-paper-300">
            The corner ticks imply a measured frame without enclosing content in a card.
          </p>
        </div>
      </Group>
    </main>
  );
}
