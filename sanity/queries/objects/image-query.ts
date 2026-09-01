import { groq } from 'next-sanity'

// @sanity-typegen-ignore
export const imageQuery = groq`
  alt,
  crop { ... },
  hotspot { x, y },
  asset-> {
    _id,
    url,
    metadata {
      dimensions { aspectRatio, height, width },
      lqip
    }
  }
`
