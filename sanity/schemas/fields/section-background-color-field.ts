import { defineField } from 'sanity'

const DEFAULT_DESCRIPTION =
  'Section surface. Transparent shows the page behind this block. Primary and Secondary use the site palette.'

export function sectionBackgroundColorField(opts?: {
  hidden?: (ctx: { parent?: Record<string, unknown> }) => boolean
  description?: string
}) {
  return defineField({
    title: 'Background Color',
    name: 'backgroundColor',
    type: 'string',
    description: opts?.description ?? DEFAULT_DESCRIPTION,
    initialValue: 'transparent',
    options: {
      list: [
        { title: 'Transparent', value: 'transparent' },
        { title: 'White', value: 'primary' },
        { title: 'Pink', value: 'secondary' },
      ],
      layout: 'dropdown',
    },
    ...(opts?.hidden ? { hidden: opts.hidden } : {}),
  })
}
