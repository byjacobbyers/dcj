'use client'

import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import SimpleText from '@/components/simple-text'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { normalizeSectionContentLayout } from '@/lib/section-content-layout'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cleanStega } from '@/lib/stega'
import { cn } from '@/lib/utils'
import type { CtaBlockProps } from '@/types/components/cta-block-type'
import { Card } from '@/components/ui/card'

export default function CtaBlock({
  active = true,
  componentIndex = 0,
  sectionPadding,
  anchor,
  contentLayout,
  backgroundColor,
  alignment = 'text-center',
  content,
  cta,
}: CtaBlockProps) {
  if (!active) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const layout = normalizeSectionContentLayout(contentLayout)
  const copyAlignClass =
    cleanStega(typeof alignment === 'string' ? alignment : '') || 'text-center'
  const stackItemsClass =
    copyAlignClass === 'text-left'
      ? 'items-start justify-start'
      : copyAlignClass === 'text-right'
        ? 'items-end justify-end'
        : 'items-center justify-center'
  const buttonVariant = bg === 'secondary' ? 'secondary' : 'default'
  const buttonSize = bg === 'secondary' ? 'default' : 'lg'

  return (
    <section
      id={anchor || `cta-block-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'cta-block w-full flex justify-center px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default')
      )}
    >
      <div className="container">
        <div className={`mt-5 flex w-full flex-col gap-6 ${stackItemsClass}`}>
          {layout === 'card' ? (
            <Card className="w-full">
              {content ? (
                <div className={`w-full ${copyAlignClass}`}>
                  <div className="content">
                    <SimpleText content={content} />
                  </div>
                </div>
              ) : null}
              {cta?.active && cta?.route ? (
                <div className={`w-full flex ${stackItemsClass} pt-5`}>
                  <Button asChild variant={buttonVariant} size={buttonSize}>
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
                <div className={`w-full ${copyAlignClass}`}>
                  <div className="content">
                    <SimpleText content={content} />
                  </div>
                </div>
              ) : null}
              {cta?.active && cta?.route ? (
                <div className={`w-full flex ${stackItemsClass} pt-5`}>
                  <Button asChild variant={buttonVariant} size={buttonSize}>
                    <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                      {(cta.route as { title?: string }).title || 'Learn More'}
                    </Route>
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
