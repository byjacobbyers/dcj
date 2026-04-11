import type { BaseRouteType } from '@/types/objects/route-type'

export type MobileNavProps = {
  data: { items?: BaseRouteType[] }
  closeMenu: () => void
  /** Fires when Book Now link is hovered (e.g. header aurora on tablet with pointer). */
  onBookNowHoverChange?: (active: boolean) => void
}
