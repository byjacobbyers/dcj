import { defineField, defineType } from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      title: 'Source Path',
      name: 'source',
      type: 'string',
      description: 'The old path to redirect from, e.g. /old-page',
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value?.startsWith('/') && !value.startsWith('//')
            ? true
            : 'Must be a path starting with a single / (e.g. /old-page)'
        ),
    }),
    defineField({
      title: 'Destination',
      name: 'destination',
      type: 'string',
      description: 'Where to send visitors: a path (/new-page) or a full URL',
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value?.startsWith('/') || value?.startsWith('https://') || value?.startsWith('http://')
            ? true
            : 'Must start with / or http(s)://'
        ),
    }),
    defineField({
      title: 'Permanent (308)?',
      name: 'permanent',
      type: 'boolean',
      description: 'On for moved-for-good content (SEO transfers ranking); off for temporary moves (307)',
      initialValue: true,
    }),
  ],
  preview: {
    select: { source: 'source', destination: 'destination', permanent: 'permanent' },
    prepare({ source, destination, permanent }) {
      return {
        title: `${source} → ${destination}`,
        subtitle: permanent ? 'Permanent (308)' : 'Temporary (307)',
      }
    },
  },
})
