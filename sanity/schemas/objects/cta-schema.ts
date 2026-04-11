import { defineType, defineField } from 'sanity'
import { ShareIcon } from '@sanity/icons'

export default defineType({
  title: 'Call To Action',
  type: 'object',
  name: 'cta',
  icon: ShareIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      title: 'Route',
      name: 'route',
      type: 'route',
    }),
  ],
  preview: {
    select: { active: 'active', title: 'route.title' },
    prepare({ active, title }) {
      return { title: `CTA - ${title || 'Untitled'}`, subtitle: active ? 'Active' : 'Inactive' }
    },
  },
})
