import { defineType, defineField } from 'sanity'
import { InlineElementIcon } from '@sanity/icons'
import ImagesPerRowInput from '../inputs/images-per-row-input'
import { sectionPaddingField } from '../fields/section-padding-field'
import { sectionBackgroundColorField } from '../fields/section-background-color-field'

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
    sectionPaddingField({ initialValue: 'default' }),
    sectionBackgroundColorField(),
    defineField({
      title: 'Alignment',
      name: 'alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'text-left' },
          { title: 'Center', value: 'text-center' },
          { title: 'Right', value: 'text-right' },
        ],
      },
      initialValue: 'text-center',
    }),
    defineField({
      title: 'Header',
      name: 'header',
      type: 'simpleText',
      description: 'Optional intro above the column cards',
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
    defineField({
      title: 'Footer',
      name: 'footer',
      type: 'simpleText',
      description: 'Optional copy below the column cards',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
      description: 'Optional button below the footer',
    }),
  ],
  preview: {
    select: {
      header: 'header',
      active: 'active',
      columns: 'columns',
      columnsPerRow: 'columnsPerRow',
    },
    prepare({ header, active, columns, columnsPerRow }) {
      const columnCount = columns?.length || 0
      const perRow = columnsPerRow ?? 3
      const headerHint =
        Array.isArray(header) && header[0]?.children?.[0]?.text
          ? String(header[0].children[0].text).slice(0, 40)
          : 'No header'
      return {
        title: 'Column Block',
        subtitle: `${active ? 'Active' : 'Not Active'} - ${columnCount} column${columnCount !== 1 ? 's' : ''} - ${perRow} per row - ${headerHint}`,
      }
    },
  },
})

export default columnBlock
