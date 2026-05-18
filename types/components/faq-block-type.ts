import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type FaqBlockFaq = {
  question?: string
  answer?: unknown
}

export type FaqBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  backgroundColor?: SectionBackgroundColor
  faqs?: FaqBlockFaq[]
}
