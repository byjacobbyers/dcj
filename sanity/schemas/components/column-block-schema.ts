import { defineType, defineField } from 'sanity'
import { InlineElementIcon } from '@sanity/icons'
import ImagesPerRowInput from '../inputs/images-per-row-input'

const columnBlock = defineType({
  title: 'Column Block',
  name: 'columnBlock',
  type: 'object',
  icon: InlineElementIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      description: 'Set to false if you need to remove from page but not delete',
      initialValue: true,
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'The anchor for the section. No hash symbols. Optional.',
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Optional title for the column section',
    }),
    defineField({
      title: 'Columns',
      name: 'columns',
      type: 'array',
      of: [{ type: 'column' }],
      description: 'Add individual columns with their own content',
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      title: 'Columns Per Row',
      name: 'columnsPerRow',
      type: 'number',
      description: 'Number of columns to display per row (2-4)',
      components: {
        input: ImagesPerRowInput,
      },
      validation: (Rule) => Rule.min(2).max(4),
      initialValue: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
      columns: 'columns',
      columnsPerRow: 'columnsPerRow',
    },
    prepare({ title, active, columns, columnsPerRow }) {
      const columnCount = columns?.length || 0
      const perRow = columnsPerRow ?? 3
      return {
        title: 'Column Block',
        subtitle: `${active ? 'Active' : 'Not Active'} - ${columnCount} column${columnCount !== 1 ? 's' : ''} - ${perRow} per row - ${title || 'No Title'}`,
      }
    },
  },
})

export default columnBlock
