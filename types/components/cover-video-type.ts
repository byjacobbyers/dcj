import type { SectionBackgroundColor } from '@/lib/section-background'
import type { SectionContentLayout } from '@/lib/section-content-layout'
import type { SectionPaddingValue } from '@/lib/section-padding'

export type CoverVideoMuxAsset = {
  asset?: { playbackId?: string; data?: { aspect_ratio?: string } }
} | null

export type CoverVideoCta = { active?: boolean; route?: unknown } | null

export type CoverVideoProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  contentLayout?: SectionContentLayout
  backgroundColor?: SectionBackgroundColor
  videoProvider?: 'mux' | 'vimeo'
  muxUrl?: CoverVideoMuxAsset
  muxUrlMobile?: CoverVideoMuxAsset
  vimeoUrl?: string | null
  vimeoUrlMobile?: string | null
  height?: 'auto' | 'full' | 'half'
  overlayColor?: 'none' | 'black' | 'primary' | 'secondary'
  overlayOpacity?: number
  contentPosition?: string
  content?: unknown
  cta?: CoverVideoCta
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}
