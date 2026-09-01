'use client'

import { useState } from 'react'
import ColumnBlock from '@/components/column-block'
import CoverBlock from '@/components/cover-block'
import CoverVideo from '@/components/cover-video'
import CtaBlock from '@/components/cta-block'
import DividerBlock from '@/components/divider-block'
import EmbedBlock from '@/components/embed-block'
import FaqBlock from '@/components/faq-block'
import FormBlock from '@/components/form-block'
import GalleryBlock from '@/components/gallery-block'
import HeroBlock from '@/components/hero-block'
import ImageBlock from '@/components/image-block'
import PostsBlock from '@/components/posts-block/index'
import SpacerBlock from '@/components/spacer-block'
import SplitScrollBlock from '@/components/split-scroll-block'
import TeamMemberBlock from '@/components/team-member-block'
import TextBlock from '@/components/text-block'
import VideoBlock from '@/components/video-block'
import { CtaLocationProvider } from '@/context'
import type { SectionBackgroundColor } from '@/lib/section-background'
import {
  BG_GROUP,
  SectionChrome,
  SectionControls,
  type ControlGroup,
} from './section-controls'
import {
  fixtureCta,
  fixtureEmbedHtml,
  fixtureImage,
  fixtureMember,
  fixturePosts,
  fixtureVimeoUrl,
  pt,
  ptBlocks,
} from './fixtures'

function useVariantState<T extends Record<string, string>>(defaults: T) {
  const [values, setValues] = useState(defaults)
  const onChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }
  return [values, onChange] as const
}

const HEIGHT_GROUP: ControlGroup = {
  key: 'height',
  label: 'Height',
  options: [
    { value: 'full', label: 'Full' },
    { value: 'half', label: 'Half' },
    { value: 'auto', label: 'Auto' },
  ],
}

const POSITION_GROUP: ControlGroup = {
  key: 'contentPosition',
  label: 'Position',
  options: [
    { value: 'top-left', label: 'Top left' },
    { value: 'top-center', label: 'Top center' },
    { value: 'top-right', label: 'Top right' },
    { value: 'center-left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'center-right', label: 'Right' },
    { value: 'bottom-left', label: 'Bottom left' },
    { value: 'bottom-center', label: 'Bottom' },
    { value: 'bottom-right', label: 'Bottom right' },
  ],
}

export function CoverPlayground() {
  const [values, onChange] = useVariantState({
    backgroundType: 'image',
    height: 'half',
    backgroundColor: 'primary',
    contentPosition: 'center',
  })

  const groups: ControlGroup[] = [
    {
      key: 'backgroundType',
      label: 'Media',
      options: [
        { value: 'image', label: 'Image' },
        { value: 'color', label: 'Color' },
      ],
    },
    HEIGHT_GROUP,
    POSITION_GROUP,
    ...(values.backgroundType === 'color' ? [BG_GROUP] : []),
  ]

  const note = `${values.backgroundType} · ${values.height} · ${values.contentPosition}`

  return (
    <SectionChrome id="cover" title="Cover" type="coverBlock" note={note}>
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="coverBlock">
        <CoverBlock
          componentIndex={0}
          backgroundType={values.backgroundType as 'image' | 'color'}
          height={values.height as 'auto' | 'full' | 'half'}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          contentPosition={values.contentPosition}
          content={ptBlocks([
            { text: 'Cover block', style: 'h1' },
            { text: 'Full-bleed media with overlay content. Image slot falls back to a placeholder.' },
          ])}
          cta={fixtureCta}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function CoverVideoPlayground() {
  const [values, onChange] = useVariantState({
    height: 'half',
    contentPosition: 'center',
    backgroundColor: 'transparent',
  })

  const groups: ControlGroup[] = [HEIGHT_GROUP, POSITION_GROUP]

  return (
    <SectionChrome
      id="cover-video"
      title="Cover video"
      type="coverVideo"
      note={`vimeo fixture · ${values.height} · ${values.contentPosition}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="coverVideo">
        <CoverVideo
          componentIndex={1}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          videoProvider="vimeo"
          vimeoUrl={fixtureVimeoUrl}
          height={values.height as 'auto' | 'full' | 'half'}
          contentPosition={values.contentPosition}
          overlayColor="black"
          overlayOpacity={40}
          content={ptBlocks([
            { text: 'Cover video', style: 'h1' },
            { text: 'Background video with overlay content. Fixture uses a public Vimeo clip.' },
          ])}
          cta={fixtureCta}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function HeroPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'transparent',
    layout: 'image-right',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'layout',
      label: 'Layout',
      options: [
        { value: 'image-right', label: 'Image right' },
        { value: 'image-left', label: 'Image left' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="hero"
      title="Hero"
      type="heroBlock"
      note={`${values.layout} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="heroBlock">
        <HeroBlock
          componentIndex={2}
          layout={values.layout}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          image={null}
          content={ptBlocks([
            { text: 'Hero section', style: 'h1' },
            { text: 'Split layout with square media slot. Fixture renders the image placeholder.' },
          ])}
          cta={fixtureCta}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function CtaPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'secondary',
    alignment: 'text-center',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'alignment',
      label: 'Align',
      options: [
        { value: 'text-left', label: 'Left' },
        { value: 'text-center', label: 'Center' },
        { value: 'text-right', label: 'Right' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="cta"
      title="CTA"
      type="ctaBlock"
      note={`${values.backgroundColor} · ${values.alignment}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="ctaBlock">
        <CtaBlock
          componentIndex={3}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          alignment={values.alignment}
          content={ptBlocks([
            { text: 'Ready to dance?', style: 'h2' },
            { text: 'CTA block — toggle background and alignment.' },
          ])}
          cta={fixtureCta}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function TextPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'transparent',
    contentAlignment: 'left',
  })

  const groups: ControlGroup[] = [
    {
      key: 'backgroundColor',
      label: 'Background',
      options: [
        ...BG_GROUP.options,
        { value: 'texture', label: 'Texture' },
      ],
    },
    {
      key: 'contentAlignment',
      label: 'Align',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="text"
      title="Text"
      type="textBlock"
      note={`${values.backgroundColor} · ${values.contentAlignment}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="textBlock">
        <TextBlock
          componentIndex={4}
          backgroundColor={values.backgroundColor as SectionBackgroundColor | 'texture'}
          contentAlignment={values.contentAlignment}
          content={ptBlocks([
            { text: 'Text block', style: 'h2' },
            {
              text: 'Long-form content uses the same .content typography hooks as Portable Text on the site.',
            },
            { text: 'Use this section for narrative copy, lists, and inline emphasis.' },
          ])}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function ImagePlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'transparent',
    maxWidth: 'max-w-2xl',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'maxWidth',
      label: 'Max width',
      options: [
        { value: 'max-w-md', label: 'Narrow' },
        { value: 'max-w-2xl', label: 'Medium' },
        { value: 'max-w-4xl', label: 'Wide' },
        { value: 'max-w-full', label: 'Full' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="image"
      title="Image"
      type="imageBlock"
      note={`${values.maxWidth} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="imageBlock">
        <ImageBlock
          componentIndex={5}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          image={fixtureImage}
          maxWidth={values.maxWidth}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function VideoPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'transparent',
    maxWidth: 'max-w-2xl',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'maxWidth',
      label: 'Max width',
      options: [
        { value: 'max-w-md', label: 'Narrow' },
        { value: 'max-w-2xl', label: 'Medium' },
        { value: 'max-w-4xl', label: 'Wide' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="video"
      title="Video"
      type="videoBlock"
      note={`vimeo fixture · ${values.maxWidth} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="videoBlock">
        <VideoBlock
          componentIndex={6}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          videoProvider="vimeo"
          vimeoUrl={fixtureVimeoUrl}
          maxWidth={values.maxWidth}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function GalleryPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'transparent',
    imagesPerRow: '3',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'imagesPerRow',
      label: 'Per row',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="gallery"
      title="Gallery"
      type="galleryBlock"
      note={`${values.imagesPerRow}/row · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="galleryBlock">
        <GalleryBlock
          componentIndex={7}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          imagesPerRow={Number(values.imagesPerRow) || 3}
          images={Array.from({ length: 6 }, (_, i) => ({
            alt: `Gallery placeholder ${i + 1}`,
          }))}
          enableLightbox={false}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function FaqPlayground() {
  const [values, onChange] = useVariantState({ backgroundColor: 'transparent' })

  return (
    <SectionChrome id="faq" title="FAQ" type="faqBlock" note={values.backgroundColor}>
      <SectionControls groups={[BG_GROUP]} values={values} onChange={onChange} />
      <CtaLocationProvider value="faqBlock">
        <FaqBlock
          componentIndex={8}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          faqs={[
            {
              question: 'What is this design gallery for?',
              answer: pt(
                'A noindex reference for reviewing live section components with fixture props.'
              ),
            },
            {
              question: 'Does this hit Sanity?',
              answer: pt('No — all fixtures are local, and media slots render placeholders.'),
            },
            {
              question: 'Where do UI primitives live?',
              answer: pt('See /design/components for Button, Card, Input, Accordion, and more.'),
            },
          ]}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function SplitScrollPlayground() {
  const [values, onChange] = useVariantState({ backgroundColor: 'primary' })

  const groups: ControlGroup[] = [
    {
      key: 'backgroundColor',
      label: 'Background',
      options: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'texture', label: 'Texture' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="split-scroll"
      title="Split scroll"
      type="splitScrollBlock"
      note={values.backgroundColor}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="splitScrollBlock">
        <SplitScrollBlock
          componentIndex={9}
          backgroundColor={values.backgroundColor as 'primary' | 'secondary' | 'texture'}
          title={pt('Split scroll', 'h2')}
          items={[
            {
              _key: 'ss1',
              content: ptBlocks([
                { text: 'Arrive', style: 'h3' },
                { text: 'Doors open, warm-up circle, and a soft landing onto the floor.' },
              ]),
            },
            {
              _key: 'ss2',
              content: ptBlocks([
                { text: 'Dance', style: 'h3' },
                { text: 'Open jam — solo, duet, or watching from the edge all count.' },
              ]),
            },
            {
              _key: 'ss3',
              content: ptBlocks([
                { text: 'Close', style: 'h3' },
                { text: 'A short closing circle to land the practice together.' },
              ]),
            },
          ]}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function ColumnPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'transparent',
    columnsPerRow: '3',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'columnsPerRow',
      label: 'Columns',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
      ],
    },
  ]

  const columnsPerRow = Number(values.columnsPerRow) || 3
  const columns = [
    {
      _key: 'c1',
      title: 'Beginners',
      content: pt('No experience needed. The opening warm-up teaches the basics.'),
      cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'Learn more' } },
    },
    {
      _key: 'c2',
      title: 'Regulars',
      content: pt('Open floor every week — same time, same place.'),
      cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'Learn more' } },
    },
    {
      _key: 'c3',
      title: 'Teachers',
      content: pt('Guest facilitators lead occasional themed sessions.'),
      cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'Learn more' } },
    },
    {
      _key: 'c4',
      title: 'Musicians',
      content: pt('Live accompaniment welcome — reach out before the jam.'),
      cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'Learn more' } },
    },
  ].slice(0, columnsPerRow)

  return (
    <SectionChrome
      id="cards"
      title="Columns"
      type="columnBlock"
      note={`${columnsPerRow} col · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="columnBlock">
        <ColumnBlock
          componentIndex={11}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          columnsPerRow={columnsPerRow}
          header={pt('Who the jam is for', 'h2')}
          columns={columns}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function FormPlayground() {
  const [values, onChange] = useVariantState({ backgroundColor: 'transparent' })

  return (
    <SectionChrome id="form" title="Form" type="formBlock" note={values.backgroundColor}>
      <SectionControls groups={[BG_GROUP]} values={values} onChange={onChange} />
      <CtaLocationProvider value="formBlock">
        <FormBlock
          componentIndex={12}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          content={ptBlocks([
            { text: 'Get in touch', style: 'h2' },
            { text: 'Built-in contact form with optional anonymous sending.' },
          ])}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function EmbedPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'transparent',
    maxWidth: 'max-w-2xl',
    title: 'on',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'maxWidth',
      label: 'Max width',
      options: [
        { value: 'max-w-md', label: 'Narrow' },
        { value: 'max-w-2xl', label: 'Medium' },
        { value: 'max-w-4xl', label: 'Wide' },
        { value: 'max-w-full', label: 'Full' },
      ],
    },
    {
      key: 'title',
      label: 'Title',
      options: [
        { value: 'on', label: 'On' },
        { value: 'off', label: 'Off' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="embed"
      title="Embed"
      type="embedBlock"
      note={`${values.maxWidth} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="embedBlock">
        <EmbedBlock
          componentIndex={13}
          backgroundColor={values.backgroundColor as SectionBackgroundColor}
          title={values.title === 'on' ? 'Embed block' : null}
          maxWidth={values.maxWidth}
          embedCode={fixtureEmbedHtml}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function SpacerPlayground() {
  const [values, onChange] = useVariantState({ size: 'medium' })

  const groups: ControlGroup[] = [
    {
      key: 'size',
      label: 'Size',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="spacer"
      title="Spacer"
      type="spacerBlock"
      note={`${values.size} · invisible vertical gap`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="spacerBlock">
        <SpacerBlock size={values.size} />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function DividerPlayground() {
  const [values, onChange] = useVariantState({ size: 'medium' })

  const groups: ControlGroup[] = [
    {
      key: 'size',
      label: 'Size',
      options: [
        { value: 'zero', label: 'Zero' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
    },
  ]

  return (
    <SectionChrome id="divider" title="Divider" type="dividerBlock" note={values.size}>
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="dividerBlock">
        <DividerBlock size={values.size} />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function PostsPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'transparent',
    count: '2',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'count',
      label: 'Show',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
      ],
    },
  ]

  const count = Number(values.count) || 2

  return (
    <SectionChrome
      id="posts"
      title="Posts"
      type="postsBlock"
      note={`show ${count} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="postsBlock">
        <PostsBlock
          key={`posts-${count}-${values.backgroundColor}`}
          componentIndex={14}
          backgroundColor={values.backgroundColor}
          title="Posts"
          count={count}
          initialPosts={fixturePosts}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function TeamPlayground() {
  const [values, onChange] = useVariantState({ backgroundColor: 'transparent' })

  return (
    <SectionChrome
      id="team"
      title="Team member"
      type="teamMemberBlock"
      note={values.backgroundColor}
    >
      <SectionControls groups={[BG_GROUP]} values={values} onChange={onChange} />
      <CtaLocationProvider value="teamMemberBlock">
        <TeamMemberBlock
          componentIndex={15}
          backgroundColor={values.backgroundColor}
          member={fixtureMember}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}
