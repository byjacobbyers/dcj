'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useCycle } from 'framer-motion'
import AuroraBits from '@/components/aurora-bits'
import Route from '@/components/route'
import MenuButton from '@/components/header/menu-button'
import MobileNav from '@/components/navigation/mobile'
import { PRIMARY_AURORA_STOPS } from '@/components/ui/primary-button-aurora-layers'
import { cn } from '@/lib/utils'
import type { HeaderProps } from '@/types/components/header-type'
import { motion } from 'framer-motion'

const BOOK_NOW_TITLE = 'Book Now'

/** Scroll progress 0–1; past 5% of the page switches logo → ring. */
function usePageScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const maxScroll = Math.max(1, el.scrollHeight - window.innerHeight)
      const y = window.scrollY ?? el.scrollTop
      setProgress(Math.min(1, Math.max(0, y / maxScroll)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}

/** ViewBox units for the ring (display size comes from `w-7 h-7` = 7×`--spacing`). */
const LOGO_VB = 32
const RING_STROKE = 2.2
/** Stroke is centered on the path; outer edge flush with logo box in viewBox space. */
const RING_R = LOGO_VB / 2 - RING_STROKE / 2
const RING_C = 2 * Math.PI * RING_R

function HeaderScrollLogoMark() {
  const progress = usePageScrollProgress()
  const showRing = progress > 0.05
  const offset = RING_C * (1 - progress)

  return (
    <div
      className="relative flex h-7 w-7 items-center justify-center"
      aria-hidden
    >
      <div className="aspect-square p-[0.5px] h-full w-full overflow-hidden">
        <img
          src="/denver-contact-jam.svg"
          alt="Denver Contact Jam logo"
          className="h-full w-full object-contain"
        />
      </div>
      <svg
        viewBox={`0 0 ${LOGO_VB} ${LOGO_VB}`}
        preserveAspectRatio="xMidYMid meet"
        className={cn(
          'pointer-events-none absolute inset-0 z-10 block transition-opacity duration-200 ease-out motion-reduce:transition-none',
          showRing ? 'opacity-100' : 'opacity-0'
        )}
      >
        <circle
          cx={LOGO_VB / 2}
          cy={LOGO_VB / 2}
          r={RING_R}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={RING_STROKE}
        />
        <circle
          cx={LOGO_VB / 2}
          cy={LOGO_VB / 2}
          r={RING_R}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${LOGO_VB / 2} ${LOGO_VB / 2})`}
        />
      </svg>
    </div>
  )
}

export default function Header({ navigation }: HeaderProps) {
  const [isOpen, toggleDropdown] = useCycle(false, true)
  const headerRef = useRef<HTMLElement>(null)
  const [dimensions, setDimensions] = useState({ height: 64 })
  const [headerAuroraActive, setHeaderAuroraActive] = useState(false)
  const [headerAuroraMounted, setHeaderAuroraMounted] = useState(false)

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setDimensions({ height: headerRef.current.offsetHeight })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const closeMenu = () => {
    toggleDropdown()
  }

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b-4 border-primary px-5 isolate overflow-hidden"
      >
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 z-0 bg-background transition-opacity duration-300 ease-out',
            headerAuroraActive && 'opacity-0 motion-reduce:opacity-100'
          )}
        />
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out opacity-0 motion-reduce:opacity-0',
            headerAuroraActive && 'opacity-100'
          )}
        >
          {headerAuroraMounted ? (
            <div className="relative h-full min-h-16 w-full">
              <span aria-hidden className="absolute inset-0 bg-muted/40" />
              <AuroraBits
                colorStops={[...PRIMARY_AURORA_STOPS]}
                blend={0.5}
                amplitude={1}
                speed={0.6}
              />
            </div>
          ) : null}
        </div>
        <div className="relative z-10 flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-center"
          >
            <HeaderScrollLogoMark />
            <div className="flex items-end gap-2 leading-none">
              <h1
                className="text-2xl font-bold leading-none p-0 lg:text-3xl"
                title="Denver Contact Jam"
              >
                OHMNI
              </h1>
              <span className="text-sm pb-[2px] md:pb-[3px] uppercase leading-none">
                Web Technologies
              </span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-lg 2xl:text-2xl">
            {navigation?.items?.map((item, i) => {
              const isBookNow = item.title === BOOK_NOW_TITLE
              return (
                <Route
                  key={i}
                  data={item}
                  className="font-bold uppercase transition duration-200 ease-out hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
                  onMouseEnter={
                    isBookNow
                      ? () => {
                          setHeaderAuroraMounted(true)
                          setHeaderAuroraActive(true)
                        }
                      : undefined
                  }
                  onMouseLeave={
                    isBookNow ? () => setHeaderAuroraActive(false) : undefined
                  }
                >
                  {item.title || 'Link'}
                </Route>
              )
            })}
          </nav>
          <div className="flex lg:hidden">
            <MenuButton
              onClick={() => toggleDropdown()}
              isOpen={isOpen}
              defaultColor="var(--foreground)"
            />
          </div>
        </div>
      </header>

      <motion.div
        initial={'closed'}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
        variants={{
          closed: {
            y: '-100%',
            opacity: 0,
          },
          open: {
            y: 0,
            opacity: 1,
          },
        }}
        style={{
          paddingTop: dimensions.height,
        }}
        className='fixed left-0 top-0 z-40 flex h-screen w-screen flex-col items-center overflow-scroll bg-background px-5 text-center xl:hidden'
      >
        {navigation && (
          <MobileNav
            data={navigation}
            closeMenu={closeMenu}
            onBookNowHoverChange={(active) => {
              if (active) setHeaderAuroraMounted(true)
              setHeaderAuroraActive(active)
            }}
          />
        )}
      </motion.div>
    </>
  )
}
