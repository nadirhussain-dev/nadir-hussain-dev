import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import { buildPersonJsonLd, rootMetadata } from '@/lib/seo/metadata';
import { SkipLink } from '@/components/ui/skip-link';
import { TraceRail } from '@/components/trace/trace-rail';
import { SiteFooter } from '@/components/ui/site-footer';
import { Companion } from '@/components/character/companion';
import { StudioCanvas } from '@/components/studio/studio-canvas';
import { Terminal } from '@/components/terminal/terminal';
import { projects } from '@/data/projects';
import { site } from '@/data/site';
import { getResumeStatus } from '@/lib/resume';
import { isPublishable } from '@/types/project';
import '@/styles/globals.css';

/**
 * Instrument Sans over Inter: it carries slightly more character in the
 * terminals and a tighter aperture, which keeps large display sizes from
 * reading as generic. JetBrains Mono is used as a design element throughout —
 * metadata, labels, span ids — not only for code.
 */
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: '#0a0c24',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const resume = getResumeStatus();

  return (
    <html lang="en" className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}>
      <body className="grain">
        {/* Structured data is read by machines that cannot tell a placeholder
            from a fact, so it emits only verified claims. */}
        <script
          type="application/ld+json"
          // Serialised from typed content by JSON.stringify, never from user
          // input, so there is no injection surface here.
          dangerouslySetInnerHTML={{ __html: buildPersonJsonLd() }}
        />
        <StudioCanvas />
        <SkipLink />
        <TraceRail />
        {/* Clears the fixed mobile bar. The desktop rail sits beside the
            content rather than above it, so the offset is mobile-only. */}
        <main className="pt-(--spacing-mobile-bar) xl:pt-0">{children}</main>
        <div className="xl:pl-(--spacing-rail)">
          <SiteFooter />
        </div>
        <Companion />
        <Terminal
          context={{
            projects: projects
              .filter(isPublishable)
              .map(({ slug, name, summary }) => ({ slug, name, summary })),
            email: site.email.value,
            github: site.github.value,
            linkedin: site.linkedin.value,
            location: site.location.value,
            role: site.role,
            resumeHref: resume.available ? resume.href : null,
          }}
        />
      </body>
    </html>
  );
}
