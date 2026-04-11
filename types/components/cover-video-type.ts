export type CoverVideoProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  videoProvider?: 'mux' | 'vimeo'
  muxUrl?: {
    asset?: { playbackId?: string; data?: { aspect_ratio?: string } }
  } | null
  muxUrlMobile?: {
    asset?: { playbackId?: string; data?: { aspect_ratio?: string } }
  } | null
  vimeoUrl?: string | null
  vimeoUrlMobile?: string | null
  height?: 'auto' | 'full' | 'half'
  overlayColor?: 'none' | 'black' | 'white' | 'primary'
  overlayOpacity?: number
  contentPosition?: string
  contentHalfWidth?: boolean
  content?: unknown
  cta?: { active?: boolean; route?: unknown } | null
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}
