import { groq } from 'next-sanity'

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

export const videoQuery = groq`
  asset-> {
    ${muxAssetProjection}
  }
`
