'use client'

import { useMemo } from 'react'
import { cleanStega } from '@/lib/stega'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { normalizeSectionContentLayout } from '@/lib/section-content-layout'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { EmbedBlockProps, EmbedCodeValue } from '@/types/components/embed-block-type'
import { Card } from '@/components/ui/card'

function getCodeString(value: EmbedCodeValue): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'code' in value) {
    return typeof value.code === 'string' ? value.code : ''
  }
  return ''
}

export default function EmbedBlock({
  active = true,
  componentIndex = 0,
  sectionPadding,
  anchor,
  contentLayout,
  backgroundColor,
  title,
  embedCode,
  maxWidth = 'max-w-2xl',
}: EmbedBlockProps) {
  const html = useMemo(() => {
    const raw = getCodeString(embedCode)
    return cleanStega(raw).trim()
  }, [embedCode])

  if (!active) return null
  if (!html) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const layout = normalizeSectionContentLayout(contentLayout)
  const iframeTitle = title?.trim() || 'Embedded content'

  return (
    <section
      id={anchor || `embed-block-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'embed-block w-full flex justify-center px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default')
      )}
      aria-label={iframeTitle}
    >
      <div className="container">
        <div className={`w-full ${maxWidth} mx-auto content`}>
          {layout === 'card' ? (
            <Card className="w-full">
              {title ? <h2 className="text-center mb-6">{title}</h2> : null}
              <div
                className="embed-block__inner relative w-full min-h-[400px] overflow-hidden [&_iframe]:block [&_iframe]:min-h-[400px] [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </Card>
          ) : (
            <>
              {title ? <h2 className="text-center mb-6">{title}</h2> : null}
              <div
                className="embed-block__inner relative w-full min-h-[400px] overflow-hidden [&_iframe]:block [&_iframe]:min-h-[400px] [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
