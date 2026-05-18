import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/sanity/lib/image'
import type { OgRouteDoc } from '@/lib/og-image-response'

export function getShareGraphicRedirectUrl(doc: OgRouteDoc | null): string | null {
  const share = doc?.seo?.shareGraphic
  if (
    share &&
    typeof share === 'object' &&
    'asset' in share &&
    share.asset &&
    typeof share.asset === 'object' &&
    share.asset !== null &&
    'url' in share.asset &&
    typeof share.asset.url === 'string'
  ) {
    return urlFor(share as SanityImageSource).width(1200).height(630).url()
  }
  return null
}
