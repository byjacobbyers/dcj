'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Route from '@/components/route'
import { isSubNav } from '@/types/components/nav-type'

import type { MobileNavProps } from '@/types/components/navigation-mobile-type'

export default function MobileNav({ data, closeMenu }: MobileNavProps) {
  const handleItemClick = () => {
    closeMenu()
  }

  return (
    <NavigationMenu viewport={false} className="w-full max-w-none">
      <NavigationMenuList className="flex w-full flex-col gap-y-5 p-0">
        {data?.items?.map((item, index) => {
          if (isSubNav(item)) {
            if (!item.items?.length) return null
            return (
              <NavigationMenuItem
                key={item._key || 'header-sub' + index}
                className="flex w-full flex-col gap-y-4"
              >
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {item.title}
                </span>
                {item.items.map((link, j) =>
                  link.route ? (
                    <Route
                      key={link._key || 'sub-link' + j}
                      data={link.route}
                      className="flex w-full justify-center text-2xl font-bold"
                      onClick={handleItemClick}
                    >
                      {link.route.title || 'Link'}
                    </Route>
                  ) : null,
                )}
              </NavigationMenuItem>
            )
          }

          return (
            <NavigationMenuItem
              key={item._key || 'header' + index}
              className="w-full"
              onClick={handleItemClick}
            >
              <Route data={item} className="flex w-full justify-center text-3xl font-bold">
                {item.title || 'Needs title'}
              </Route>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
