import { describe, expect, it } from 'vitest'
import { buildLlmsIndex, documentToMarkdown, markdownPath, sectionToMarkdown } from '@/lib/llms'
import { buildUrl } from '@/lib/seo'

const B = buildUrl('')

const span = (text: string, marks: string[] = []) => ({ _type: 'span', text, marks })
const block = (text: string, style = 'normal') => ({ _type: 'block', style, children: [span(text)] })

describe('markdownPath', () => {
  it('maps pages and home', () => {
    expect(markdownPath('/pricing')).toBe('/pricing.md')
    expect(markdownPath('/')).toBe('/index.md')
    expect(markdownPath('/posts/x')).toBe('/posts/x.md')
  })
})

describe('sectionToMarkdown', () => {
  it('renders text, faq and columns; skips inactive and visual blocks', () => {
    expect(sectionToMarkdown({ _type: 'textBlock', active: false, content: [block('hidden')] })).toBe('')
    expect(sectionToMarkdown({ _type: 'galleryBlock', images: [] })).toBe('')
    const faq = sectionToMarkdown({ _type: 'faqBlock', faqs: [{ question: 'Why?', answer: [block('Because.')] }] })
    expect(faq).toBe('### Why?\n\nBecause.')
    const cols = sectionToMarkdown({
      _type: 'columnBlock',
      header: [block('What to bring', 'h2')],
      columns: [{ title: 'Water', content: [block('Stay hydrated.')] }],
    })
    expect(cols).toContain('### What to bring')
    expect(cols).toContain('### Water\n\nStay hydrated.')
  })

  it('resolves cta links to absolute URLs', () => {
    const md = sectionToMarkdown({
      _type: 'ctaBlock',
      content: [block('Start', 'h2')],
      cta: { active: true, route: { linkType: 'page', title: 'Sign up', pageRoute: { slug: 'sign-up' } } },
    })
    expect(md).toContain('### Start')
    expect(md).toContain(`[Sign up](${B}/sign-up)`)
  })

  it('renders a team member section', () => {
    const md = sectionToMarkdown({
      _type: 'teamMemberBlock',
      member: { title: 'Jamie', primaryJobTitle: 'Organizer', content: [block('Dances a lot.')] },
    })
    expect(md).toBe('## Jamie\n\nOrganizer\n\nDances a lot.')
  })
})

describe('documentToMarkdown', () => {
  it('adds front matter and an H1 for pages', () => {
    const md = documentToMarkdown(
      {
        title: 'Pricing',
        slug: 'pricing',
        seo: { metaDesc: 'Simple pricing.' },
        sections: [{ _type: 'textBlock', content: [block('Body')] }],
        _updatedAt: '2026-08-22',
      },
      'page'
    )
    expect(md.startsWith('---\ntitle: "Pricing"\nurl: https://')).toBe(true)
    expect(md).toContain('updated: 2026-08-22\n---')
    expect(md).toContain('# Pricing\n\n> Simple pricing.\n\nBody')
  })

  it('carries event dates and location in front matter', () => {
    const md = documentToMarkdown(
      {
        title: 'Summer Jam',
        slug: { current: 'summer-jam' },
        startDate: '2026-07-10',
        endDate: '2026-07-12',
        location: 'Denver, CO',
        sections: [{ _type: 'textBlock', content: [block('Three days of contact.')] }],
      },
      'event'
    )
    expect(md).toContain(`url: ${B}/events/summer-jam`)
    expect(md).toContain('starts: 2026-07-10')
    expect(md).toContain('ends: 2026-07-12')
    expect(md).toContain('location: "Denver, CO"')
    expect(md).toContain('# Summer Jam\n\nThree days of contact.')
  })

  it('renders a post body with byline', () => {
    const md = documentToMarkdown(
      {
        title: 'Falling well',
        slug: 'falling-well',
        excerpt: 'On safe falling.',
        author: { title: 'Jamie' },
        body: [block('Bend your knees.')],
        publishedAt: '2026-06-01',
      },
      'post'
    )
    expect(md).toContain(`url: ${B}/posts/falling-well`)
    expect(md).toContain('published: 2026-06-01')
    expect(md).toContain('# Falling well\n\n> On safe falling.\n\nBy Jamie\n\nBend your knees.')
  })
})

describe('buildLlmsIndex', () => {
  it('orders pages by navigation and lists events and articles', () => {
    const md = buildLlmsIndex({
      site: { name: 'Denver Contact Jam', summary: 'Contact improvisation in Denver.' },
      nav: [{ slug: 'about', description: 'Who we are.' }],
      pages: [
        { slug: 'home', title: 'Home', description: 'Jam with us.' },
        { slug: 'about', title: 'About', description: 'seo desc' },
        { slug: 'faq', title: 'FAQ', description: 'Answers.' },
      ],
      events: [{ slug: 'summer-jam', title: 'Summer Jam', startDate: '2026-07-10' }],
      posts: [{ slug: 'falling-well', title: 'Falling well', excerpt: 'On safe falling.' }],
    })
    expect(md).toContain('# Denver Contact Jam\n\n> Contact improvisation in Denver.')
    expect(md).toContain(`## Pages\n\n- [Home](${B}/index.md): Jam with us.`)
    expect(md).toContain(`- [About](${B}/about.md): Who we are.`)
    expect(md).toContain(`## More\n\n- [FAQ](${B}/faq.md): Answers.`)
    expect(md).toContain(`## Events\n\n- [Summer Jam](${B}/events/summer-jam.md): 2026-07-10`)
    expect(md).toContain(`## Articles\n\n- [Falling well](${B}/posts/falling-well.md): On safe falling.`)
    expect(md).toContain(`## Optional\n\n- [Everything as one file](${B}/llms-full.txt)`)
  })
})
