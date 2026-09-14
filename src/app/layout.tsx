import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import { site } from '@/data/site';
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
  // Self-hosted and subset by next/font, so no render-blocking third-party
  // request and no layout shift once the fallback metrics are matched.
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.focus,
};

export const viewport: Viewport = {
  themeColor: '#121010',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
