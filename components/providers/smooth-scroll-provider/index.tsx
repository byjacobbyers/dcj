'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { trackEvent } from '@/lib/gtm'
import type { SmoothScrollProviderProps } from '@/types/components/smooth-scroll-provider-type'

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)
  const fired50 = useRef(false)
  const fired75 = useRef(false)
  const fired100 = useRef(false)

  // Next resets window scroll on navigation, but Lenis's animated position
  // still holds the old value and snaps back on the next frame. Reset it —
  // unless the new URL targets an anchor, which should win.
  useEffect(() => {
    if (window.location.hash) return
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true })
    lenisRef.current = lenis

    const unsub = lenis.on('scroll', (l: { progress: number }) => {
      const pct = l.progress * 100
      if (pct >= 50 && !fired50.current) {
        fired50.current = true
        trackEvent('scroll', { percent_scrolled: 50 })
      }
      if (pct >= 75 && !fired75.current) {
        fired75.current = true
        trackEvent('scroll', { percent_scrolled: 75 })
      }
      if (pct >= 100 && !fired100.current) {
        fired100.current = true
        trackEvent('scroll', { percent_scrolled: 100 })
      }
    })

    return () => {
      unsub()
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
