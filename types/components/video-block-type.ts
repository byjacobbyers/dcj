import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionContentLayout } from '@/lib/section-content-layout'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type VideoBlockMuxRef = { asset?: { playbackId?: string } }

export type VideoBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  contentLayout?: SectionContentLayout
  backgroundColor?: SectionBackgroundColor
  videoProvider?: 'mux' | 'vimeo'
  muxUrl?: VideoBlockMuxRef
  muxUrlMobile?: VideoBlockMuxRef | null
  vimeoUrl?: string | null
  vimeoUrlMobile?: string | null
  maxWidth?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}
