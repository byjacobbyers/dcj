import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({ type: 'string', name: 'title', hidden: true }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: false,
      description: 'Show the announcement on the site',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      description: 'Announcement text (e.g. banner message)',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
      initialValue: () => {
        const date = new Date()
        date.setDate(date.getDate() + 7)
        return date.toISOString().split('T')[0]
      },
    }),
    defineField({
      name: 'route',
      title: 'Link',
      type: 'route',
      description: 'Optional link when the announcement is clicked',
    }),
  ],
  preview: {
    select: { message: 'message', active: 'active', startDate: 'startDate', endDate: 'endDate' },
    prepare({ message, active, startDate, endDate }) {
      const start = startDate ? new Date(startDate).toLocaleDateString() : 'No start date'
      const end = endDate ? new Date(endDate).toLocaleDateString() : 'No end date'
      return {
        title: message || 'Announcement',
        subtitle: `${start} - ${end}${active ? ' (Active)' : ''}`,
      }
    },
  },
})
