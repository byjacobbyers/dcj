import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { sectionsQuery } from '../components/sections-query'

export const eventsQuery = groq`*[_type == "event"] {
  _id,
  _type,
  title,
  slug,
  startDate,
  endDate,
  "slug": slug.current
}`

export const eventQuery = groq`*[_type == "event" && slug.current == $slug][0] {
  _id,
  _type,
  _updatedAt,
  title,
  slug,
  image { ${imageQuery} },
  startDate,
  endDate,
  timeString,
  eventType,
  soldOut,
  location,
  seo {
    ...,
    shareGraphic { ${imageQuery} }
  },
  ${sectionsQuery}
}`
