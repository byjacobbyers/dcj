import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'
import ContentPositionInput from '../inputs/content-position-input'

export default defineType({
  title: 'Cover Block',
  name: 'coverBlock',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'Section anchor for deep linking (no hash)',
    }),
    defineField({
      title: 'Background Type',
      name: 'backgroundType',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Color', value: 'color' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'image',
    }),
    defineField({
      title: 'Background Image',
      name: 'image',
      type: 'defaultImage',
      hidden: ({ parent }) => parent?.backgroundType === 'color',
    }),
    defineField({
      title: 'Background Image (Mobile)',
      name: 'imageMobile',
      type: 'defaultImage',
      description: 'Optional. Falls back to desktop image if empty.',
      hidden: ({ parent }) => parent?.backgroundType === 'color',
    }),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      options: {
        list: [
          { title: 'Black', value: 'black' },
          { title: 'White', value: 'white' },
          { title: 'Primary', value: 'primary' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'black',
      hidden: ({ parent }) => parent?.backgroundType === 'image',
    }),
    defineField({
      title: 'Height',
      name: 'height',
      type: 'string',
      options: {
        list: [
          { title: 'Auto', value: 'auto' },
          { title: 'Full Viewport', value: 'full' },
          { title: 'Half Viewport', value: 'half' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'half',
    }),
    defineField({
      title: 'Overlay Color',
      name: 'overlayColor',
      type: 'string',
      description: 'Color overlay on the background image',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Black', value: 'black' },
          { title: 'White', value: 'white' },
          { title: 'Primary', value: 'primary' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'none',
      hidden: ({ parent }) => parent?.backgroundType === 'color',
    }),
    defineField({
      title: 'Overlay Opacity',
      name: 'overlayOpacity',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 50,
      hidden: ({ parent }) =>
        parent?.backgroundType === 'color' || parent?.overlayColor === 'none',
    }),
    defineField({
      title: 'Content Position',
      name: 'contentPosition',
      type: 'string',
      description: 'Click a position in the grid to place your content',
      components: {
        input: ContentPositionInput,
      },
      initialValue: 'center',
    }),
    defineField({
      title: 'Content Half Width (Desktop)',
      name: 'contentHalfWidth',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'simpleText',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
    }),
  ],
  preview: {
    select: { active: 'active', height: 'height', backgroundType: 'backgroundType' },
    prepare({ active, height, backgroundType }) {
      const h = height === 'full' ? 'Full' : height === 'half' ? 'Half' : 'Auto'
      return {
        title: 'Cover Block',
        subtitle: `${active ? 'Active' : 'Inactive'} - ${backgroundType || 'image'} - ${h}`,
      }
    },
  },
})
