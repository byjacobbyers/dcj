import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons/Link'

/**
 * A destination inside a Sub Navigation dropdown. Carries the extra context a
 * bare route cannot: a scannable one-liner.
 */
export default defineType({
  name: 'navLink',
  title: 'Nav Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'route',
      title: 'Destination',
      type: 'route',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'string',
      description:
        'One line, read at a glance in the menu. Aim for under 60 characters.',
      validation: (Rule) =>
        Rule.max(80).warning('Over 80 characters will wrap awkwardly in the dropdown.'),
    }),
  ],
  preview: {
    select: { title: 'route.title', subtitle: 'description' },
    prepare({ title, subtitle }) {
      return { title: title || 'Nav link', subtitle }
    },
  },
})
