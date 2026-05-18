import { groq } from 'next-sanity'

/** Same route shape as `objects/route-query` — inlined so nested projection is explicit. */
const announcementRouteProjection = groq`
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

export const AnnouncementQuery = groq`
  *[_type == "announcement" && active == true && startDate <= $today && endDate >= $today][0] {
    _id,
    message,
    route {
      ${announcementRouteProjection}
    }
  }
`
