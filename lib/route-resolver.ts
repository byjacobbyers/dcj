import type { MouseEvent } from 'react'
import { BaseRouteType } from '@/types/objects/route-type'
import { trackEvent } from '@/lib/gtm'

export function resolveRouteUrl(route: BaseRouteType): string {
  if (!route || !route.linkType) return '#'

  switch (route.linkType) {
    case 'page': {
      const pageSlug =
        typeof route.pageRoute?.slug === 'string' ? route.pageRoute.slug : route.pageRoute?.slug?.current
      return pageSlug ? `/${pageSlug}` : '#'
    }
    case 'event': {
      const eventSlug =
        typeof route.eventRoute?.slug === 'string' ? route.eventRoute.slug : route.eventRoute?.slug?.current
      return eventSlug ? `/events/${eventSlug}` : '#'
    }
    case 'path':
      if (route.route === undefined || route.route === null) return '#'
      if (route.route === '') return '/'
      return `/${route.route}`
    case 'anchor':
      return route.anchor ? `#${route.anchor}` : '#'
    case 'file':
      return route.fileRoute?.asset?.url || '#'
    case 'external':
      return route.link || '#'
    case 'email':
      return route.email ? `mailto:${route.email}` : '#'
    case 'telephone':
      return route.telephone ? `tel:${route.telephone}` : '#'
    default:
      return '#'
  }
}

function getFileExtension(fileName?: string) {
  if (!fileName) return undefined
  const idx = fileName.lastIndexOf('.')
  if (idx === -1 || idx === fileName.length - 1) return undefined
  return fileName.slice(idx + 1)
}

export function buildRouteProps(
  route: BaseRouteType,
  options: { ctaLocation?: string } = {},
) {
  if (!route || !route.linkType) {
    return { href: '#' }
  }

  const href = resolveRouteUrl(route)
  const ctaLocation = options.ctaLocation

  const isExternal =
    route.linkType === 'external' || route.linkType === 'email' || route.linkType === 'telephone'
  const isFileDownload = route.linkType === 'file'

  const eventName = route.trackingId
  const ctaText = route.title || route.titleAttr || route.ariaLabel || 'cta'

  const props: {
    href: string
    target?: string
    rel?: string
    download?: string
    'aria-label'?: string
    title?: string
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  } = { href }

  if (route.blank || isExternal || isFileDownload) {
    props.target = '_blank'
    props.rel = 'noopener noreferrer'
  }

  if (route.relAttributes?.length) {
    const extra = route.relAttributes.filter(Boolean).join(' ')
    props.rel = [props.rel, extra].filter(Boolean).join(' ') || undefined
  }

  if (isFileDownload && route.fileRoute?.asset?.originalFilename) {
    props.download = route.fileRoute.asset.originalFilename
  }

  if (route.ariaLabel) {
    props['aria-label'] = route.ariaLabel
  }

  if (route.titleAttr) {
    props.title = route.titleAttr
  }

  if (isFileDownload) {
    const fileName = route.fileRoute?.asset?.originalFilename || 'file'
    const fileExtension = getFileExtension(fileName)
    props.onClick = () => {
      trackEvent(eventName || 'file_download', {
        file_name: fileName,
        file_extension: fileExtension,
        link_url: href,
        cta_text: ctaText,
        cta_location: ctaLocation,
      })
    }
  } else if (eventName) {
    props.onClick = () => {
      trackEvent(eventName, {
        cta_text: ctaText,
        cta_location: ctaLocation,
        destination_url: href,
        link_type: route.linkType,
      })
    }
  }

  return props
}
