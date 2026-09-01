import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons/Users'
import { sectionPaddingField } from '../fields/section-padding-field'
import { sectionBackgroundColorField } from '../fields/section-background-color-field'

/** Page builder block that references a single team member (bio / About). */
export default defineType({
  title: 'Team Member Block',
  name: 'teamMemberBlock',
  type: 'object',
  icon: UsersIcon,
  description: 'Single-person embed for About / organizer bios.',
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
      title: 'Team Member',
      name: 'member',
      type: 'reference',
      to: [{ type: 'team' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      active: 'active',
      title: 'member.title',
      media: 'member.image',
    },
    prepare({ active, title, media }) {
      return {
        title: title || 'Team Member',
        subtitle: active === false ? 'Inactive' : 'Active',
        media,
      }
    },
  },
})
