import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionContentLayout } from '@/lib/section-content-layout'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type EmbedCodeValue =
  | string
  | { code?: string; language?: string }
  | null
  | undefined

export type EmbedBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  contentLayout?: SectionContentLayout
  backgroundColor?: SectionBackgroundColor
  title?: string | null
  embedCode?: EmbedCodeValue
  maxWidth?: string
}
