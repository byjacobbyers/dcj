import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'

const seoOgProjection = groq`{
  metaTitle,
  "ogImageHeading": coalesce(autoShareImage.heading, ogImageHeading),
  "ogImageBackground": coalesce(autoShareImage.background, ogImageBackground),
  shareGraphic { ${imageQuery} },
  autoShareImage { heading, background }
}`

/** Minimal fetch for `/api/og`: one document by slug + site settings. */
export const ogRouteDataQuery = groq`{
  "doc": *[_type == $docType && slug.current == $slug][0] {
    title,
    seo ${seoOgProjection}
  },
  "site": *[_type == "site"][0] {
    title,
    organizationJsonLd { name },
    seo ${seoOgProjection}
  }
}`
