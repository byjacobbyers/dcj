'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useCycle } from 'framer-motion'
import Route from '@/components/route'
import MenuButton from '@/components/header/menu-button'
import MobileNav from '@/components/navigation/mobile'
import type { HeaderProps } from '@/types/components/header-type'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const SCROLL_BG_THRESHOLD = 15

export default function Header({ navigation }: HeaderProps) {
  const [isOpen, toggleDropdown] = useCycle(false, true)
  const headerRef = useRef<HTMLElement>(null)
  const [dimensions, setDimensions] = useState({ height: 64 })
  const [scrolled, setScrolled] = useState(false)

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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_BG_THRESHOLD)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => {
    toggleDropdown()
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'sticky top-0 z-50 w-full p-5 transition-colors duration-200',
          scrolled && 'bg-background',
        )}
      >
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-center"
          >
            <div className="flex items-end gap-2 leading-none">
              <h1
                className="text-2xl font-heading xl:text-5xl 2xl:text-7xl"
                title="Denver Contact Jam"
              >
                DENVER CONTACT JAM
              </h1>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-lg 2xl:text-2xl">
            {navigation?.items?.map((item, i) => (
              <Route
                key={i}
                data={item}
                className="font-bold uppercase transition duration-200 ease-out hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                {item.title || 'Link'}
              </Route>
            ))}
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
        initial="closed"
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
        style={{ top: dimensions.height }}
        className={`fixed inset-x-0 bottom-0 z-40 flex w-full flex-col items-center overflow-y-auto overscroll-contain bg-background px-5 text-center xl:hidden ${!isOpen ? 'pointer-events-none' : ''}`}
        aria-hidden={!isOpen}
      >
        {navigation && <MobileNav data={navigation} closeMenu={closeMenu} />}
      </motion.div>
    </>
  )
}
