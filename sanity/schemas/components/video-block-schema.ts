import { defineType, defineField } from 'sanity'
import { VideoIcon } from '@sanity/icons'

const maxWidthOptions = [
  { title: 'Small (24rem)', value: 'max-w-sm' },
  { title: 'Medium (28rem)', value: 'max-w-md' },
  { title: 'Large (32rem)', value: 'max-w-lg' },
  { title: 'XL (36rem)', value: 'max-w-xl' },
  { title: '2XL (42rem)', value: 'max-w-2xl' },
  { title: '3XL (48rem)', value: 'max-w-3xl' },
  { title: '4XL (56rem)', value: 'max-w-4xl' },
  { title: '5XL (64rem)', value: 'max-w-5xl' },
  { title: '6XL (72rem)', value: 'max-w-6xl' },
  { title: '7XL (80rem)', value: 'max-w-7xl' },
  { title: 'Full width', value: 'max-w-full' },
]

export default defineType({
  title: 'Video Block',
  name: 'videoBlock',
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
      title: 'Max Width',
      name: 'maxWidth',
      type: 'string',
      initialValue: 'max-w-2xl',
      options: {
        list: maxWidthOptions,
        layout: 'dropdown',
      },
    }),
    defineField({
      title: 'Autoplay',
      name: 'autoplay',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      title: 'Loop',
      name: 'loop',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      title: 'Muted',
      name: 'muted',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      title: 'Show Controls',
      name: 'controls',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      active: 'active',
      videoProvider: 'videoProvider',
      muxUrl: 'muxUrl.asset.playbackId',
      vimeoUrl: 'vimeoUrl',
    },
    prepare({ active, videoProvider, muxUrl, vimeoUrl }) {
      const provider = videoProvider || 'mux'
      let label = 'No video'
      if (provider === 'mux' && muxUrl) label = `Mux: ${muxUrl}`
      else if (provider === 'vimeo' && vimeoUrl) {
        const match = vimeoUrl.match(/vimeo\.com\/(\d+)/)
        label = match ? `Vimeo: ${match[1]}` : 'Invalid URL'
      }
      return {
        title: 'Video Block',
        subtitle: `${active ? 'Active' : 'Inactive'} - ${label}`,
        media: VideoIcon,
      }
    },
  },
})
