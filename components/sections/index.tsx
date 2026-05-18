'use client'

import HeroBlock from '@/components/hero-block'
import CoverBlock from '@/components/cover-block'
import CoverVideo from '@/components/cover-video'
import CtaBlock from '@/components/cta-block'
import TextBlock from '@/components/text-block'
import ImageBlock from '@/components/image-block'
import FaqBlock from '@/components/faq-block'
import EmbedBlock from '@/components/embed-block'
import FormBlock from '@/components/form-block'
import ColumnBlock from '@/components/column-block'
import GalleryBlock from '@/components/gallery-block'
import VideoBlock from '@/components/video-block'
import SpacerBlock from '@/components/spacer-block'
import DividerBlock from '@/components/divider-block'
import SplitScrollBlock from '@/components/split-scroll-block'
import ProblemBlock from '@/components/problem-block'
import { CtaLocationProvider } from '@/context'
import type { SectionsProps } from '@/types/components/sections-type'

const blockMap: Record<string, React.FC<Record<string, unknown>>> = {
  heroBlock: HeroBlock as React.FC<Record<string, unknown>>,
  coverBlock: CoverBlock as React.FC<Record<string, unknown>>,
  coverVideo: CoverVideo as React.FC<Record<string, unknown>>,
  ctaBlock: CtaBlock as React.FC<Record<string, unknown>>,
  textBlock: TextBlock as React.FC<Record<string, unknown>>,
  imageBlock: ImageBlock as React.FC<Record<string, unknown>>,
  faqBlock: FaqBlock as React.FC<Record<string, unknown>>,
  embedBlock: EmbedBlock as React.FC<Record<string, unknown>>,
  formBlock: FormBlock as React.FC<Record<string, unknown>>,
  columnBlock: ColumnBlock as React.FC<Record<string, unknown>>,
  galleryBlock: GalleryBlock as React.FC<Record<string, unknown>>,
  videoBlock: VideoBlock as React.FC<Record<string, unknown>>,
  spacerBlock: SpacerBlock as React.FC<Record<string, unknown>>,
  dividerBlock: DividerBlock as React.FC<Record<string, unknown>>,
  splitScrollBlock: SplitScrollBlock as React.FC<Record<string, unknown>>,
  problemBlock: ProblemBlock as React.FC<Record<string, unknown>>,
}

export default function Sections({ body }: SectionsProps) {
  if (!body?.length) return null

  return (
    <>
      {body.map((block, i) => {
        const key = block._key || `block-${i}`
        const Component = block._type ? blockMap[block._type] : null
        if (!Component) return null
        const location = block._type || 'section'
        return (
          <CtaLocationProvider key={key} value={location}>
            <Component componentIndex={i} {...block} />
          </CtaLocationProvider>
        )
      })}
    </>
  )
}
