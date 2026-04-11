export type GalleryBlockImage = {
  asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
  [key: string]: unknown
}

export type GalleryBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  images?: GalleryBlockImage[]
  imagesPerRow?: number
  enableLightbox?: boolean
}
