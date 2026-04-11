'use client'

import { motion } from 'framer-motion'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import Route from '@/components/route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { ColumnBlockProps } from '@/types/components/column-block-type'

export default function ColumnBlock({
  active = true,
  componentIndex = 0,
  anchor,
  title,
  columnsPerRow = 3,
  columns,
}: ColumnBlockProps) {
  if (!active) return null

  const columnsPerRowValue = columnsPerRow || 3
  const gridCols =
    columnsPerRowValue === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columnsPerRowValue === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <section
      id={anchor || `column-block-${componentIndex}`}
      className="column-block w-full overflow-x-hidden px-5 py-16 md:py-24 flex justify-center"
    >
      <div className="relative z-10 container flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex w-full flex-col items-center justify-center content"
        >
          {title && (
            <h2 className="mb-8 w-full text-center md:mb-12">
              {title}
            </h2>
          )}
          {columns && Array.isArray(columns) && columns.length > 0 && (
            <div
              className={`grid w-full gap-x-6 gap-y-5 lg:mx-auto lg:max-w-[75vw] ${gridCols}`}
            >
              {columns.map((column, index) => {
                const isMiddleOfThree =
                  columns.length === 3 && columnsPerRowValue === 3 && index === 1

                return (
                  <Card
                    key={column._key || index}
                    className={cn(
                      'flex w-full min-h-0 min-w-0 max-w-none flex-col items-center justify-center overflow-hidden rounded-md border-0 py-6 md:py-8',
                      isMiddleOfThree
                        ? 'relative z-10 bg-muted/52 md:scale-[1.04] md:py-10'
                        : 'bg-muted/40'
                    )}
                  >
                    {column.image && (
                      <div className="w-full shrink-0 px-5 pt-3 pb-3">
                        <div
                          className={`relative mx-auto w-full max-w-full overflow-hidden ${
                            column.title === 'TerraTrue' ? 'h-6' : 'h-8'
                          }`}
                        >
                          <SanityImage
                            image={column.image}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-contain object-center"
                          />
                        </div>
                      </div>
                    )}
                    {(column.content && Array.isArray(column.content)) ? (
                      <CardContent className="min-h-0 overflow-y-auto px-3 text-center text-balance sm:px-6">
                        <div className="content">
                          <SimpleText content={column.content} />
                        </div>
                      </CardContent>
                    ) : null}
                    {column.cta && column.cta.active && column.cta.route && (
                      <CardFooter className="mt-auto shrink-0 justify-center px-3 pb-3 pt-2 sm:px-6">
                        <Route data={column.cta.route as Parameters<typeof Route>[0]['data']}>
                          <Button variant="secondary">
                            {String((column.cta.route as { title?: string }).title || 'Learn More')}
                          </Button>
                        </Route>
                      </CardFooter>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
