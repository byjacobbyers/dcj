import { defineField } from 'sanity'

export function sectionContentLayoutField() {
  return defineField({
    title: 'Content presentation',
    name: 'contentLayout',
    type: 'string',
    description:
      'Flush: main content uses the full section width. Card: wraps the main content in a bordered card panel.',
    initialValue: 'flush',
    options: {
      layout: 'dropdown',
      list: [
        { title: 'Flush', value: 'flush' },
        { title: 'Card', value: 'card' },
      ],
    },
  })
}
