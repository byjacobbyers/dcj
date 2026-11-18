import { defineQuery } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { sectionsQuery } from '../components/sections-query'

export const eventsQuery = defineQuery(`*[_type == "event" && defined(slug.current)] | order(startDate asc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  startDate,
  endDate,
  timeString,
  eventType,
  soldOut,
  location,
  price,
  image { ${imageQuery} }
}`)

export const eventQuery = defineQuery(`*[_type == "event" && slug.current == $slug][0] {
  _id,
  _type,
  _updatedAt,
  jsonLd,
  title,
  slug,
  image { ${imageQuery} },
  startDate,
  endDate,
  timeString,
  eventType,
  soldOut,
  location,
  price,
  registration,
  bookingUrl,
  bookingLabel,
  contact,
  seo {
    ...,
    shareGraphic { ${imageQuery} }
  },
  ${sectionsQuery}
}`)
