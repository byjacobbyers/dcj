import { defineType, defineField } from 'sanity'

/** Social profile URLs for team members (Person sameAs). */
export default defineType({
  title: 'Social',
  name: 'social',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({ title: 'Facebook', name: 'facebook', type: 'url' }),
    defineField({ title: 'LinkedIn', name: 'linkedin', type: 'url' }),
    defineField({ title: 'GitHub', name: 'github', type: 'url' }),
    defineField({ title: 'X (Twitter)', name: 'x', type: 'url' }),
    defineField({ title: 'Instagram', name: 'instagram', type: 'url' }),
    defineField({ title: 'YouTube', name: 'youtube', type: 'url' }),
    defineField({ title: 'TikTok', name: 'tiktok', type: 'url' }),
  ],
})
