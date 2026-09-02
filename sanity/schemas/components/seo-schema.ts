import { defineType, defineField } from 'sanity'
import SeoInput from '../inputs/seo-input'
import AutoShareImageInput from '../inputs/auto-share-image-input'

export default defineType({
  title: 'SEO / Share Settings',
  name: 'seo',
  type: 'object',
  description:
    'Customize SEO and share settings. Leave fields empty to use document title and description as defaults on the frontend where applicable.',
  components: {
    input: SeoInput,
  },
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      title: 'No Index?',
      name: 'noIndex',
      type: 'boolean',
      hidden: ({ document }) => document?._type !== 'page',
    }),
    defineField({
      title: 'Meta Title',
      name: 'metaTitle',
      type: 'string',
      description:
        'Will default to the document title if left empty. Override here for a custom SEO title.',
      validation: (Rule) =>
        Rule.max(60).warning('Longer titles may be truncated by search engines'),
    }),
    defineField({
      title: 'Meta Description',
      name: 'metaDesc',
      type: 'text',
      rows: 3,
      description:
        'Will default to the document description if left empty. Override here for a custom SEO description.',
      validation: (Rule) =>
        Rule.max(160).warning('Longer descriptions may be truncated by search engines'),
    }),
    defineField({
      title: 'Auto share image (Facebook, Slack, etc.)',
      name: 'autoShareImage',
      type: 'object',
      description:
        'Default 1200×630 share image is generated from this heading and background, plus the site name. Upload a Share Graphic below to override it entirely.',
      options: { collapsible: true, collapsed: false },
      components: { input: AutoShareImageInput },
      fields: [
        defineField({
          title: 'Heading',
          name: 'heading',
          type: 'simpleText',
          description:
            'Large headline on the generated image. Leave empty to use the document title.',
        }),
        defineField({
          title: 'Background',
          name: 'background',
          type: 'string',
          description: 'Surface for the generated image, from the site palette.',
          initialValue: 'wave',
          options: {
            list: [
              { title: 'Wave (dark satin, default)', value: 'wave' },
              { title: 'Primary (dark)', value: 'primary' },
              { title: 'Secondary (light)', value: 'secondary' },
            ],
            layout: 'radio',
          },
        }),
      ],
    }),
    defineField({
      title: 'Share Graphic',
      name: 'shareGraphic',
      type: 'defaultImage',
      description:
        'Share graphics are cropped to 1200×630 and override the default share graphic from Site Settings.',
    }),
  ],
})
