'use client'

import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import type { ReactNode } from 'react'

export type AppearAnimationProps = {
  children: ReactNode
  className?: string
  /** When true, also animate scale from 0.95 → 1 */
  scale?: boolean
  /** Transition delay in seconds */
  delay?: number
  transition?: Transition
}

/**
 * Client island for fade-in-on-scroll. Use inside RSC block shells so the
 * section markup stays on the server while only this wrapper hydrates.
 */
export default function AppearAnimation({
  children,
  className,
  scale = false,
  delay = 0,
  transition,
}: AppearAnimationProps) {
  // Respect prefers-reduced-motion: render content in its final state.
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial={{ opacity: 0, ...(scale ? { scale: 0.95 } : {}) }}
        whileInView={{ opacity: 1, ...(scale ? { scale: 1 } : {}) }}
        viewport={{ once: true }}
        transition={transition ?? { delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
