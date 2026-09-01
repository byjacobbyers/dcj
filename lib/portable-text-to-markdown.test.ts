import { describe, expect, it } from 'vitest'
import { portableTextToMarkdown } from '@/lib/portable-text-to-markdown'

const span = (text: string, marks: string[] = []) => ({ _type: 'span' as const, text, marks })

describe('portableTextToMarkdown', () => {
  it('renders headings, marks, links, lists, quotes and images', () => {
    const md = portableTextToMarkdown(
      [
        { _type: 'block', style: 'h2', children: [span('Pricing')] },
        {
          _type: 'block',
          style: 'normal',
          markDefs: [{ _key: 'l', _type: 'linkWithRoute', linkType: 'path', route: 'free-site-audit' }],
          children: [span('Start with '), span('an honest look', ['strong']), span(' at the '), span('audit', ['l']), span('.')],
        },
        { _type: 'block', listItem: 'bullet', level: 1, children: [span('one')] },
        { _type: 'block', listItem: 'bullet', level: 2, children: [span('nested', ['em'])] },
        { _type: 'block', listItem: 'number', level: 1, children: [span('first')] },
        { _type: 'block', listItem: 'number', level: 1, children: [span('second')] },
        { _type: 'block', style: 'blockquote', children: [span('quoted')] },
        { _type: 'defaultImage', alt: 'diagram', asset: { url: 'https://cdn/x.png' } },
        { _type: 'block', style: 'normal', children: [span('   ')] },
      ],
      { resolveHref: (d) => (d.linkType === 'path' ? `/${d.route}` : null), headingOffset: 1 }
    )
    expect(md).toBe(
      [
        '### Pricing',
        '',
        'Start with **an honest look** at the [audit](/free-site-audit).',
        '',
        '- one',
        '  - _nested_',
        '1. first',
        '2. second',
        '',
        '> quoted',
        '',
        '![diagram](https://cdn/x.png)',
      ].join('\n')
    )
  })

  it('keeps leading and trailing space outside emphasis', () => {
    const md = portableTextToMarkdown([
      { _type: 'block', style: 'normal', children: [span('Start with', ['strong']), span(' a look')] },
    ])
    expect(md).toBe('**Start with** a look')
  })

  it('joins soft line breaks inside headings', () => {
    expect(portableTextToMarkdown([{ _type: 'block', style: 'h2', children: [span('Simple pricing because'), span(' \nyou own everything.')] }])).toBe(
      '## Simple pricing because you own everything.'
    )
  })

  it('handles empty input', () => {
    expect(portableTextToMarkdown(null)).toBe('')
  })
})
