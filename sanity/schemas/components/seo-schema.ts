import { defineType, defineField } from 'sanity'
import SeoInput from '../inputs/seo-input'

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
      title: 'Share Graphic',
      name: 'shareGraphic',
      type: 'defaultImage',
      description:
        'Share graphics are cropped to 1200×630 and override the default share graphic from Site Settings.',
    }),
  ],
})
