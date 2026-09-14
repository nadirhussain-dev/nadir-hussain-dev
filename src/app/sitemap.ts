import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/metadata';

/**
 * The site is a single page, so the sitemap is one entry. Section anchors are
 * deliberately not listed: they are fragments of one document, not separate
 * URLs, and listing them invites duplicate-content handling for no benefit.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
