'use client'

import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ImagePlaceholderVariant = 'grey' | 'wireframe'

type ImagePlaceholderProps = {
  variant: ImagePlaceholderVariant
  /** When true, fills a `position: relative` parent (`absolute inset-0`). */
  fill?: boolean
  width?: number
  height?: number
  className?: string
  alt?: string
}

/**
 * Missing or failed image: muted fill + dashed frame + camera (grey), or
 * diagonal hatch lines + larger camera (wireframe).
 */
export function ImagePlaceholder({
  variant,
  fill = true,
  width,
  height,
  className,
  alt = 'Image unavailable',
}: ImagePlaceholderProps) {
  const w = width ?? 1200
  const h = height ?? 800

  const surface = cn(
    'flex items-center justify-center overflow-hidden bg-muted text-muted-foreground',
    variant === 'wireframe' &&
      '[background-image:repeating-linear-gradient(135deg,transparent,transparent_7px,hsl(var(--border)/0.4)_7px,hsl(var(--border)/0.4)_8px)]',
    variant === 'grey' && 'ring-1 ring-inset ring-border/45',
    fill && 'absolute inset-0 size-full',
    className
  )

  const icon = (
    <Camera
      className={cn(
        'pointer-events-none shrink-0',
        variant === 'wireframe'
          ? 'size-[min(28%,5.5rem)] max-h-28 opacity-45'
          : 'size-11 opacity-35 md:size-12'
      )}
      strokeWidth={1.25}
      aria-hidden
    />
  )

  const inner =
    variant === 'grey' ? (
      <div className="flex size-full min-h-20 items-center justify-center rounded-md border border-dashed border-border/55 p-6 md:min-h-24">
        {icon}
      </div>
    ) : (
      icon
    )

  if (fill) {
    return (
      <div role="img" aria-label={alt} className={surface}>
        {inner}
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(surface, 'w-full max-w-full')}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      {inner}
    </div>
  )
}
