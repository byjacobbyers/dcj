import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { title: 'Post Details', name: 'post', default: true },
    { title: 'SEO & Settings', name: 'seo' },
  ],
  fields: [
    defineField({
      title: 'Post Image',
      name: 'image',
      type: 'defaultImage',
      group: 'post',
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      group: 'post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      group: 'post',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Publish Date',
      name: 'publishedAt',
      type: 'date',
      group: 'post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Author',
      name: 'author',
      type: 'reference',
      to: [{ type: 'team' }],
      group: 'post',
      description: 'Team member credited as the article author (Person JSON-LD).',
    }),
    defineField({
      title: 'Category',
      name: 'category',
      type: 'reference',
      to: [{ type: 'postCategory' }],
      group: 'post',
      description: 'Create categories under Posts → Categories in the Studio sidebar.',
    }),
    defineField({
      title: 'Excerpt',
      name: 'excerpt',
      type: 'text',
      rows: 3,
      group: 'post',
      description: 'Short summary shown in post collections and share previews.',
    }),
    defineField({
      name: 'body',
      type: 'normalText',
      group: 'post',
      title: 'Body',
      description:
        'The article itself. Long-form writing, not page-builder sections: headings, paragraphs, lists, links, and inline images.',
    }),
    defineField({
      name: 'cta',
      type: 'ctaBlock',
      group: 'post',
      title: 'Closing CTA section',
      description:
        'Full CTA section shown at the end of the article: heading, copy and button. Leave inactive to omit.',
    }),
    defineField({
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo',
      group: 'seo',
      options: { collapsible: true, collapsed: false },
    }),
    defineField({
      name: 'jsonLd',
      title: 'Article JSON-LD',
      type: 'articleJsonLd',
      group: 'seo',
      description:
        'Optional overrides for structured data. The base schema and FAQ blocks stay automatic.',
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      media: 'image',
    },
    prepare({ title, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt + 'T12:00:00').toLocaleDateString()
        : 'No date'
      return {
        title: title || 'Untitled post',
        subtitle: date,
        media,
      }
    },
  },
})
