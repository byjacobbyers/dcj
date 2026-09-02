import type { BaseRouteType } from '@/types/objects/route-type'

/** A destination inside a dropdown: route plus the context a bare route lacks. */
export type NavLinkType = {
  _key?: string
  route?: BaseRouteType
  description?: string
}

/** A top-level item that opens a dropdown instead of navigating. */
export type SubNavType = {
  _key?: string
  _type: 'subNav'
  title?: string
  /** 'cards' or 'list' (default) */
  display?: string
  items?: NavLinkType[]
}

/** A top-level item that navigates directly. */
export type NavRouteType = BaseRouteType & {
  _key?: string
}

export type NavItemType = NavRouteType | SubNavType

export type NavigationData = {
  title?: string
  items?: NavItemType[]
} | null

export function isSubNav(item: NavItemType): item is SubNavType {
  return item?._type === 'subNav'
}
