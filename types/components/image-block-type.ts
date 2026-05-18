import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionContentLayout } from '@/lib/section-content-layout'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type ImageBlockImage = {
  asset?: { url?: string }
  alt?: string
  crop?: unknown
  hotspot?: unknown
} | null

export type ImageBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  contentLayout?: SectionContentLayout
  backgroundColor?: SectionBackgroundColor
  image?: ImageBlockImage
  imageMobile?: ImageBlockImage
  maxWidth?: string
}
