'use client'

import Route from '@/components/route'
import { buttonVariants } from '@/components/ui/button'
import { resolveRouteUrl } from '@/lib/route-resolver'
import { cn } from '@/lib/utils'
import type { AnnouncementType } from '@/types/documents/announcement-type'

type AnnouncementBarProps = {
  announcement: AnnouncementType | null
}

export default function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  const message = announcement?.message?.trim()
  if (!message || !announcement) return null

  const route = announcement.route
  const hasRoute = Boolean(route?.linkType)
  const href = route && hasRoute ? resolveRouteUrl(route) : '#'
  const showCta = hasRoute && href !== '#'

  const ctaLabel = route?.title?.trim() || 'Learn more'

  return (
    <div
      className="flex w-full shrink-0 justify-center px-5 pt-2 pb-1"
      role="region"
      aria-label="Site announcement"
    >
      <div className="container">
        <div
          className={cn(
            'flex flex-nowrap items-center justify-between md:justify-center gap-2 md:gap-4 rounded-xl border bg-primary text-background px-6 py-1 sm:flex-row'
          )}
        >
          <p className="text-small max-w-prose text-balance">{message}</p>
          {showCta && route ? (
            <Route
              data={route}
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
                'no-underline shrink-0',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              {ctaLabel}
            </Route>
          ) : null}
        </div>
      </div>
    </div>
  )
}
