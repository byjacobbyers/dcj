import { groq } from 'next-sanity'

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
