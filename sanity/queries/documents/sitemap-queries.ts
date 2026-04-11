import { groq } from 'next-sanity'

/** Lightweight slug + updatedAt only (sitemap / SEO). */
export const pagesSitemapQuery = groq`*[_type == "page" && defined(slug.current)] {
  "slug": slug.current,
  _updatedAt
}`

export const eventsSitemapQuery = groq`*[_type == "event" && defined(slug.current)] {
  "slug": slug.current,
  _updatedAt
}`
