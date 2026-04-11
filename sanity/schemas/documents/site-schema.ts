import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'site',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'seoDefaults', title: 'SEO Defaults' },
    { name: 'socialLinks', title: 'Social Links' },
    { name: 'jsonLd', title: 'JSON-LD' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Site Title', type: 'string', group: 'general' }),
    defineField({ name: 'altTitle', title: 'Alternative Title', type: 'string', group: 'general' }),
    defineField({ name: 'foundingYear', title: 'Founding Year', type: 'string', group: 'general' }),
    defineField({ name: 'address', title: 'Street Address', type: 'string', group: 'general' }),
    defineField({
      name: 'addressLocality',
      title: 'Address Locality',
      type: 'string',
      description: 'Example: New York',
      group: 'general',
    }),
    defineField({
      name: 'addressRegion',
      title: 'Address Region',
      type: 'string',
      description: 'Example: NY',
      group: 'general',
    }),
    defineField({ name: 'postalCode', title: 'Postal Code', type: 'string', group: 'general' }),
    defineField({ name: 'addressCountry', title: 'Address Country', type: 'string', group: 'general' }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      group: 'general',
      validation: (Rule) => Rule.min(-90).max(90),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      group: 'general',
      validation: (Rule) => Rule.min(-180).max(180),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
      description: 'Primary site contact email',
      group: 'general',
    }),
    defineField({
      title: 'Default Site SEO / Share Settings',
      name: 'seo',
      type: 'seo',
      group: 'seoDefaults',
    }),
    defineField({
      name: 'sameAs',
      title: 'Same As URLs',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Additional URLs (e.g., social profiles, Wikipedia)',
      group: 'socialLinks',
    }),
    defineField({
      name: 'organizationJsonLd',
      title: 'Organization JSON-LD',
      type: 'object',
      group: 'jsonLd',
      description: 'Structured data for your organization',
      fields: [
        { title: 'Organization Name', name: 'name', type: 'string' },
        { title: 'Legal Name', name: 'legalName', type: 'string' },
        { title: 'Description', name: 'description', type: 'text', rows: 3 },
        { title: 'Logo', name: 'logo', type: 'defaultImage' },
        { title: 'URL', name: 'url', type: 'url', description: 'Main website URL' },
        { title: 'Email', name: 'email', type: 'email' },
        { title: 'Telephone', name: 'telephone', type: 'string' },
        { title: 'Price Range', name: 'priceRange', type: 'string', description: 'e.g., $$, $$$' },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Site Settings' }
    },
  },
})
