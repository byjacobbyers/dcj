import { groq } from 'next-sanity'

/** Everything the llms.txt index needs, one round trip. Published only; noindex pages excluded. */
// @sanity-typegen-ignore
export const llmsIndexQuery = groq`{
  "site": *[_type == "site"][0]{ title, "summary": coalesce(organizationJsonLd.description, seo.metaDesc), "homeDescription": seo.metaDesc },
  "nav": *[_type == "navigation" && title == "Header"][0].items[]{
    _type,
    "slug": pageRoute->slug.current,
    "description": titleAttr,
    "children": select(_type == 'subNav' => items[]{ "slug": route.pageRoute->slug.current, description })
  },
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] | order(title asc){
    "slug": slug.current, title, "description": seo.metaDesc
  },
  "events": *[_type == "event" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] | order(startDate desc){
    "slug": slug.current, title, startDate
  },
  "posts": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc){
    "slug": slug.current, title, excerpt, publishedAt
  }
}`

/** Slugs per type, for llms-full.txt. */
// @sanity-typegen-ignore
export const llmsDocumentsQuery = groq`{
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))]{ "slug": slug.current },
  "events": *[_type == "event" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))]{ "slug": slug.current },
  "posts": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }
}`
