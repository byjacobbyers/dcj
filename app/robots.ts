import { MetadataRoute } from 'next'

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

/**
 * Production builds should set NEXT_PUBLIC_SITE_URL to the canonical site origin.
 * Fallback avoids localhost in non-dev builds when the env is missing.
 */
const baseUrl = normalizeBaseUrl(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://denvercontactjam.com'
)

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
