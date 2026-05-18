import { createClient } from 'next-sanity'

import { getPublicSiteUrl } from '@/lib/site-url'
import { apiVersion, dataset, projectId } from '../env'

const getStudioUrl = () => {
  if (process.env.NEXT_PUBLIC_SANITY_STUDIO_URL) {
    return process.env.NEXT_PUBLIC_SANITY_STUDIO_URL
  }
  return `${getPublicSiteUrl()}/studio`
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl: getStudioUrl(),
    enabled: true,
  },
})
