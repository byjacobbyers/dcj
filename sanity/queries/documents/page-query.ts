import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { sectionsQuery } from '../components/sections-query'

export const pagesQuery = groq`*[_type == "page" && defined(slug.current)] {
  _id,
  title,
  "slug": slug.current
}`

export const pageQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  backgroundColor,
  seo {
    ...,
    shareGraphic { ${imageQuery} }
  },
  ${sectionsQuery}
}`
