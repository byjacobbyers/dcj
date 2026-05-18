'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { trackEvent } from '@/lib/gtm'
import type { SmoothScrollProviderProps } from '@/types/components/smooth-scroll-provider-type'

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const fired50 = useRef(false)
  const fired75 = useRef(false)
  const fired100 = useRef(false)

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true })

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
    }
  }, [])

  return <>{children}</>
}
