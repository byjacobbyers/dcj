import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'

export const SiteQuery = groq`*[_type == "site"][0] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  altTitle,
  foundingYear,
  address,
  addressLocality,
  addressRegion,
  postalCode,
  addressCountry,
  latitude,
  longitude,
  email,
  sameAs,
  seo {
    ...,
    metaIcon { ${imageQuery} },
    shareGraphic { ${imageQuery} }
  },
  organizationJsonLd {
    name,
    legalName,
    description,
    logo { ${imageQuery} },
    url,
    email,
    telephone,
    priceRange
  }
}`
