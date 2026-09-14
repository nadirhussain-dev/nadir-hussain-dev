import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Internal reference page; it 404s in production anyway, but say so.
      disallow: '/design-system',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
