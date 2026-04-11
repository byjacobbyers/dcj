import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons'

export default defineType({
  title: 'Problem Block',
  name: 'problemBlock',
  type: 'object',
  icon: BlockElementIcon,
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
      title: 'Content',
      name: 'content',
      type: 'simpleText',
      description: 'Intro text above the columns',
    }),
    defineField({
      title: 'Columns',
      name: 'columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              title: 'Image',
              name: 'image',
              type: 'defaultImage',
              description: 'Optional. 48×48px on the site. If set, shown instead of the icon.',
            }),
            defineField({
              title: 'Icon',
              name: 'icon',
              type: 'string',
              description: 'Optional react-icons/lu. Used when no image is set.',
              options: {
                list: [
                  { title: 'Clock', value: 'LuClock' },
                  { title: 'Code', value: 'LuCode' },
                  { title: 'Layers', value: 'LuLayers' },
                ],
                layout: 'dropdown',
              },
            }),
            defineField({
              title: 'Content',
              name: 'content',
              type: 'simpleText',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { image: 'image', content: 'content', icon: 'icon' },
            prepare(selection: {
              image?: { alt?: string }
              content?: Array<{ children?: Array<{ text?: string }> }>
              icon?: string
            }) {
              const { image, content, icon } = selection
              const textPreview = content?.[0]?.children?.[0]?.text || ''
              const iconLabel = icon ? `Icon: ${icon}` : ''
              return {
                title: image?.alt || iconLabel || textPreview || 'Column',
                subtitle: textPreview,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(3),
    }),
    defineField({
      title: 'Excerpt',
      name: 'excerpt',
      type: 'simpleText',
      description: 'Text below the columns',
    }),
  ],
  preview: {
    select: { active: 'active', columns: 'columns' },
    prepare({ active, columns }: { active?: boolean; columns?: unknown[] }) {
      const count = columns?.length ?? 0
      return {
        title: 'Problem Block',
        subtitle: `${active ? 'Active' : 'Inactive'} — ${count} column${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
