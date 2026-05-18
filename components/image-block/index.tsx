'use client'

import SanityImage from '@/components/sanity-image'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { normalizeSectionContentLayout } from '@/lib/section-content-layout'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { ImageBlockProps } from '@/types/components/image-block-type'
import { Card } from '@/components/ui/card'

export default function ImageBlock({
  active = true,
  componentIndex = 0,
  sectionPadding,
  anchor,
  contentLayout,
  backgroundColor,
  image,
  imageMobile,
  maxWidth = 'max-w-2xl',
}: ImageBlockProps) {
  if (!active) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const layout = normalizeSectionContentLayout(contentLayout)
  const mobileImage = imageMobile ?? image

  return (
    <section
      id={anchor || `image-block-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'image-block w-full flex justify-center px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default')
      )}
    >
      <div className="container flex flex-col items-center gap-6">
        {image || mobileImage ? (
          <div
            className={cn(
              `relative w-full ${maxWidth} mx-auto`,
              layout === 'card'
                ? ''
                : 'overflow-hidden rounded-lg border border-border shadow-lg'
            )}
          >
            {layout === 'card' ? (
              <Card className="w-full gap-0 overflow-hidden p-0 py-0 shadow-sm">
                {image ? (
                  <div className="hidden md:block relative w-full">
                    <SanityImage
                      image={image}
                      fill={false}
                      alt={image.alt || 'Hero'}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                {mobileImage ? (
                  <div className="md:hidden relative w-full">
                    <SanityImage
                      image={mobileImage}
                      fill={false}
                      alt={(mobileImage as { alt?: string }).alt || 'Hero'}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
              </Card>
            ) : (
              <>
                {image ? (
                  <div className="hidden md:block relative w-full">
                    <SanityImage
                      image={image}
                      fill={false}
                      alt={image.alt || 'Hero'}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                {mobileImage ? (
                  <div className="md:hidden relative w-full">
                    <SanityImage
                      image={mobileImage}
                      fill={false}
                      alt={(mobileImage as { alt?: string }).alt || 'Hero'}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
