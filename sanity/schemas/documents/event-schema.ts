import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { title: 'Event Details', name: 'event', default: true },
    { title: 'SEO & Settings', name: 'seo' },
    { title: 'JSON-LD', name: 'jsonLd' },
  ],
  fields: [
    defineField({
      title: 'Event Image',
      name: 'image',
      type: 'defaultImage',
      group: 'event',
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      group: 'event',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      group: 'event',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Event Type',
      name: 'eventType',
      type: 'string',
      group: 'event',
      initialValue: 'series',
      options: {
        list: [
          { title: 'Series', value: 'series' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Jam / Practice', value: 'jam' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      title: 'Sold Out',
      name: 'soldOut',
      type: 'boolean',
      group: 'event',
      initialValue: false,
    }),
    defineField({ title: 'Location', name: 'location', type: 'string', group: 'event' }),
    defineField({
      title: 'Price',
      name: 'price',
      type: 'string',
      group: 'event',
      description:
        'Free text, e.g. "$35, free to Wiggelruhm members" or "By donation". Leave empty to show no price.',
    }),
    defineField({
      title: 'How to register',
      name: 'registration',
      type: 'string',
      group: 'event',
      description: 'Shown with the details, e.g. "Venmo @gwen-ritchie" or "Drop in, no registration".',
    }),
    defineField({
      title: 'Booking link',
      name: 'bookingUrl',
      type: 'url',
      group: 'event',
      description: 'Where the booking button sends people. Leave empty to hide the button.',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      title: 'Booking button label',
      name: 'bookingLabel',
      type: 'string',
      group: 'event',
      description: 'Defaults to "Reserve your spot".',
    }),
    defineField({
      title: 'Questions / contact',
      name: 'contact',
      type: 'string',
      group: 'event',
      description: 'An email address or short note for questions about this event.',
    }),
    defineField({
      title: 'Start Date',
      name: 'startDate',
      type: 'date',
      group: 'event',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ title: 'End Date', name: 'endDate', type: 'date', group: 'event' }),
    defineField({
      title: 'Day & Time',
      name: 'timeString',
      type: 'string',
      group: 'event',
      initialValue: '6:30pm - 8:30pm',
      description: 'For a series, include the day: "Wednesdays, 6–8pm".',
    }),
    defineField({
      name: 'sections',
      type: 'sections',
      group: 'event',
      title: 'Page sections',
    }),
    defineField({
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo',
      group: 'seo',
      options: { collapsible: true, collapsed: false },
    }),
    defineField({
      name: 'jsonLd',
      title: 'Event JSON-LD',
      type: 'eventJsonLd',
      group: 'jsonLd',
      description:
        'Optional overrides for structured data. The base schema and FAQ blocks stay automatic.',
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    select: { title: 'title', startDate: 'startDate' },
    prepare({ title, startDate }) {
      return {
        title,
        subtitle: startDate ? new Date(startDate + 'T12:00:00').toLocaleDateString() : 'No date',
      }
    },
  },
})
