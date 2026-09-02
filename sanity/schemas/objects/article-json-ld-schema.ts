import { defineField, defineType } from 'sanity'

/** Optional Article JSON-LD overrides (type stays Article; FAQ stays auto). */
export default defineType({
  name: 'articleJsonLd',
  title: 'Article JSON-LD',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline Override',
      type: 'string',
      description: 'Defaults to the post title.',
    }),
    defineField({
      name: 'description',
      title: 'Description Override',
      type: 'text',
      rows: 3,
      description: 'Defaults to SEO meta description, then excerpt.',
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name Override',
      type: 'string',
      description: 'Defaults to the post Author field.',
    }),
    defineField({
      name: 'articleSection',
      title: 'Article Section',
      type: 'string',
      description: 'Defaults to the post Category (e.g. “Guides”).',
    }),
  ],
})
