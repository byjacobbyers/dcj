import { describe, expect, it } from 'vitest'
import { getRevalidateTargets } from './revalidate-targets'

describe('getRevalidateTargets', () => {
  it('refreshes every page for the menus, site settings and announcement', () => {
    for (const _type of ['navigation', 'site', 'announcement']) {
      expect(getRevalidateTargets({ _type })).toEqual([{ path: '/', type: 'layout' }])
    }
  })

  it('refreshes a page by its slug, and the home page at /', () => {
    expect(getRevalidateTargets({ _type: 'page', slug: { current: 'about' } })).toEqual([{ path: '/about' }])
    expect(getRevalidateTargets({ _type: 'page', slug: { current: 'home' } })).toEqual([{ path: '/' }])
  })

  it('refreshes an event and every listing that shows events', () => {
    expect(getRevalidateTargets({ _type: 'event', slug: { current: 'workshop' } })).toEqual([
      { path: '/events/workshop' },
      { path: '/' },
      { path: '/events' },
      { path: '/past-events' },
    ])
  })

  it('refreshes a post and the home page', () => {
    expect(getRevalidateTargets({ _type: 'post', slug: { current: 'hello' } })).toEqual([
      { path: '/posts/hello' },
      { path: '/' },
    ])
  })

  it('falls back to the home page for anything else', () => {
    expect(getRevalidateTargets({ _type: 'team' })).toEqual([{ path: '/' }])
  })
})
