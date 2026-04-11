import { groq } from 'next-sanity'

export const routeQuery = groq`
  _type,
  title,
  linkType,
  pageRoute->{ _type, "slug": slug.current },
  eventRoute->{ _type, "slug": slug.current },
  fileRoute { asset->{ url, originalFilename } },
  route,
  anchor,
  link,
  email,
  telephone,
  blank,
  titleAttr,
  ariaLabel,
  utm {
    source,
    medium,
    campaign,
    term,
    content
  },
  trackingId,
  relAttributes,
  dataAttributes[] {
    key,
    value,
    _key
  }
`
