'use client'

import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import Route from '@/components/route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { cleanStega } from '@/lib/stega'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { ColumnBlockProps } from '@/types/components/column-block-type'

export default function ColumnBlock({
  active = true,
  componentIndex = 0,
  sectionPadding,
  anchor,
  backgroundColor,
  alignment = 'text-center',
  header,
  footer,
  cta,
  columnsPerRow = 3,
  columns,
}: ColumnBlockProps) {
  if (!active) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const copyAlignClass = alignment ?? 'text-center'
  const stackItemsClass =
    copyAlignClass === 'text-left'
      ? 'items-start'
      : copyAlignClass === 'text-right'
        ? 'items-end'
        : 'items-center'
  const ctaRowJustifyClass =
    copyAlignClass === 'text-left'
      ? 'justify-start'
      : copyAlignClass === 'text-right'
        ? 'justify-end'
        : 'justify-center'
  const columnsPerRowValue = columnsPerRow || 3
  const gridCols =
    columnsPerRowValue === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columnsPerRowValue === 3
        ? 'grid-cols-1 lg:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <section
      id={anchor || `column-block-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'column-block flex w-full justify-center overflow-x-hidden px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default')
      )}
    >
      <div className="relative z-10 container flex justify-center">
        <div className={cn('flex w-full flex-col', stackItemsClass)}>
          {header && Array.isArray(header) && header.length > 0 ? (
            <div className={cn('mb-8 w-full md:mb-12', copyAlignClass)}>
              <div className="content">
                <SimpleText content={header} />
              </div>
            </div>
          ) : null}
          {columns && Array.isArray(columns) && columns.length > 0 && (
            <div
              className={`grid w-full gap-x-6 gap-y-5 ${gridCols}`}
            >
              {columns.map((column, index) => (
                  <Card
                    key={column._key || index}
                    className="w-full min-h-0 min-w-0"
                  >
                    {column.image && (
                      <div className="w-full shrink-0 px-6 py-3">
                        <div className="relative mx-auto w-full aspect-square rounded-full max-w-32 2xl:max-w-48 overflow-hidden border">
                          <SanityImage
                            image={column.image}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-contain object-center"
                          />
                        </div>
                      </div>
                    )}
                    {column.title?.trim() ||
                    (column.content && Array.isArray(column.content)) ? (
                      <CardContent className="min-h-0 overflow-y-auto text-center text-balance">
                        {column.title?.trim() ? (
                          <h3 className="text-h4 mb-4 text-balance">
                            {cleanStega(column.title)}
                          </h3>
                        ) : null}
                        {column.content && Array.isArray(column.content) ? (
                          <div className="content">
                            <SimpleText content={column.content} />
                          </div>
                        ) : null}
                      </CardContent>
                    ) : null}
                    {column.cta && column.cta.active && column.cta.route && (
                      <CardFooter className="mt-auto justify-center border-t pt-6">
                        <Route data={column.cta.route as Parameters<typeof Route>[0]['data']}>
                          <Button variant="secondary">
                            {String((column.cta.route as { title?: string }).title || 'Learn More')}
                          </Button>
                        </Route>
                      </CardFooter>
                    )}
                  </Card>
              ))}
            </div>
          )}
          {footer && Array.isArray(footer) && footer.length > 0 ? (
            <div className={cn('mt-10 w-full md:mt-14', copyAlignClass)}>
              <div className="content">
                <SimpleText content={footer} />
              </div>
            </div>
          ) : null}
          {cta?.active && cta?.route ? (
            <div className={cn('mt-6 flex w-full', ctaRowJustifyClass)}>
              <Button asChild variant={bg === 'secondary' ? 'secondary' : 'default'} className="mt-5">
                <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                  {(cta.route as { title?: string }).title || 'Learn More'}
                </Route>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
