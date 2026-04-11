'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

import type { SanityImageProps } from '@/types/components/sanity-image-type'

/**
 * Renders a Sanity image with crop and hotspot support via urlFor.
 * Pass the full image object (asset, crop, hotspot, alt) so Sanity's
 * image pipeline respects editor crop/hotspot settings.
 */
export default function SanityImage({
  image,
  alt: altOverride,
  fill = true,
  width,
  height,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 80,
}: SanityImageProps) {
  if (!image || typeof image !== 'object') return null
  const asset = 'asset' in image ? image.asset : null
  if (!asset) return null

  const alt =
    altOverride ??
    ('alt' in image && typeof (image as { alt?: string }).alt === 'string'
      ? (image as { alt?: string }).alt
      : '')

  const imageUrl = urlFor(image).quality(quality).url()

  if (!imageUrl) return null

  const isSvg = imageUrl.includes('.svg') || imageUrl.includes('format=svg')

  if (isSvg) {
    return (
      <img
        src={imageUrl}
        alt={alt || 'Image'}
        className={[className, 'w-full h-full'].filter(Boolean).join(' ')}
        loading={priority ? 'eager' : 'lazy'}
      />
    )
  }

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt || 'Image'}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  const meta = asset && typeof asset === 'object' && 'metadata' in asset ? (asset as { metadata?: { dimensions?: { width?: number; height?: number } } }).metadata : undefined
  const dims = meta?.dimensions
  const w = width ?? dims?.width ?? 1200
  const h = height ?? dims?.height ?? 800

  return (
    <Image
      src={imageUrl}
      alt={alt || 'Image'}
      width={w}
      height={h}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
