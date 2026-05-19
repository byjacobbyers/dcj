'use client'

import NormalText from '@/components/normal-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { normalizeSectionContentLayout } from '@/lib/section-content-layout'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cleanStega } from '@/lib/stega'
import { cn } from '@/lib/utils'
import type { TextBlockProps } from '@/types/components/text-block-type'
import { Card } from '@/components/ui/card'

export default function TextBlock({
  active = true,
  componentIndex = 0,
  sectionPadding,
  anchor,
  contentLayout,
  backgroundColor,
  contentAlignment = 'left',
  content,
}: TextBlockProps) {
  if (!active) return null

  const rawBg = cleanStega(typeof backgroundColor === 'string' ? backgroundColor : '')
  const isTexture = rawBg === 'texture'
  const bg = isTexture ? 'transparent' : normalizeSectionBackground(backgroundColor)
  const layout = normalizeSectionContentLayout(contentLayout)
  const alignRaw = cleanStega(typeof contentAlignment === 'string' ? contentAlignment : '') || 'left'
  const alignClass =
    alignRaw === 'center' ? 'text-center' : alignRaw === 'right' ? 'text-right' : 'text-left'
  const itemsClass =
    alignRaw === 'center' ? 'items-center' : alignRaw === 'right' ? 'items-end' : 'items-start'

  const body = (
    <div className={cn('content text-balance text-sm!', isTexture && 'relative z-10 text-foreground')}>
      <NormalText content={content} />
    </div>
  )

  return (
    <section
      id={anchor || `text-block-${componentIndex}`}
      data-background-color={isTexture ? 'texture' : bg}
      className={cn(
        'text-block w-full flex justify-center px-5',
        isTexture ? 'relative bg-black' : sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default'),
      )}
      {...(isTexture ? {} : sectionSurfaceAttrs(bg))}
    >
      {isTexture ? <TextureSectionBackdrop /> : null}
      <div className={cn('container flex w-full flex-col', alignClass, itemsClass)}>
        {layout === 'card' ? <Card className="w-full">{body}</Card> : body}
      </div>
    </section>
  )
}
