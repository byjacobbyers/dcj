import type { BaseRouteType } from '@/types/objects/route-type'

export type MobileNavProps = {
  data: { items?: BaseRouteType[] }
  closeMenu: () => void
}
