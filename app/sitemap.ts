import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import {
  eventsSitemapQuery,
  pagesSitemapQuery,
} from '@/sanity/queries/documents/sitemap-queries'
import { getPublicSiteUrl } from '@/lib/site-url'

/** Aligns with [slug]/page.tsx generateStaticParams — not separate indexable routes. */
const EXCLUDED_PAGE_SLUGS = new Set(['home', 'quiz', 'resources'])

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

/** See robots.ts — `getPublicSiteUrl` in prod uses NEXT_PUBLIC_SITE_URL. */
const baseUrl = normalizeBaseUrl(getPublicSiteUrl())

async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  let pageRows: Array<{ slug: string; _updatedAt?: string }> = []
  let eventRows: Array<{ slug: string; _updatedAt?: string }> = []
  try {
    const results = await Promise.all([
      client.fetch<Array<{ slug: string; _updatedAt?: string }>>(pagesSitemapQuery),
      client.fetch<Array<{ slug: string; _updatedAt?: string }>>(eventsSitemapQuery),
    ])
    pageRows = results[0] || []
    eventRows = results[1] || []
  } catch {
    // Invalid or unreachable Sanity (e.g. CI) — emit home only
  }

  const sitemap: MetadataRoute.Sitemap = []

  sitemap.push({
    url: `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  })

  for (const page of pageRows || []) {
    if (!page?.slug || EXCLUDED_PAGE_SLUGS.has(page.slug)) continue
    sitemap.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  for (const event of eventRows || []) {
    if (!event?.slug) continue
    sitemap.push({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event._updatedAt ? new Date(event._updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  return sitemap
}

export default generateSitemap
