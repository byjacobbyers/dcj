import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons'

export default defineType({
  title: 'Spacer Block',
  name: 'spacerBlock',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ title: 'Active?', name: 'active', type: 'boolean', initialValue: true }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    defineField({
      title: 'Size',
      name: 'size',
      type: 'string',
      initialValue: 'medium',
      options: {
        list: [
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
      return { title: 'Spacer', subtitle: `${active ? 'Active' : 'Inactive'} - ${size}` }
    },
  },
})
