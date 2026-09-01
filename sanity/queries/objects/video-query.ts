import { groq } from 'next-sanity'

// @sanity-typegen-ignore
export const muxAssetProjection = groq`
  _id,
  _type,
  _ref,
  playbackId,
  status,
  data {
    duration,
    aspect_ratio
  }
`

// @sanity-typegen-ignore
export const videoQuery = groq`
  asset-> {
    ${muxAssetProjection}
  }
`
