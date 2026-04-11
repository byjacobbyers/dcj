import React from 'react'
import { defineType } from 'sanity'
import { HighlightIcon, TextIcon } from '@sanity/icons'
import { LargeBlockStyle } from './large-block-style'

const HighlightDecorator = (props: { children?: React.ReactNode }) =>
  React.createElement('span', { style: { color: 'var(--primary, #3265fd)' } }, props.children)

export default defineType({
  title: 'Text',
  name: 'simpleText',
  type: 'array',
  icon: TextIcon,
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Large', value: 'large', component: LargeBlockStyle },
        { title: 'Small', value: 'small' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Highlight', value: 'highlight', icon: HighlightIcon, component: HighlightDecorator },
        ],
        annotations: [{ type: 'linkWithRoute' }],
      },
    },
  ],
})
