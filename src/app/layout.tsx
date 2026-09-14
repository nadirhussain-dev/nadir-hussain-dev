import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import { buildPersonJsonLd, rootMetadata } from '@/lib/seo/metadata';
import { SkipLink } from '@/components/ui/skip-link';
import { TraceRail } from '@/components/trace/trace-rail';
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
  themeColor: '#121010',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        <SkipLink />
        <TraceRail />
        {/* Clears the fixed mobile bar. The desktop rail is beside the content,
            not above it, so the offset is mobile-only. */}
        <main className="pt-12 xl:pt-0">{children}</main>
      </body>
    </html>
  );
}
