import { defineType, defineField } from 'sanity'
import { VideoIcon } from '@sanity/icons'
import ContentPositionInput from '../inputs/content-position-input'

export default defineType({
  title: 'Cover Video',
  name: 'coverVideo',
  type: 'object',
  icon: VideoIcon,
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
    }),
    defineField({
      title: 'Video Provider',
      name: 'videoProvider',
      type: 'string',
      options: {
        list: [
          { title: 'Mux', value: 'mux' },
          { title: 'Vimeo', value: 'vimeo' },
        ],
        layout: 'radio',
      },
      initialValue: 'mux',
    }),
    defineField({
      title: 'Mux Video',
      name: 'muxUrl',
      type: 'mux.video',
      hidden: ({ parent }) => parent?.videoProvider !== 'mux',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const { parent } = context as { parent?: { videoProvider?: string } }
          if (parent?.videoProvider === 'mux' && !value) {
            return 'Mux video is required when Mux is selected'
          }
          return true
        }),
    }),
    defineField({
      title: 'Mux Video (Mobile)',
      name: 'muxUrlMobile',
      type: 'mux.video',
      description: 'Optional. Falls back to desktop if empty.',
      hidden: ({ parent }) => parent?.videoProvider !== 'mux',
    }),
    defineField({
      title: 'Vimeo URL',
      name: 'vimeoUrl',
      type: 'url',
      hidden: ({ parent }) => parent?.videoProvider !== 'vimeo',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const { parent } = context as { parent?: { videoProvider?: string } }
          if (parent?.videoProvider === 'vimeo') {
            if (!value) return 'Vimeo URL is required when Vimeo is selected'
            if (!value.includes('vimeo.com')) return 'Must be a valid Vimeo URL'
          }
          return true
        }),
    }),
    defineField({
      title: 'Vimeo URL (Mobile)',
      name: 'vimeoUrlMobile',
      type: 'url',
      hidden: ({ parent }) => parent?.videoProvider !== 'vimeo',
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
    }),
    defineField({
      title: 'Overlay Opacity',
      name: 'overlayOpacity',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 50,
      hidden: ({ parent }) => parent?.overlayColor === 'none',
    }),
    defineField({
      title: 'Content Position',
      name: 'contentPosition',
      type: 'string',
      components: { input: ContentPositionInput },
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
    defineField({
      title: 'Autoplay',
      name: 'autoplay',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Loop',
      name: 'loop',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Muted',
      name: 'muted',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Show Controls',
      name: 'controls',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      active: 'active',
      videoProvider: 'videoProvider',
      muxUrl: 'muxUrl.asset.playbackId',
      vimeoUrl: 'vimeoUrl',
      height: 'height',
    },
    prepare({ active, videoProvider, muxUrl, vimeoUrl, height }) {
      const h = height === 'full' ? 'Full' : height === 'half' ? 'Half' : 'Auto'
      const provider = videoProvider || 'mux'
      let label = 'No video'
      if (provider === 'mux' && muxUrl) label = `Mux: ${muxUrl}`
      else if (provider === 'vimeo' && vimeoUrl) {
        const match = vimeoUrl.match(/vimeo\.com\/(\d+)/)
        label = match ? `Vimeo: ${match[1]}` : 'Invalid URL'
      }
      return {
        title: 'Cover Video',
        subtitle: `${active ? 'Active' : 'Inactive'} - ${label} - ${h}`,
        media: VideoIcon,
      }
    },
  },
})
