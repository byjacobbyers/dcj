import { createClient } from 'next-sanity'

import { getPublicSiteUrl } from '@/lib/site-url'
import { apiVersion, dataset, projectId } from '../env'

const getStudioUrl = () => {
  if (process.env.NEXT_PUBLIC_SANITY_STUDIO_URL) {
    return process.env.NEXT_PUBLIC_SANITY_STUDIO_URL
  }
  return `${getPublicSiteUrl()}/studio`
}

/**
 * Enum-like fields that drive styling/logic branches in components.
 * Stega's invisible characters would break string comparisons, so these
 * are excluded from encoding at the source instead of cleaned per component.
 */
const STEGA_LOGIC_FIELDS = new Set([
  // `anchor` generates in-page link targets, so an encoded copy would not
  // match the href it is compared against.
  'anchor',
  'backgroundColor',
  'backgroundType',
  'contentAlignment',
  'contentPosition',
  'contentLayout',
  'display',
  'sectionPadding',
  'height',
  'imagesPerRow',
  'layout',
  'overlayColor',
  'size',
  'variant',
  'videoProvider',
])

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // No `enabled: true`: defineLive turns stega on only for draft-mode fetches.
  stega: {
    studioUrl: getStudioUrl(),
    filter: (props) => {
      const key = props.sourcePath.at(-1)
      if (typeof key === 'string' && STEGA_LOGIC_FIELDS.has(key)) return false
      return props.filterDefault(props)
    },
  },
})
