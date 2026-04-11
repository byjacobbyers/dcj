import { defineType, defineField } from 'sanity'

export default defineType({
  title: 'SEO / Share Settings',
  name: 'seo',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      title: 'No Index?',
      name: 'noIndex',
      type: 'boolean',
    }),
    defineField({
      title: 'Meta Title',
      name: 'metaTitle',
      type: 'string',
      validation: (Rule) => Rule.max(50).warning('May be truncated'),
    }),
    defineField({
      title: 'Meta Description',
      name: 'metaDesc',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(150).warning('May be truncated'),
    }),
    defineField({
      title: 'Share Graphic',
      name: 'shareGraphic',
      type: 'image',
    }),
  ],
})
