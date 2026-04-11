import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react'

import type { BaseRouteType } from '@/types/objects/route-type'

export type RouteProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  data: BaseRouteType
  children: ReactNode
  className?: string
}

export type RouteLinkWithOptionalTooltipProps = {
  tooltipText?: string
  children: ReactElement
}
