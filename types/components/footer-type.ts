import type { RouteNavigationItems } from '@/types/components/route-navigation-type'
import type { SiteType } from '@/lib/seo'

export type FooterProps = {
  navigation?: RouteNavigationItems
  site?: SiteType | null
}
