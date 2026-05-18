import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type FormBlockFormData = {
  name: string
  email: string
  message: string
  isAnonymous: boolean
  website?: string
}

export type FormBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  backgroundColor?: SectionBackgroundColor
  content?: unknown
}
