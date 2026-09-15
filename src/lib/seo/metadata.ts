import type { Metadata } from 'next';
import { site } from '@/data/site';
import { isVerified } from '@/types/content';

/**
 * Site metadata and structured data.
 *
 * Built from the same content layer as the page, so metadata can never claim
 * something the site itself does not.
 *
 * On ranking: the winnable queries here are Nadir's own name and its variants.
 * Those are won by making the name-to-person mapping unambiguous to a crawler
 * — one canonical entity, every alias declared, every profile cross-linked —
 * which is what the @graph below does. Generic head terms like "web developer"
 * are not won by markup at any quality, and nothing here pretends otherwise.
 */
export const SITE_URL = site.canonicalUrl.value;

const PERSON_ID = `${SITE_URL}/#nadir-hussain`;
const SITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${SITE_URL}/#profilepage`;

const aliases = site.alternateNames.value;

/**
 * Title carries the primary name plus the strongest qualifier. Name first,
 * because for a name query the match position in the title matters.
 */
const title = `${site.name} — ${site.role}`;

const description =
  `${site.name} (${aliases[0]}) is a full-stack software engineer working on ` +
  `scalable systems, software architecture, payments and backend engineering. ` +
  `Explore an interactive architecture map and a live payments resilience simulator.`;

const verification = isVerified(site.googleSiteVerification)
  ? site.googleSiteVerification.value
  : '';

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s — ${site.name}` },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,
  // Keywords carry little direct weight, but they cost nothing and some
  // non-Google engines still read them.
  keywords: [
    site.name,
    ...aliases,
    `${site.name} software engineer`,
    `${site.name} full stack developer`,
    'full-stack software engineer',
    'software architect',
    'payments engineer',
    ...site.knowsAbout.value,
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    firstName: 'Nadir',
    lastName: 'Hussain',
    title,
    description,
    url: '/',
    siteName: site.name,
    locale: 'en_GB',
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...(verification !== '' ? { verification: { google: verification } } : {}),
};

/**
 * A linked entity graph rather than a lone Person blob.
 *
 * Giving the person, the site and the page stable @ids and pointing them at
 * each other is what lets a crawler resolve "who is this page about" to one
 * entity. alternateName is the field that ties the name variants to that same
 * entity instead of leaving them as unrelated strings.
 *
 * Only verified, non-empty claims are emitted. Structured data is read by
 * machines that cannot tell a placeholder from a fact.
 */
export function buildPersonJsonLd(): string {
  const sameAs = [site.github, site.linkedin]
    .filter((claim) => isVerified(claim) && claim.value !== '')
    .map((claim) => claim.value);

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    alternateName: [...aliases],
    givenName: 'Nadir',
    familyName: 'Hussain',
    jobTitle: site.role,
    description: site.focus,
    knowsAbout: [...site.knowsAbout.value],
    url: SITE_URL,
    mainEntityOfPage: { '@id': PAGE_ID },
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

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: SITE_URL,
        name: `${site.name} — ${site.role}`,
        description,
        inLanguage: 'en-GB',
        publisher: { '@id': PERSON_ID },
      },
      {
        // ProfilePage is the correct type for a personal site and is what tells
        // a crawler the page is *about* the person, not merely by them.
        '@type': 'ProfilePage',
        '@id': PAGE_ID,
        url: SITE_URL,
        name: title,
        description,
        isPartOf: { '@id': SITE_ID },
        about: { '@id': PERSON_ID },
        mainEntity: { '@id': PERSON_ID },
        inLanguage: 'en-GB',
      },
    ],
  });
}
