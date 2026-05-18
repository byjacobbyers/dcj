'use client'

import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import SanityImage from '@/components/sanity-image'
import SimpleText from '@/components/simple-text'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { normalizeSectionContentLayout } from '@/lib/section-content-layout'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { HeroBlockProps } from '@/types/components/hero-block-type'
import { Card } from '@/components/ui/card'

export default function HeroBlock({
  active = true,
  componentIndex = 0,
  sectionPadding,
  layout = 'image-right',
  anchor,
  contentLayout,
  backgroundColor,
  image,
  content,
  cta,
}: HeroBlockProps) {
  if (!active) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const innerContentLayout = normalizeSectionContentLayout(contentLayout)
  const layoutClass = layout === 'image-left' ? 'md:flex-row-reverse' : 'md:flex-row'

  return (
    <section
      id={anchor || `hero-block-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'hero-block w-full flex justify-center px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default')
      )}
    >
      <div
        className={`container flex flex-wrap md:flex-nowrap ${layoutClass} flex-col-reverse items-center w-full gap-10 gap-y-16`}
      >
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          {innerContentLayout === 'card' ? (
            <Card className="w-full">
              {content ? (
                <div className="content">
                  <SimpleText content={content} />
                </div>
              ) : null}
              {cta?.active && cta?.route ? (
                <div className="flex">
                  <Button asChild variant={bg === 'secondary' ? 'secondary' : 'default'} className="mt-5">
                    <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                      {(cta.route as { title?: string }).title || 'Learn More'}
                    </Route>
                  </Button>
                </div>
              ) : null}
            </Card>
          ) : (
            <>
              {content ? (
                <div className="content">
                  <SimpleText content={content} />
                </div>
              ) : null}
              {cta?.active && cta?.route ? (
                <div className="flex">
                  <Button asChild variant={bg === 'secondary' ? 'secondary' : 'default'} className="mt-5">
                    <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                      {(cta.route as { title?: string }).title || 'Learn More'}
                    </Route>
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-full border border-border shadow-lg md:w-1/2">
          <SanityImage
            image={image}
            fill
            alt={
              image && typeof image === 'object' && 'alt' in image && typeof (image as { alt?: string }).alt === 'string'
                ? (image as { alt?: string }).alt
                : 'Hero'
            }
            className="object-cover"
            sizes="(max-width: 768px) min(100vw, 42rem), min(50vw, 42rem)"
          />
        </div>
      </div>
    </section>
  )
}
