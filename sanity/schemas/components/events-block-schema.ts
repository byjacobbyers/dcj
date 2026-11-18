import { defineType, defineField } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'
import { sectionPaddingField } from '../fields/section-padding-field'
import { sectionBackgroundColorField } from '../fields/section-background-color-field'

export default defineType({
  title: 'Events Block',
  name: 'eventsBlock',
  type: 'object',
  icon: CalendarIcon,
  description: 'Upcoming events, soonest first, with a link to past events.',
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    sectionPaddingField({ initialValue: 'default' }),
    sectionBackgroundColorField(),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Optional heading, e.g. "Upcoming events"',
    }),
    defineField({
      title: 'Initial events shown',
      name: 'count',
      type: 'number',
      description: 'How many events to show before "Load more".',
      validation: (Rule) => Rule.min(1).max(24),
      initialValue: 3,
    }),
    defineField({
      title: 'Hide when nothing is coming up',
      name: 'hideWhenEmpty',
      type: 'boolean',
      description:
        'On for the home page, so the section disappears between events. Off for the events page, which says nothing is scheduled.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active', count: 'count' },
    prepare({ title, active, count }) {
      return {
        title: 'Events Block',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · show ${count ?? 3} · ${title || 'No title'}`,
      }
    },
  },
})
