import { defineType, defineField } from 'sanity'
import { ErrorOutlineIcon } from '@sanity/icons'

export default defineType({
  title: 'FAQ Block',
  name: 'faqBlock',
  type: 'object',
  icon: ErrorOutlineIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    defineField({
      title: 'FAQs',
      name: 'faqs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ title: 'Question', name: 'question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ title: 'Answer', name: 'answer', type: 'simpleText', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'question' },
            prepare({ title }) {
              return { title: title || 'Untitled' }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { active: 'active' },
    prepare({ active }) {
      return { title: 'FAQ Block', subtitle: active ? 'Active' : 'Inactive' }
    },
  },
})
