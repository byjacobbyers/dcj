import { defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export default defineField({
  title: 'Image',
  name: 'defaultImage',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true, metadata: ['lqip', 'palette'] },
  fields: [
    defineField({
      title: 'Alternative Text',
      name: 'alt',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'alt', media: 'asset' },
    prepare({ title, media }) {
      return { title: title || 'No alt text', media }
    },
  },
})
