import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { buildPersonJsonLd, rootMetadata } from '@/lib/seo/metadata';
import { SkipLink } from '@/components/ui/skip-link';
import { SiteFooter } from '@/components/ui/site-footer';
import { SiteNav } from '@/components/nav/site-nav';
import { Terminal } from '@/components/terminal/terminal';
import { projects } from '@/data/projects';
import { site } from '@/data/site';
import { getResumeStatus } from '@/lib/resume';
import { isPublishable } from '@/types/project';
import '@/styles/globals.css';

/** Self-hosted, so the page never waits on a third-party font server. */
const title = localFont({
  src: '../fonts/bricolage-grotesque-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-title',
  display: 'swap',
});

const body = localFont({
  src: '../fonts/plus-jakarta-sans-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-body',
  display: 'swap',
});

const code = localFont({
  src: '../fonts/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-code',
  display: 'swap',
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: '#41519e',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const resume = getResumeStatus();

  return (
    <html lang="en" className={`${title.variable} ${body.variable} ${code.variable}`}>
      <body>
        {/* Structured data is read by machines that cannot tell a placeholder
            from a fact, so it emits only verified claims. */}
        <script
          type="application/ld+json"
          // Serialised from typed content by JSON.stringify, never from user
          // input, so there is no injection surface here.
          dangerouslySetInnerHTML={{ __html: buildPersonJsonLd() }}
        />
        <SkipLink />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
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
