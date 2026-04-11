'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Route from '@/components/route'

import type { MobileNavProps } from '@/types/components/navigation-mobile-type'

export default function MobileNav({ data, closeMenu }: MobileNavProps) {
  const handleItemClick = () => {
    closeMenu()
  }

  return (
    <NavigationMenu viewport={false} className="w-full max-w-none">
      <NavigationMenuList className="flex w-full flex-col gap-y-5 p-0">
        {data.items?.map((item, index) => (
          <NavigationMenuItem
            key={'header' + index + 1}
            id={'header' + index + 1}
            className="w-full"
            onClick={handleItemClick}
          >
            <Route data={item} className="flex w-full justify-center text-3xl font-bold">
              {item.title || 'Needs title'}
            </Route>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
