import { defineQuery } from 'next-sanity'

/**
 * Page slugs that are not standalone indexable routes under /[slug].
 * Shared by sitemap.ts and [slug]/page.tsx generateStaticParams.
 */
export const EXCLUDED_PAGE_SLUGS = ['home', 'quiz', 'resources']

/** Lightweight slug + updatedAt only (sitemap / SEO). */
export const pagesSitemapQuery = defineQuery(`*[_type == "page" && defined(slug.current)] {
  "slug": slug.current,
  "noIndex": seo.noIndex == true,
  _updatedAt
}`)

export const eventsSitemapQuery = defineQuery(`*[_type == "event" && defined(slug.current)] {
  "slug": slug.current,
  "noIndex": seo.noIndex == true,
  _updatedAt
}`)

export const postsSitemapQuery = defineQuery(`*[_type == "post" && defined(slug.current)] {
  "slug": slug.current,
  "noIndex": seo.noIndex == true,
  _updatedAt
}`)
