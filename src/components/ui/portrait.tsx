import Image from 'next/image';
import { getPortraitStatus } from '@/lib/portrait';
import { site } from '@/data/site';
import { MonoLabel } from '@/components/ui/mono-label';
import { cn } from '@/lib/utils';

/**
 * Portrait, composed as a plate rather than dropped in as a photo.
 *
 * The photograph itself is shown as shot — an earlier version graded it and
 * that was a mistake. What makes it belong here is composition, not colour: a
 * hairline frame with the same corner ticks used everywhere else, a caption
 * that rhymes with the load-trace figure beneath it (label left, spec right),
 * and a vignette that lets a busy venue recede behind the subject.
 *
 * Server Component: the file check runs at build time and ships as static
 * markup.
 */
export function Portrait({ className }: { className?: string }) {
  const portrait = getPortraitStatus();

  if (!portrait.available) {
    return (
      <div className={cn('rule-frame p-5', className)}>
        <MonoLabel tone="flow">portrait</MonoLabel>
        <p className="mt-3 text-meta text-pretty text-paper-500">
          Not published yet. Drop a photo at{' '}
          <code className="font-mono text-micro text-paper-400">
            {portrait.expectedPath}
          </code>{' '}
          — <code className="font-mono text-micro text-paper-400">.webp</code>,{' '}
          <code className="font-mono text-micro text-paper-400">.jpg</code> or{' '}
          <code className="font-mono text-micro text-paper-400">.png</code> all work —
          or run{' '}
          <code className="font-mono text-micro text-paper-400">
            scripts/prepare-portrait.mts
          </code>{' '}
          against a camera original to crop and compress it first.
        </p>
      </div>
    );
  }

  return (
    <figure className={cn('portrait group m-0', className)}>
      <div className="rule-frame overflow-hidden rounded-sm border border-rule bg-ink-850">
        <div className="portrait-plate relative aspect-4/5 w-full overflow-hidden">
          <Image
            src={portrait.src}
            alt={`${site.name}, ${site.role}`}
            fill
            // Sized for the hero column at each breakpoint, so the browser
            // never downloads a larger file than it can display.
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 18rem, 60vw"
            priority
            className="object-cover"
          />
        </div>

        {/* A plate caption, not a photo credit. It mirrors the load-trace
            figure directly beneath — label left, spec right — so the two read
            as parts of one instrument rather than a photo sitting above an
            unrelated chart. */}
        <figcaption className="flex items-center justify-between gap-3 border-t border-rule px-4 py-2.5">
          <MonoLabel tone="flow">identity/portrait</MonoLabel>
          <MonoLabel>4:5</MonoLabel>
        </figcaption>
      </div>
    </figure>
  );
}
