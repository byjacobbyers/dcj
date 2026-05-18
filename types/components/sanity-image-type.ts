import type { SanityImageSource } from '@sanity/image-url'

export type { SanityImageSource }

export type SanityImageProps = {
  image: SanityImageSource | null | undefined
  alt?: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
  /** Shown when the asset is missing or the image fails to load. */
  placeholder?: 'grey' | 'wireframe'
}
