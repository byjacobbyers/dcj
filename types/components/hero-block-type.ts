import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionContentLayout } from '@/lib/section-content-layout'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type HeroBlockImage = {
  asset?: { url?: string }
  alt?: string
  crop?: unknown
  hotspot?: unknown
} | null

export type HeroBlockCta = { active?: boolean; route?: unknown } | null

export type HeroBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  contentLayout?: SectionContentLayout
  backgroundColor?: SectionBackgroundColor
  content?: unknown
  layout?: string
  anchor?: string
  image?: HeroBlockImage
  cta?: HeroBlockCta
}
