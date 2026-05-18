import { defineField, defineType } from 'sanity'
import { ThLargeIcon } from '@sanity/icons'

export default defineType({
  name: 'buttonPair',
  title: 'Button pair',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      title: 'Left button',
      name: 'left',
      type: 'route',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Right button',
      name: 'right',
      type: 'route',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      leftTitle: 'left.title',
      rightTitle: 'right.title',
    },
    prepare({ leftTitle, rightTitle }) {
      return {
        title: 'Button pair',
        subtitle: [leftTitle, rightTitle].filter(Boolean).join(' · ') || 'Configure both routes',
      }
    },
  },
})
