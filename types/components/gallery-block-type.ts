import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type GalleryBlockImageItem = {
  asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
  [key: string]: unknown
}

export type GalleryBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  backgroundColor?: SectionBackgroundColor
  images?: GalleryBlockImageItem[]
  imagesPerRow?: number
  enableLightbox?: boolean
}
