import { defineType, defineField } from 'sanity'
import { BlockContentIcon } from '@sanity/icons'
import { sectionPaddingField } from '../fields/section-padding-field'
import { sectionContentLayoutField } from '../fields/section-content-layout-field'

export default defineType({
  title: 'Text Block',
  type: 'object',
  icon: BlockContentIcon,
  name: 'textBlock',
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    sectionPaddingField({ initialValue: 'default' }),
    sectionContentLayoutField(),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      initialValue: 'transparent',
      options: {
        list: [
          { title: 'Transparent', value: 'transparent' },
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Texture', value: 'texture' },
        ],
      },
    }),
    defineField({
      title: 'Content Alignment',
      name: 'contentAlignment',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
    }),
    defineField({ title: 'Content', name: 'content', type: 'normalText' }),
  ],
  preview: {
    select: { active: 'active' },
    prepare({ active }) {
      return { title: 'Text', subtitle: active ? 'Active' : 'Inactive' }
    },
  },
})
