import { defineQuery, groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { routeQuery } from '../objects/route-query'
import { teamPersonProjection } from './team-query'

/** Article body: portable text with resolvable links and inline images. */
// @sanity-typegen-ignore
const postBodyQuery = groq`body[] {
  ...,
  _type == 'defaultImage' => { ${imageQuery} },
  markDefs[] {
    ...,
    _type == 'linkWithRoute' => select(
      defined(linkType) => { ${routeQuery} },
      route { ${routeQuery} }
    )
  }
}`

export const postsQuery = defineQuery(`*[_type == "post"] | order(publishedAt desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  publishedAt,
  author-> ${teamPersonProjection},
  "category": category->title,
  excerpt,
  image { ${imageQuery} }
}`)

export const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  _type,
  _updatedAt,
  jsonLd,
  title,
  slug,
  image { ${imageQuery} },
  publishedAt,
  author-> ${teamPersonProjection},
  "category": category->title,
  excerpt,
  seo {
    ...,
    shareGraphic { ${imageQuery} }
  },
  cta {
    ...,
    content[] {
      ...,
      markDefs[] {
        ...,
        _type == 'linkWithRoute' => select(
          defined(linkType) => { ${routeQuery} },
          route { ${routeQuery} }
        )
      }
    },
    cta { ..., route { ${routeQuery} } }
  },
  ${postBodyQuery}
}`)
