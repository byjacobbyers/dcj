'use client'

import SanityImage from '@/components/sanity-image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { GalleryBlockProps } from '@/types/components/gallery-block-type'

export default function GalleryBlock({
  active = true,
  componentIndex = 0,
  sectionPadding,
  anchor,
  backgroundColor,
  images,
  imagesPerRow = 3,
  enableLightbox = true,
}: GalleryBlockProps) {
  const [lightboxImage, setLightboxImage] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!active) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const imagesPerRowValue = imagesPerRow || 3
  const gridCols =
    imagesPerRowValue === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : imagesPerRowValue === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  if (!images || images.length === 0) return null

  return (
    <>
      <section
        id={anchor || `gallery-block-${componentIndex}`}
        data-background-color={bg}
        {...sectionSurfaceAttrs(bg)}
        className={cn(
          'gallery-block w-full flex justify-center px-5',
          sectionSemanticSurfaceClasses(bg),
          sectionPaddingToClass(sectionPadding, 'default')
        )}
      >
        <div className="container">
          <div className="flex flex-wrap -mx-[15px]">
            <div className="flex-[0_0_100%] max-w-full px-[15px]">
              <div className={`grid ${gridCols} gap-4`}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted shadow-lg"
                  >
                    {enableLightbox !== false ? (
                      <button
                        onClick={() => setLightboxImage(index)}
                        className="w-full h-full hover:opacity-90 transition-opacity"
                      >
                        <SanityImage
                          image={image}
                          width={image?.asset?.metadata?.dimensions?.width || 400}
                          height={image?.asset?.metadata?.dimensions?.height || 400}
                          fill={false}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <SanityImage
                        image={image}
                        width={image?.asset?.metadata?.dimensions?.width || 400}
                        height={image?.asset?.metadata?.dimensions?.height || 400}
                        fill={false}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox: portal + z-[100] so fixed positioning is viewport-relative (Framer transform ancestors break fixed hits) and above header z-50 */}
      {mounted &&
        lightboxImage !== null &&
        enableLightbox !== false &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery"
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              type="button"
              className="absolute top-2 right-2 z-10 p-3 text-3xl leading-none text-white hover:opacity-70 sm:top-4 sm:right-4"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxImage(null)
              }}
              aria-label="Close lightbox"
            >
              ×
            </button>
            {lightboxImage > 0 && (
              <button
                type="button"
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white text-2xl hover:opacity-70"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxImage(lightboxImage - 1)
                }}
                aria-label="Previous image"
              >
                ←
              </button>
            )}
            {lightboxImage < images.length - 1 && (
              <button
                type="button"
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white text-2xl hover:opacity-70 sm:right-14"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxImage(lightboxImage + 1)
                }}
                aria-label="Next image"
              >
                →
              </button>
            )}
            <div
              className="relative max-h-full max-w-7xl"
              onClick={(e) => e.stopPropagation()}
            >
              {images[lightboxImage] && (
                <SanityImage
                  image={images[lightboxImage]}
                  width={images[lightboxImage]?.asset?.metadata?.dimensions?.width || 1200}
                  height={images[lightboxImage]?.asset?.metadata?.dimensions?.height || 800}
                  fill={false}
                  className="max-h-[90vh] max-w-full object-contain"
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
