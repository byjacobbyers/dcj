'use client'

import { LazyMotion, domAnimation, m } from 'framer-motion'

import type { MenuButtonProps } from '@/types/components/menu-button-type'

export default function MenuButton({
  onClick,
  isOpen,
  defaultColor,
}: MenuButtonProps) {
  return (
    <LazyMotion features={domAnimation}>
      <m.button
        type="button"
        className="z-50 flex h-8 w-8 flex-col items-center justify-center gap-y-[6px] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={onClick}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <m.svg width="30" height="30">
          <m.rect
            width="24"
            height="4"
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: 0.5, ease: [0.83, 0, 0.17, 1] }}
            variants={{
              closed: {
                rotate: 0,
                y: 11,
                x: 3,
                fill: defaultColor,
              },
              open: {
                rotate: 45,
                y: 15,
                x: 3,
                fill: 'var(--foreground)',
              },
            }}
          />
          <m.rect
            width="24"
            height="4"
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: 0.5, ease: [0.83, 0, 0.17, 1] }}
            variants={{
              closed: {
                rotate: 0,
                y: 19,
                x: 3,
                fill: defaultColor,
              },
              open: {
                rotate: -45,
                y: 15,
                x: 3,
                fill: 'var(--foreground)',
              },
            }}
          />
        </m.svg>
      </m.button>
    </LazyMotion>
  )
}
