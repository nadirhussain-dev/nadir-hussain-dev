import { site } from '@/data/site';
import { isVerified } from '@/types/content';
import { MonoLabel } from '@/components/ui/mono-label';

/**
 * Site footer.
 *
 * Closes the trace rather than repeating the navigation: the rail is always on
 * screen, so a second copy of it here would be redundant. What belongs at the
 * end is the one honest technical note about how the page was built, which is
 * on-theme for a site arguing that the author understands systems.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const github = isVerified(site.github) ? site.github.value : '';

  return (
    <footer className="border-t border-rule px-(--spacing-gutter) py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <MonoLabel tone="flow">end of trace</MonoLabel>
          <p className="mt-2 text-meta text-paper-400">
            {site.name} — {site.role}
          </p>
          <p className="mt-1 text-micro text-paper-500">
            © {year}. Built with Next.js and TypeScript. Statically rendered; the
            interactive parts are client islands.
          </p>
        </div>

        {github !== '' && (
          <a
            href={github}
            target="_blank"
            rel="me noopener noreferrer"
            className="rounded-xs font-mono text-micro tracking-[0.08em] text-paper-400 uppercase transition-colors duration-(--duration-quick) hover:text-signal"
          >
            Source on GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </footer>
  );
}
