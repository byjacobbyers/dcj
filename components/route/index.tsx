'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { buildRouteProps } from '@/lib/route-resolver'
import type { MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import { useCtaLocation } from '@/context'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type {
  RouteLinkWithOptionalTooltipProps,
  RouteProps,
} from '@/types/components/route-link-type'

function RouteLinkWithOptionalTooltip({
  tooltipText,
  children,
}: RouteLinkWithOptionalTooltipProps) {
  if (!tooltipText) return children
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-balance">{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const Route = forwardRef<HTMLAnchorElement, RouteProps>(
  ({ data, children, className, ...rest }, ref) => {
    const ctaLocation = useCtaLocation()
    if (!data || !data.linkType) {
      return <>{children}</>
    }

    const { onClick: onClickFromRest, ...restWithoutOnClick } = rest
    const routeProps = buildRouteProps(data, {
      ctaLocation: ctaLocation || undefined,
    })
    const { onClick: routeOnClick, title: titleTooltip, ...routePropsForDom } = routeProps
    const mergedOnClick =
      routeOnClick || onClickFromRest
        ? (e: MouseEvent<HTMLAnchorElement>) => {
            routeOnClick?.(e)
            onClickFromRest?.(e)
          }
        : undefined
    const isExternal =
      data.linkType === 'external' ||
      data.linkType === 'email' ||
      data.linkType === 'telephone'
    const isFileDownload = data.linkType === 'file'
    const isAnchor = data.linkType === 'anchor'

    const dataAttrs = Object.fromEntries(
      (data.dataAttributes ?? [])
        .filter((d) => d?.key)
        .map(({ key, value }) => [`data-${key}`, value ?? ''] as const),
    )

    const mergedClassName = cn(className)

    if (isExternal || isFileDownload || data.blank) {
      return (
        <RouteLinkWithOptionalTooltip tooltipText={titleTooltip}>
          <a
            ref={ref}
            {...routePropsForDom}
            {...dataAttrs}
            {...restWithoutOnClick}
            onClick={mergedOnClick}
            className={mergedClassName}
          >
            {children}
          </a>
        </RouteLinkWithOptionalTooltip>
      )
    }

    if (isAnchor) {
      return (
        <RouteLinkWithOptionalTooltip tooltipText={titleTooltip}>
          <a
            ref={ref}
            {...routePropsForDom}
            {...dataAttrs}
            {...restWithoutOnClick}
            onClick={mergedOnClick}
            className={mergedClassName}
          >
            {children}
          </a>
        </RouteLinkWithOptionalTooltip>
      )
    }

    return (
      <RouteLinkWithOptionalTooltip tooltipText={titleTooltip}>
        <Link
          ref={ref}
          {...routePropsForDom}
          {...dataAttrs}
          {...restWithoutOnClick}
          onClick={mergedOnClick}
          className={mergedClassName}
        >
          {children}
        </Link>
      </RouteLinkWithOptionalTooltip>
    )
  }
)

Route.displayName = 'Route'

export default Route
