import type { Metadata } from 'next';
import { site } from '@/data/site';
import { isVerified } from '@/types/content';

/**
 * Site metadata.
 *
 * Built from the same content layer as the page, so metadata can never claim
 * something the site itself does not. Unverified values are used only where a
 * value is structurally required (metadataBase needs some origin); anything
 * user-facing and unconfirmed is omitted.
 */
export const SITE_URL = site.canonicalUrl.value;

const title = `${site.name} — ${site.role}`;

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.focus,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    title,
    description: site.focus,
    url: '/',
    siteName: site.name,
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: site.focus,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

/**
 * Person structured data.
 *
 * Only verified, non-empty claims are emitted. Structured data is read by
 * machines that cannot tell a placeholder from a fact, so publishing an
 * unconfirmed value here would be worse than publishing it on the page.
 */
export function buildPersonJsonLd(): string {
  const sameAs = [site.github, site.linkedin]
    .filter((claim) => isVerified(claim) && claim.value !== '')
    .map((claim) => claim.value);

  const person: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    description: site.focus,
    url: SITE_URL,
  };

  if (sameAs.length > 0) person.sameAs = sameAs;
  if (isVerified(site.email) && site.email.value !== '') {
    person.email = site.email.value;
  }
  if (isVerified(site.location) && site.location.value !== '') {
    person.address = {
      '@type': 'PostalAddress',
      addressLocality: site.location.value,
    };
  }

  return JSON.stringify(person);
}
