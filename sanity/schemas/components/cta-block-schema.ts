import { defineType, defineField } from 'sanity'
import { PresentationIcon } from '@sanity/icons'
import { sectionPaddingField } from '../fields/section-padding-field'
import { sectionBackgroundColorField } from '../fields/section-background-color-field'
import { sectionContentLayoutField } from '../fields/section-content-layout-field'

export default defineType({
  title: 'CTA Block',
  name: 'ctaBlock',
  type: 'object',
  icon: PresentationIcon,
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
    sectionBackgroundColorField({
      description:
        'Section surface. Transparent shows the page behind this block. Primary and Secondary use the site palette. The CTA button style adjusts for contrast on primary and secondary surfaces.',
    }),
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
      name: 'content',
      title: 'Content',
      type: 'simpleText',
      description: 'Text displayed above the button',
    }),
    defineField({ title: 'CTA', name: 'cta', type: 'cta' }),
  ],
  preview: {
    select: { active: 'active' },
    prepare({ active }) {
      return { title: 'CTA', subtitle: active ? 'Active' : 'Inactive' }
    },
  },
})
