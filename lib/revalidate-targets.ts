/**
 * What to revalidate when Sanity publishes a document (the webhook at
 * /api/revalidate/path). Pure, so it is covered by tests.
 */

export type RevalidateTarget = { path: string; type?: 'layout' }

export type RevalidatePayload = {
  _type: string
  slug?: { current?: string } | null
}

/** Rendered by the site layout, so a change shows on every page. */
const LAYOUT_TYPES = new Set(['navigation', 'site', 'announcement'])

/** Every page under the root layout. */
const EVERY_PAGE: RevalidateTarget = { path: '/', type: 'layout' }

export function getRevalidateTargets({ _type, slug }: RevalidatePayload): RevalidateTarget[] {
  const current = slug?.current

  if (LAYOUT_TYPES.has(_type)) return [EVERY_PAGE]

  switch (_type) {
    case 'page':
      if (current === 'home' || !current) return [{ path: '/' }]
      return [{ path: `/${current}` }]
    case 'event':
      // The event's own page, plus the listings: the home page section,
      // /events and /past-events.
      return [
        ...(current ? [{ path: `/events/${current}` }] : []),
        { path: '/' },
        { path: '/events' },
        { path: '/past-events' },
      ]
    case 'post':
      return [...(current ? [{ path: `/posts/${current}` }] : []), { path: '/' }]
    default:
      return [{ path: '/' }]
  }
}
