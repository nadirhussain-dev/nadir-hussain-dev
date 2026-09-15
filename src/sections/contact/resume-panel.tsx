import { ArrowUpRight, Download } from 'lucide-react';
import { getResumeStatus } from '@/lib/resume';
import { MonoLabel } from '@/components/ui/mono-label';

/**
 * Resume access.
 *
 * Deliberately a panel inside the contact span rather than a section of its
 * own: a resume should be findable in one move without dominating a site whose
 * whole argument is that the work speaks more precisely than a CV does.
 *
 * Server Component — the file check runs at build time and ships as static
 * markup.
 */
export function ResumePanel() {
  const resume = getResumeStatus();

  return (
    <div className="rule-frame p-5 sm:p-6">
      <MonoLabel tone="flow">resume</MonoLabel>

      {resume.available ? (
        <>
          <p className="mt-3 text-pretty text-paper-400">
            The short version, if you need it on paper.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-signal bg-signal/10 px-4 py-2 font-mono text-meta text-signal transition-colors duration-(--duration-quick) hover:bg-signal/20"
            >
              View
              <ArrowUpRight aria-hidden="true" className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={resume.href}
              download
              className="inline-flex items-center gap-2 rounded-sm border border-rule bg-ink-850 px-4 py-2 font-mono text-meta text-paper-200 transition-colors duration-(--duration-quick) hover:border-rule-strong"
            >
              Download
              <Download aria-hidden="true" className="size-4" />
            </a>
          </div>
        </>
      ) : (
        // No link is rendered at all rather than one that 404s.
        <p className="mt-3 text-pretty text-paper-400">
          Not published yet.{' '}
          <span className="text-paper-500">
            Drop a PDF at{' '}
            <code className="font-mono text-micro text-paper-400">
              {resume.expectedPath}
            </code>{' '}
            and the view and download links appear automatically — the file is detected
            at build time, not configured.
          </span>
        </p>
      )}
    </div>
  );
}
