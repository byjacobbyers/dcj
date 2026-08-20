import { MetadataRoute } from 'next'

import { getPublicSiteUrl } from '@/lib/site-url'

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

/**
 * Uses {@link getPublicSiteUrl}: dev → local origin (not prod `NEXT_PUBLIC_SITE_URL`);
 * production → canonical `NEXT_PUBLIC_SITE_URL`.
 */
const baseUrl = normalizeBaseUrl(getPublicSiteUrl())

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/studio/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
