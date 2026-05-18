'use client'

import Image from 'next/image'
import { useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageProps, SanityImageSource } from '@/types/components/sanity-image-type'
import { ImagePlaceholder } from '@/components/sanity-image/placeholder'

export type { SanityImageSource }

function resolveAlt(image: SanityImageSource | null | undefined, altOverride?: string) {
  if (altOverride) return altOverride
  if (image && typeof image === 'object' && 'alt' in image && typeof (image as { alt?: string }).alt === 'string') {
    return (image as { alt?: string }).alt ?? ''
  }
  return ''
}

/**
 * Renders a Sanity image with crop and hotspot support via urlFor.
 * Pass the full image object (asset, crop, hotspot, alt) so Sanity's
 * image pipeline respects editor crop/hotspot settings.
 *
 * When `fill` is true, the parent should be `position: relative` so the
 * missing/error placeholder (`absolute inset-0`) sizes correctly.
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
  placeholder = 'grey',
}: SanityImageProps) {
  /** URL that failed to load; cleared implicitly when `imageUrl` changes. */
  const [failedForUrl, setFailedForUrl] = useState<string | null>(null)
  const alt = resolveAlt(image, altOverride)

  const asset =
    image && typeof image === 'object' && 'asset' in image ? (image as { asset?: unknown }).asset : null

  const imageUrl =
    image && typeof image === 'object' && asset
      ? urlFor(image as SanityImageSource).quality(quality).url()
      : null

  const loadFailed = Boolean(imageUrl && failedForUrl === imageUrl)

  const meta =
    asset && typeof asset === 'object' && 'metadata' in asset
      ? (asset as { metadata?: { dimensions?: { width?: number; height?: number } } }).metadata
      : undefined
  const dims = meta?.dimensions
  const w = width ?? dims?.width ?? 1200
  const h = height ?? dims?.height ?? 800

  const showPlaceholder =
    loadFailed ||
    !image ||
    typeof image !== 'object' ||
    !asset ||
    !imageUrl

  if (showPlaceholder) {
    return (
      <ImagePlaceholder
        variant={placeholder}
        fill={fill}
        width={fill ? undefined : w}
        height={fill ? undefined : h}
        className={className}
        alt={alt || 'Image unavailable'}
      />
    )
  }

  const isSvg = imageUrl.includes('.svg') || imageUrl.includes('format=svg')

  if (isSvg) {
    return (
      <img
        src={imageUrl}
        alt={alt || 'Image'}
        className={[className, 'w-full h-full'].filter(Boolean).join(' ')}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => imageUrl && setFailedForUrl(imageUrl)}
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
        onError={() => imageUrl && setFailedForUrl(imageUrl)}
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={alt || 'Image'}
      width={w}
      height={h}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => imageUrl && setFailedForUrl(imageUrl)}
    />
  )
}
