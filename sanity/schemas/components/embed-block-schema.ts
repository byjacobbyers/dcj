import { defineType, defineField } from 'sanity'
import { CodeIcon } from '@sanity/icons'

const maxWidthOptions = [
  { title: 'Small (24rem)', value: 'max-w-sm' },
  { title: 'Medium (28rem)', value: 'max-w-md' },
  { title: 'Large (32rem)', value: 'max-w-lg' },
  { title: 'XL (36rem)', value: 'max-w-xl' },
  { title: '2XL (42rem)', value: 'max-w-2xl' },
  { title: '3XL (48rem)', value: 'max-w-3xl' },
  { title: '4XL (56rem)', value: 'max-w-4xl' },
  { title: '5XL (64rem)', value: 'max-w-5xl' },
  { title: '6XL (72rem)', value: 'max-w-6xl' },
  { title: '7XL (80rem)', value: 'max-w-7xl' },
  { title: 'Full width', value: 'max-w-full' },
]

export default defineType({
  title: 'Embed Block',
  name: 'embedBlock',
  type: 'object',
  icon: CodeIcon,
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
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Optional heading displayed above the embed',
    }),
    defineField({
      title: 'Embed Code',
      name: 'embedCode',
      type: 'code',
      description: 'Paste embed code (e.g. Google Calendar iframe HTML)',
      options: {
        language: 'html',
        languageAlternatives: [
          { title: 'HTML', value: 'html' },
        ],
      },
    }),
    defineField({
      title: 'Max Width',
      name: 'maxWidth',
      type: 'string',
      initialValue: 'max-w-2xl',
      options: {
        list: maxWidthOptions,
        layout: 'dropdown',
      },
    }),
  ],
  preview: {
    select: { active: 'active' },
    prepare({ active }) {
      return {
        title: 'Embed',
        subtitle: active ? 'Active' : 'Inactive',
      }
    },
  },
})
