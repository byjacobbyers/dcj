import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons'

export default defineType({
  title: 'Divider Block',
  name: 'dividerBlock',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ title: 'Active?', name: 'active', type: 'boolean', initialValue: true }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    defineField({
      title: 'Padding',
      name: 'size',
      type: 'string',
      initialValue: 'zero',
      options: {
        list: [
          { title: 'Zero', value: 'zero' },
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
      },
    }),
  ],
  preview: {
    select: { size: 'size', active: 'active' },
    prepare({ size, active }) {
      return { title: 'Divider', subtitle: `${active ? 'Active' : 'Inactive'} - ${size}` }
    },
  },
})
