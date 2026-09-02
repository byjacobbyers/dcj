import type { NavigationData } from '@/types/components/nav-type'

export type MobileNavProps = {
  data: NonNullable<NavigationData>
  closeMenu: () => void
}
