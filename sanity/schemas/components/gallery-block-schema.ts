import { defineType, defineField } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import ImagesPerRowInput from '../inputs/images-per-row-input'

const galleryBlock = defineType({
  title: 'Gallery Block',
  name: 'galleryBlock',
  type: 'object',
  icon: ImagesIcon,
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
      title: 'Images',
      name: 'images',
      type: 'array',
      of: [{ type: 'defaultImage' }],
      description: 'Add images to the gallery',
      validation: (Rule) => Rule.min(1).required().error('At least one image is required'),
    }),
    defineField({
      title: 'Images Per Row',
      name: 'imagesPerRow',
      type: 'number',
      description: 'Number of images to display per row (2-4)',
      components: {
        input: ImagesPerRowInput,
      },
      validation: (Rule) => Rule.min(2).max(4),
      initialValue: 3,
    }),
    defineField({
      title: 'Enable Lightbox',
      name: 'enableLightbox',
      type: 'boolean',
      description: 'Allow users to click images to view full size',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      active: 'active',
      imagesPerRow: 'imagesPerRow',
      media: 'images.0',
    },
    prepare({ active, imagesPerRow, media }) {
      const perRow = imagesPerRow ?? 3
      return {
        title: 'Gallery Block',
        subtitle: `${active ? 'Active' : 'Not Active'} - ${perRow} per row`,
        media: media || ImagesIcon,
      }
    },
  },
})

export default galleryBlock
