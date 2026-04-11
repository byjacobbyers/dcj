import { defineType, defineField } from 'sanity'
import { InlineElementIcon } from '@sanity/icons'

export default defineType({
  title: 'Split Scroll Block',
  name: 'splitScrollBlock',
  type: 'object',
  icon: InlineElementIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'Section id for in-page links. No hash symbols.',
    }),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Texture', value: 'texture' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'simpleText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Items',
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              title: 'Image',
              name: 'image',
              type: 'defaultImage',
            }),
            defineField({
              title: 'Content',
              name: 'content',
              type: 'simpleText',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { image: 'image', content: 'content' },
            prepare(selection: { image?: { alt?: string }; content?: Array<{ children?: Array<{ text?: string }> }> }) {
              const { image, content } = selection
              return {
                title: image?.alt || 'Item',
                subtitle: content?.[0]?.children?.[0]?.text || '',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active', items: 'items' },
    prepare(selection: { title?: Array<{ children?: Array<{ text?: string }> }>; active?: boolean; items?: unknown[] }) {
      const { title, active, items } = selection
      const count = items?.length ?? 0
      const titlePreview = title?.[0]?.children?.[0]?.text || ''
      return {
        title: 'Split Scroll Block',
        subtitle: `${active ? 'Active' : 'Inactive'} — ${count} item${count !== 1 ? 's' : ''}${titlePreview ? ` — ${titlePreview}` : ''}`,
      }
    },
  },
})
