import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionContentLayout } from '@/lib/section-content-layout'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type CoverBlockImage = {
  asset?: {
    url?: string
    metadata?: { dimensions?: { width?: number; height?: number } }
  }
  alt?: string
  crop?: unknown
  hotspot?: { x?: number; y?: number }
}

export type CoverBlockImageMobile = {
  asset?: {
    url?: string
    metadata?: { dimensions?: { width?: number; height?: number } }
  }
  hotspot?: { x?: number; y?: number }
} | null

export type CoverBlockCta = { active?: boolean; route?: unknown } | null

export type CoverBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  contentLayout?: SectionContentLayout
  backgroundType?: 'image' | 'color'
  image?: CoverBlockImage
  imageMobile?: CoverBlockImageMobile
  backgroundColor?: SectionBackgroundColor
  height?: 'auto' | 'full' | 'half'
  overlayColor?: 'none' | 'black' | 'primary' | 'secondary'
  overlayOpacity?: number
  contentPosition?: string
  contentHalfWidth?: boolean
  content?: unknown
  cta?: CoverBlockCta
}
