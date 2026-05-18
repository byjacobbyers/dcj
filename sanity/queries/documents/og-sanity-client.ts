import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

/** Same client strategy as public /api/og: drafts in dev when token is set. */
export function getOgSanityClient() {
  const token = process.env.SANITY_VIEWER_TOKEN?.trim()
  if (process.env.NODE_ENV === 'development' && token) {
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
      perspective: 'previewDrafts',
    })
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  })
}
