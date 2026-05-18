import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import ComponentsIndexNoticeInput from '../inputs/components-index-notice-input'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { title: 'Page content', name: 'page', default: true },
    { title: 'SEO & Settings', name: 'seo' },
  ],
  fields: [
    defineField({
      name: 'componentsIndexNotice',
      title: 'Components reference',
      type: 'string',
      group: 'page',
      hidden: ({ document }) =>
        (document?.slug as { current?: string } | undefined)?.current !== 'components',
      components: {
        input: ComponentsIndexNoticeInput,
      },
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      group: 'page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      group: 'page',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      group: 'page',
      description:
        'Primary and Secondary use solid theme surfaces. Silk adds an animated fabric-style backdrop behind page sections.',
      options: {
        list: [
          { title: 'Silk', value: 'silk' },
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'sections',
      type: 'sections',
      group: 'page',
      title: 'Page sections',
      description: 'Add, edit, and reorder sections',
    }),
    defineField({
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo',
      group: 'seo',
      options: { collapsible: true, collapsed: false },
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title, subtitle: slug === 'home' ? 'Home Page' : `/${slug}` }
    },
  },
})
