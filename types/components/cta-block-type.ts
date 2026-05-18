import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionContentLayout } from '@/lib/section-content-layout'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type CtaBlockCta = { active?: boolean; route?: unknown } | null

export type CtaBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  contentLayout?: SectionContentLayout
  backgroundColor?: SectionBackgroundColor
  content?: unknown
  alignment?: string
  cta?: CtaBlockCta
}
