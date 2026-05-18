import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type ColumnBlockColumnCtaRoute = { title?: string; [key: string]: unknown }

export type ColumnBlockColumn = {
  _key?: string
  title?: string
  content?: unknown
  image?: {
    asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
    [key: string]: unknown
  } | null
  cta?: { active?: boolean; route?: ColumnBlockColumnCtaRoute } | null
}

export type ColumnBlockCta = { active?: boolean; route?: ColumnBlockColumnCtaRoute } | null

export type ColumnBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  backgroundColor?: SectionBackgroundColor
  alignment?: string
  header?: unknown
  footer?: unknown
  cta?: ColumnBlockCta
  columnsPerRow?: number
  columns?: ColumnBlockColumn[]
}
