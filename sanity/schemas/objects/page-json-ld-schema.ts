import { defineField, defineType } from 'sanity'

/** Optional structured data overrides for CMS pages (base type + FAQ stay auto). */
export default defineType({
  name: 'pageJsonLd',
  title: 'Page JSON-LD',
  type: 'object',
  fields: [
    defineField({
      name: 'pageType',
      title: 'Primary Schema Type',
      type: 'string',
      description:
        'Schema.org type for this page. FAQPage is still added automatically when FAQ blocks exist.',
      options: {
        list: [
          { title: 'Web Page (default)', value: 'WebPage' },
          { title: 'About Page', value: 'AboutPage' },
          { title: 'Contact Page', value: 'ContactPage' },
          { title: 'Collection Page', value: 'CollectionPage' },
          { title: 'FAQ Page (primary)', value: 'FAQPage' },
          { title: 'Service', value: 'Service' },
        ],
      },
      initialValue: 'WebPage',
    }),
    defineField({
      name: 'name',
      title: 'Name Override',
      type: 'string',
      description: 'Defaults to the page title.',
    }),
    defineField({
      name: 'description',
      title: 'Description Override',
      type: 'text',
      rows: 3,
      description: 'Defaults to the SEO meta description.',
    }),
  ],
})
