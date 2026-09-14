import Image from 'next/image';
import { getPortraitStatus } from '@/lib/portrait';
import { site } from '@/data/site';
import { MonoLabel } from '@/components/ui/mono-label';

/**
 * Portrait, treated rather than dropped in.
 *
 * A circular avatar would sit outside this design entirely. Instead the photo
 * is handled the way every other surface here is: a duotone plate inside the
 * rule frame, warmed toward the palette so it belongs to the page rather than
 * floating on it, with the same grain over the top.
 *
 * The colour resolves on hover and on keyboard focus. That is the site's one
 * piece of pure delight, and it is still doing a job — it mirrors the
 * progressive-resolution idea the rest of the page is built on, rather than
 * animating for its own sake. Under reduced motion it simply arrives resolved.
 *
 * Server Component: the file check runs at build time and ships as static
 * markup.
 */
export function Portrait({ className }: { className?: string }) {
  const portrait = getPortraitStatus();

  if (!portrait.available) {
    return (
      <div className={`rule-frame p-5 ${className ?? ''}`}>
        <MonoLabel tone="flow">portrait</MonoLabel>
        <p className="mt-3 text-meta text-pretty text-paper-500">
          Not published yet. Drop a photo at{' '}
          <code className="font-mono text-micro text-paper-400">
            {portrait.expectedPath}
          </code>{' '}
          — <code className="font-mono text-micro text-paper-400">.avif</code>,{' '}
          <code className="font-mono text-micro text-paper-400">.webp</code>,{' '}
          <code className="font-mono text-micro text-paper-400">.jpg</code> or{' '}
          <code className="font-mono text-micro text-paper-400">.png</code> all work —
          and it appears automatically, duotoned to the palette.
        </p>
      </div>
    );
  }

  return (
    <figure className={`portrait group m-0 ${className ?? ''}`}>
      <div className="rule-frame relative overflow-hidden rounded-sm">
        <div className="portrait-plate relative aspect-4/5 w-full">
          <Image
            src={portrait.src}
            alt={`${site.name}, ${site.role}`}
            fill
            // Sized for the hero column at each breakpoint so the browser never
            // downloads a larger file than it can display.
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 18rem, 60vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </figure>
  );
}
