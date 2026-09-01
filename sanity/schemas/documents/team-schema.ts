import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons/Users'

/** Lean team member — Person source for founders, article authors, and bio blocks. */
export default defineType({
  name: 'team',
  title: 'Team Member',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { title: 'Profile', name: 'profile', default: true },
    { title: 'Contact', name: 'contact' },
  ],
  fields: [
    defineField({
      title: 'Founder',
      name: 'founder',
      type: 'boolean',
      group: 'profile',
      initialValue: false,
      description:
        'When on, this person is listed as an Organization founder in JSON-LD. Job title stays whatever you enter below.',
    }),
    defineField({
      title: 'Name',
      name: 'title',
      type: 'string',
      group: 'profile',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      group: 'profile',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'Used for Person URL anchors (e.g. /about#your-slug).',
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'defaultImage',
      group: 'profile',
    }),
    defineField({
      title: 'Primary Job Title',
      name: 'primaryJobTitle',
      type: 'string',
      group: 'profile',
      description: 'Free-text role shown on the site and in Person JSON-LD (e.g. “Founder”, “Organizer”).',
    }),
    defineField({
      title: 'Secondary Job Title',
      name: 'secondaryJobTitle',
      type: 'string',
      group: 'profile',
    }),
    defineField({
      title: 'Bio',
      name: 'content',
      type: 'normalText',
      group: 'profile',
    }),
    defineField({
      title: 'Phone',
      name: 'phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      title: 'Email',
      name: 'email',
      type: 'email',
      group: 'contact',
    }),
    defineField({
      title: 'Social Links',
      name: 'socials',
      type: 'social',
      group: 'contact',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      primaryJobTitle: 'primaryJobTitle',
      founder: 'founder',
      media: 'image',
    },
    prepare({ title, primaryJobTitle, founder, media }) {
      const role = primaryJobTitle || 'No title specified'
      return {
        title,
        subtitle: founder ? `Founder · ${role}` : role,
        media,
      }
    },
  },
})
