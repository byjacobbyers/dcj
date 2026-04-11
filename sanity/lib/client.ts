import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

const getStudioUrl = () => {
  if (process.env.NEXT_PUBLIC_SANITY_STUDIO_URL) {
    return process.env.NEXT_PUBLIC_SANITY_STUDIO_URL
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${siteUrl}/studio`
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
