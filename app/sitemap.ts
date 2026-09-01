import { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import {
  EXCLUDED_PAGE_SLUGS,
  eventsSitemapQuery,
  pagesSitemapQuery,
  postsSitemapQuery,
} from '@/sanity/queries/documents/sitemap-queries'
import { getPublicSiteUrl } from '@/lib/site-url'

/**
 * Sitemap sits outside the (site) route group, so it does not inherit that
 * segment's revalidate. Without this it only refreshes on deploy.
 */
export const revalidate = 3600

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

const baseUrl = normalizeBaseUrl(getPublicSiteUrl())

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

function safeDate(value?: string | null): Date {
  if (!value) return new Date()
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

function normalizeSlug(slug: unknown): string | null {
  if (typeof slug !== 'string') return null
  const trimmed = slug.replace(/^\/+|\/+$/g, '')
  return SLUG_RE.test(trimmed) ? trimmed : null
}

/** Studio leftovers like test-* should never be indexed. */
function isJunkSlug(slug: string): boolean {
  const lower = slug.toLowerCase()
  return lower === 'test' || lower === 'test2' || lower.startsWith('test-')
}

type SitemapRow = {
  slug?: string | null
  _updatedAt?: string | null
  noIndex?: boolean | null
}

async function fetchRows(query: string): Promise<SitemapRow[]> {
  try {
    const { data } = await sanityFetch({
      query,
      stega: false,
      perspective: 'published',
    })
    return Array.isArray(data) ? (data as SitemapRow[]) : []
  } catch {
    // A thrown fetch used to 500 the whole /sitemap.xml — Google then stops reading it.
    return []
  }
}

function pushUnique(
  sitemap: MetadataRoute.Sitemap,
  seen: Set<string>,
  entry: MetadataRoute.Sitemap[number]
) {
  if (seen.has(entry.url)) return
  seen.add(entry.url)
  sitemap.push(entry)
}

async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageRows, eventRows, postRows] = await Promise.all([
    fetchRows(pagesSitemapQuery),
    fetchRows(eventsSitemapQuery),
    fetchRows(postsSitemapQuery),
  ])

  const sitemap: MetadataRoute.Sitemap = []
  const seen = new Set<string>()

  pushUnique(sitemap, seen, {
    url: `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  })

  for (const page of pageRows) {
    const slug = normalizeSlug(page.slug)
    if (!slug || EXCLUDED_PAGE_SLUGS.includes(slug) || isJunkSlug(slug) || page.noIndex) {
      continue
    }
    pushUnique(sitemap, seen, {
      url: `${baseUrl}/${slug}`,
      lastModified: safeDate(page._updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  for (const event of eventRows) {
    const slug = normalizeSlug(event.slug)
    if (!slug || isJunkSlug(slug) || event.noIndex) continue
    pushUnique(sitemap, seen, {
      url: `${baseUrl}/events/${slug}`,
      lastModified: safeDate(event._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  for (const post of postRows) {
    const slug = normalizeSlug(post.slug)
    if (!slug || isJunkSlug(slug) || post.noIndex) continue
    pushUnique(sitemap, seen, {
      url: `${baseUrl}/posts/${slug}`,
      lastModified: safeDate(post._updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  return sitemap
}

export default generateSitemap
