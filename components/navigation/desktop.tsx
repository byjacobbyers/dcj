'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import Route from '@/components/route'
import { isSubNav, type NavItemType } from '@/types/components/nav-type'
import { cn } from '@/lib/utils'

export type DesktopNavProps = {
  items?: NavItemType[]
}

const labelClass = 'font-bold uppercase'

/**
 * Grow on hover. Kept off the dropdown triggers: the label shifting under the
 * cursor fights the panel opening beneath it.
 */
const hoverGrow =
  'transition duration-200 ease-out hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100'

export default function DesktopNav({ items }: DesktopNavProps) {
  if (!items?.length) return null

  return (
    <NavigationMenu
      // The shared viewport is one panel for the whole menu, so it can only sit
      // at one edge. Opting out lets each panel render inside its own item and
      // hang from that trigger's left edge.
      viewport={false}
      className="hidden lg:flex"
    >
      <NavigationMenuList className="items-center gap-6 text-lg 2xl:text-2xl">
        {items.map((item, i) => {
          if (isSubNav(item)) {
            if (!item.items?.length) return null
            return (
              <NavigationMenuItem key={item._key || `sub-${i}`}>
                {/* The shadcn trigger hard-codes text-sm, h-9 and a hover
                    background. Strip all three so a dropdown label reads
                    exactly like the plain routes beside it. */}
                <NavigationMenuTrigger
                  className={`${labelClass} h-auto bg-transparent p-0 text-lg 2xl:text-2xl hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent`}
                >
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50 p-3">
                  <ul
                    className={
                      item.display === 'cards'
                        ? 'grid w-[min(28rem,calc(100vw-3rem))] grid-cols-1 gap-3 sm:grid-cols-2'
                        : 'grid w-[min(20rem,calc(100vw-3rem))] grid-cols-1 gap-2'
                    }
                  >
                    {item.items.map((link, j) =>
                      link.route ? (
                        <li key={link._key || `link-${j}`}>
                          <NavigationMenuLink asChild>
                            <Route
                              data={link.route}
                              className={cn(
                                'flex flex-col gap-1 rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-primary',
                              )}
                            >
                              <span className="text-base font-bold">
                                {link.route.title || 'Link'}
                              </span>
                              {link.description ? (
                                <span className="text-sm text-muted-foreground">
                                  {link.description}
                                </span>
                              ) : null}
                            </Route>
                          </NavigationMenuLink>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }

          return (
            <NavigationMenuItem key={item._key || `route-${i}`}>
              <Route data={item} className={`${labelClass} ${hoverGrow}`}>
                {item.title || 'Link'}
              </Route>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
