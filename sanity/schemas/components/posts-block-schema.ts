import { defineType, defineField } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { sectionPaddingField } from '../fields/section-padding-field'
import { sectionBackgroundColorField } from '../fields/section-background-color-field'

export default defineType({
  title: 'Posts Block',
  name: 'postsBlock',
  type: 'object',
  icon: DocumentTextIcon,
  description: 'Blog listing with “Load more” pagination.',
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    sectionPaddingField({ initialValue: 'default' }),
    sectionBackgroundColorField(),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Optional heading for the posts section',
    }),
    defineField({
      title: 'Initial posts shown',
      name: 'count',
      type: 'number',
      description:
        'How many posts to show before “Load more”. Remaining posts are revealed on click (all posts are still server-rendered for SEO).',
      validation: (Rule) => Rule.min(1).max(24),
      initialValue: 6,
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active', count: 'count' },
    prepare({ title, active, count }) {
      return {
        title: 'Posts Block',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · show ${count ?? 6} then load more · ${title || 'No title'}`,
      }
    },
  },
})
