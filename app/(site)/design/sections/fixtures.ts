import type { PortableTextBlock } from 'next-sanity'
import type { BaseRouteType } from '@/types/objects/route-type'
import type { PostCard } from '@/types/components/posts-block-type'
import type { EventCard } from '@/types/components/events-block-type'
import { todayDateKey } from '@/lib/event-timing'
import type { TeamMemberData } from '@/types/components/team-member-block-type'

/** Minimal portable text block for design fixtures. */
export function pt(
  text: string,
  style: PortableTextBlock['style'] = 'normal',
  key = 'a'
): PortableTextBlock[] {
  return [
    {
      _type: 'block',
      _key: key,
      style,
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${key}-span`,
          text,
          marks: [],
        },
      ],
    } as PortableTextBlock,
  ]
}

export function ptBlocks(
  parts: Array<{ text: string; style?: PortableTextBlock['style'] }>
): PortableTextBlock[] {
  return parts.flatMap((part, i) => pt(part.text, part.style ?? 'normal', `b${i}`))
}

export const fixtureCta = {
  active: true,
  route: {
    _type: 'route',
    title: 'Join the jam',
    linkType: 'external',
    link: 'https://denvercontactjam.org',
    blank: true,
  } satisfies BaseRouteType,
}

/**
 * Asset-less Sanity image fixture: SanityImage renders its ImagePlaceholder
 * whenever `asset` is missing, so blocks show wireframe media slots without
 * hitting the Sanity CDN. Do NOT add an `asset` key — urlFor would throw.
 */
export const fixtureImage = { alt: 'Placeholder image' }

/** Public Vimeo clip so video blocks render without a Mux playback ID. */
export const fixtureVimeoUrl = 'https://vimeo.com/76979871'

export const fixtureEmbedHtml = `<iframe title="Embed fixture" srcdoc="<body style='margin:0;display:flex;align-items:center;justify-content:center;min-height:280px;font-family:ui-monospace,monospace;background:#f4f4f5;color:#737373;letter-spacing:0.15em'>EMBED SLOT</body>" style="width:100%;min-height:300px;border:0"></iframe>`

export const fixturePosts: PostCard[] = [
  {
    _id: 'post-1',
    title: 'What is contact improvisation?',
    slug: 'what-is-contact-improvisation',
    publishedAt: '2026-03-12',
    author: { title: 'Denver Contact Jam' },
    category: 'Basics',
    excerpt: 'A short primer on weight sharing, rolling points of contact, and listening through touch.',
  },
  {
    _id: 'post-2',
    title: 'First jam? Start here',
    slug: 'first-jam-start-here',
    publishedAt: '2026-04-02',
    author: { title: 'Denver Contact Jam' },
    category: 'Community',
    excerpt: 'What to wear, how the opening circle works, and how to take care of yourself on the floor.',
  },
  {
    _id: 'post-3',
    title: 'Jam etiquette and consent',
    slug: 'jam-etiquette-and-consent',
    publishedAt: '2026-05-18',
    author: { title: 'Denver Contact Jam' },
    category: 'Community',
    excerpt: 'Our shared agreements for a safe, playful, and welcoming dance space.',
  },
]

export const fixtureMember: TeamMemberData = {
  _id: 'member-1',
  title: 'Alex Dancer',
  slug: 'alex-dancer',
  image: fixtureImage,
  primaryJobTitle: 'Jam facilitator',
  secondaryJobTitle: 'Teacher',
  email: 'hello@denvercontactjam.org',
  socials: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
  },
  content: pt(
    'Facilitates the weekly jam and teaches the beginner-friendly warm-up that opens each session.'
  ),
}

/** Days from today's Denver date, so the playground always has upcoming and past events. */
function daysFromToday(days: number): string {
  const d = new Date(`${todayDateKey()}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export const fixtureEvents: EventCard[] = [
  {
    _id: 'event-1',
    title: 'Contact Improvisation Workshop',
    slug: 'contact-improvisation-workshop',
    startDate: daysFromToday(10),
    timeString: '6:00–8:30pm',
    eventType: 'workshop',
    location: 'Wiggelruhm',
    price: '$35, free to Wiggelruhm members',
  },
  {
    _id: 'event-2',
    title: 'Falling and Flying: a four-week series',
    slug: 'falling-and-flying',
    startDate: daysFromToday(20),
    endDate: daysFromToday(41),
    timeString: 'Wednesdays, 6–8pm',
    eventType: 'series',
    price: '$100 for the series',
  },
  {
    _id: 'event-3',
    title: 'Winter Solstice Jam',
    slug: 'winter-solstice-jam',
    startDate: daysFromToday(35),
    timeString: '7–10pm',
    eventType: 'jam',
    soldOut: true,
  },
  {
    _id: 'event-4',
    title: 'Underscore Practice',
    slug: 'underscore-practice',
    startDate: daysFromToday(-30),
    timeString: '2–5pm',
    eventType: 'jam',
    price: 'By donation',
  },
]
