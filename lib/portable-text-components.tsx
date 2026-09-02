'use client'

import type { MouseEvent, ReactNode } from 'react'
import type { PortableTextBlock, PortableTextComponentProps } from '@portabletext/react'
import { buildRouteProps } from '@/lib/route-resolver'
import type { BaseRouteType } from '@/types/objects/route-type'
import SanityImage from '@/components/sanity-image'
import ButtonPair from '@/components/portable-text/button-pair'
import type { ButtonPairType } from '@/types/objects/button-pair-type'
import { useCtaLocation } from '@/context'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type LinkWithRouteMarkValue = BaseRouteType & {
  _type?: string
  /** Legacy portable text: link lived under `route`. */
  route?: BaseRouteType
}

function LinkWithRouteMark({
  value,
  children,
}: {
  value?: LinkWithRouteMarkValue
  children?: ReactNode
}) {
  const ctaLocation = useCtaLocation()
  const resolved: BaseRouteType | undefined = value?.linkType
    ? value
    : value?.route?.linkType
      ? value.route
      : undefined
  if (!resolved?.linkType) return <>{children}</>

  const routeData: BaseRouteType = {
    ...resolved,
    _type: resolved._type || 'linkWithRoute',
  }

  const { onClick: routeOnClick, title: titleTooltip, ...routePropsForAnchor } =
    buildRouteProps(routeData, {
      ctaLocation: ctaLocation || undefined,
    })

  const dataAttrs = Object.fromEntries(
    (resolved.dataAttributes ?? [])
      .filter((d) => d?.key)
      .map(({ key, value: attrVal }) => [`data-${key}`, attrVal ?? ''] as const),
  )

  const anchor = (
    <a
      {...routePropsForAnchor}
      {...dataAttrs}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => routeOnClick?.(e)}
      className="text-primary underline underline-offset-2 hover:opacity-90"
    >
      {children}
    </a>
  )

  if (titleTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{anchor}</TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-balance">{titleTooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return anchor
}

/** Slugified heading id so in-page anchor links (`linkType: 'anchor'`) can target sections. */
function headingId(value?: PortableTextBlock): string | undefined {
  const text = (value?.children ?? [])
    .map((c) => (typeof (c as { text?: unknown }).text === 'string' ? (c as { text: string }).text : ''))
    .join('')
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return slug || undefined
}

export const portableTextComponents = {
  block: {
    h2: ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => (
      <h2 id={headingId(value)}>{children}</h2>
    ),
    h3: ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => (
      <h3 id={headingId(value)}>{children}</h3>
    ),
    large: ({ children }: { children?: ReactNode }) => (
      <p className="text-body-lg">{children}</p>
    ),
    small: ({ children }: { children?: ReactNode }) => (
      <small>{children}</small>
    ),
  },
  types: {
    buttonPair: ({ value }: { value?: ButtonPairType }) => (
      <ButtonPair value={value} />
    ),
    defaultImage: ({
      value,
    }: {
      value?: { asset?: unknown; alt?: string; crop?: unknown; hotspot?: unknown }
    }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-4 relative aspect-video w-full max-w-2xl mx-auto">
          <SanityImage
            image={value}
            alt={value.alt || ''}
            className="rounded-lg object-cover"
          />
          {value.alt ? (
            <figcaption className="mt-2 text-sm text-muted-foreground text-center">
              {value.alt}
            </figcaption>
          ) : null}
        </figure>
      )
    },
  },
  marks: {
    linkWithRoute: LinkWithRouteMark,
    highlight: ({ children }: { children?: ReactNode }) => (
      <mark className="text-primary bg-transparent">{children}</mark>
    ),
  },
}
