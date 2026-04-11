import { defineType, defineField } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export default defineType({
  title: 'Form Block',
  name: 'formBlock',
  icon: CalendarIcon,
  type: 'object',
  fields: [
    defineField({
      title: 'Active',
      name: 'active',
      type: 'boolean',
      description:
        'Set to false if you need to remove from page but not delete',
      initialValue: true,
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'The anchor for the section. No hash symbols. Optional.',
      validation: (Rule) =>
        Rule.regex(/^[a-z0-9-]+$/).warning(
          'Use only lowercase letters, numbers, and hyphens'
        ),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Contact Form',
      readOnly: true,
    }),
    defineField({
      name: 'content',
      type: 'simpleText',
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active' },
    prepare({ title, active }) {
      return {
        title: title || 'Form',
        subtitle: active ? 'Active' : 'Inactive',
      }
    },
  },
})
