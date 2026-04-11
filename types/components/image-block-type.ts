export type ImageBlockImage = {
  asset?: { url?: string }
  alt?: string
  crop?: unknown
  hotspot?: unknown
} | null

export type ImageBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  image?: ImageBlockImage
  imageMobile?: ImageBlockImage
  maxWidth?: string
}
