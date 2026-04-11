import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export default defineType({
  name: 'linkWithRoute',
  title: 'Link',
  icon: LinkIcon,
  type: 'object',
  options: {
    collapsible: true,
    modal: { type: 'popover' },
  },
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'attributes', title: 'Attributes' },
    { name: 'analytics', title: 'Analytics' },
    { name: 'advanced', title: 'Advanced' },
  ],
  fields: [
    defineField({
      title: 'Link Type',
      name: 'linkType',
      type: 'string',
      group: 'general',
      options: {
        list: [
          { title: 'Page', value: 'page' },
          { title: 'Event', value: 'event' },
          { title: 'Path', value: 'path' },
          { title: 'Anchor', value: 'anchor' },
          { title: 'File Download', value: 'file' },
          { title: 'External URL', value: 'external' },
          { title: 'Email', value: 'email' },
          { title: 'Telephone', value: 'telephone' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Page',
      name: 'pageRoute',
      type: 'reference',
      group: 'general',
      to: [{ type: 'page' }],
      description: 'Select a page',
      hidden: ({ parent }) => parent?.linkType !== 'page',
    }),
    defineField({
      title: 'Event',
      name: 'eventRoute',
      type: 'reference',
      group: 'general',
      to: [{ type: 'event' }],
      description: 'Select an event',
      hidden: ({ parent }) => parent?.linkType !== 'event',
    }),
    defineField({
      title: 'File',
      name: 'fileRoute',
      type: 'file',
      group: 'general',
      description: 'Select a file for download',
      hidden: ({ parent }) => parent?.linkType !== 'file',
    }),
    defineField({
      title: 'Path',
      name: 'route',
      type: 'string',
      group: 'general',
      description: 'Example: blog or blog/#section',
      hidden: ({ parent }) => parent?.linkType !== 'path',
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'For same page only. Example: content (hash symbol not needed)',
      hidden: ({ parent }) => parent?.linkType !== 'anchor',
      group: 'general',
    }),
    defineField({
      title: 'External URL',
      name: 'link',
      type: 'url',
      group: 'general',
      description: 'Example: https://www.sanity.io',
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
    defineField({
      title: 'Email',
      name: 'email',
      type: 'email',
      description: 'Example: hello@example.com',
      hidden: ({ parent }) => parent?.linkType !== 'email',
      group: 'general',
    }),
    defineField({
      title: 'Telephone',
      name: 'telephone',
      type: 'string',
      description: 'Example: +1-555-123-4567 or (555) 123-4567',
      hidden: ({ parent }) => parent?.linkType !== 'telephone',
      group: 'general',
    }),
    defineField({
      title: 'Open in new tab',
      name: 'blank',
      type: 'boolean',
      initialValue: false,
      group: 'general',
    }),
    defineField({
      title: 'UTM Parameters',
      name: 'utm',
      type: 'object',
      group: 'advanced',
      description: 'Add UTM parameters for campaign tracking',
      fields: [
        {
          title: 'Source',
          name: 'source',
          type: 'string',
          description: 'e.g., google, newsletter, facebook',
        },
        {
          title: 'Medium',
          name: 'medium',
          type: 'string',
          description: 'e.g., email, cpc, social, organic',
        },
        {
          title: 'Campaign',
          name: 'campaign',
          type: 'string',
          description: 'e.g., spring_sale, product_launch',
        },
        {
          title: 'Term',
          name: 'term',
          type: 'string',
          description: 'Optional: Paid search keywords',
        },
        {
          title: 'Content',
          name: 'content',
          type: 'string',
          description: 'Optional: For A/B testing or ad variations',
        },
      ],
    }),
    defineField({
      title: 'Event name',
      name: 'trackingId',
      type: 'string',
      group: 'analytics',
      description: 'Event name to send to GA4/GTM when this link is clicked',
    }),
    defineField({
      title: 'Aria Label',
      name: 'ariaLabel',
      type: 'string',
      group: 'advanced',
      description: 'Accessible label for screen readers',
    }),
    defineField({
      title: 'Rel Attributes',
      name: 'relAttributes',
      type: 'array',
      group: 'attributes',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'No Follow', value: 'nofollow' },
          { title: 'No Opener', value: 'noopener' },
          { title: 'No Referrer', value: 'noreferrer' },
          { title: 'Sponsored', value: 'sponsored' },
          { title: 'UGC (User Generated Content)', value: 'ugc' },
        ],
      },
      description: 'Additional rel attributes for the link',
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
    defineField({
      title: 'Title Attribute',
      name: 'titleAttr',
      type: 'string',
      group: 'attributes',
      description: 'Tooltip text shown on hover',
    }),
    defineField({
      title: 'Data Attributes',
      name: 'dataAttributes',
      type: 'array',
      group: 'attributes',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Key',
              name: 'key',
              type: 'string',
              description: 'Attribute name (without "data-" prefix)',
            },
            {
              title: 'Value',
              name: 'value',
              type: 'string',
              description: 'Attribute value',
            },
          ],
          preview: {
            select: {
              key: 'key',
              value: 'value',
            },
            prepare({ key, value }: { key?: string; value?: string }) {
              return {
                title: key ? `data-${key}` : 'New attribute',
                subtitle: value || 'No value',
              }
            },
          },
        },
      ],
      description: 'Custom data-* attributes for tracking or functionality',
    }),
  ],
  preview: {
    select: {
      linkType: 'linkType',
      pageRoute: 'pageRoute.slug.current',
      eventRoute: 'eventRoute.slug.current',
      fileRoute: 'fileRoute.asset.originalFilename',
      route: 'route',
      anchor: 'anchor',
      link: 'link',
      email: 'email',
      telephone: 'telephone',
    },
    prepare({ linkType, pageRoute, eventRoute, fileRoute, route, anchor, link, email, telephone }) {
      let subtitle = 'Not set'
      switch (linkType) {
        case 'page':
          subtitle = pageRoute ? `Page: /${pageRoute}` : 'Page (not set)'
          break
        case 'event':
          subtitle = eventRoute ? `Event: /events/${eventRoute}` : 'Event (not set)'
          break
        case 'file':
          subtitle = fileRoute ? `File: ${fileRoute}` : 'File (not set)'
          break
        case 'path':
          subtitle = route ? `Path: /${route}` : 'Path (not set)'
          break
        case 'anchor':
          subtitle = anchor ? `Anchor: #${anchor}` : 'Anchor (not set)'
          break
        case 'external':
          subtitle = link ? `External: ${link}` : 'External (not set)'
          break
        case 'email':
          subtitle = email ? `Email: ${email}` : 'Email (not set)'
          break
        case 'telephone':
          subtitle = telephone ? `Telephone: ${telephone}` : 'Telephone (not set)'
          break
      }
      return {
        title: 'Link',
        subtitle,
      }
    },
  },
})
