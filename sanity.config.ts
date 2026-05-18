'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/studio` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { codeInput } from '@sanity/code-input'
import { presentationTool } from 'sanity/presentation'
import { muxInput } from 'sanity-plugin-mux-input'
import { media } from 'sanity-plugin-media'

import { getPublicSiteUrl } from './lib/site-url'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemas'
import { structure } from './sanity/structure'

const baseUrl = getPublicSiteUrl()

export default defineConfig({
  name: 'default',
  title: 'Denver Contact Jam',
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    codeInput(),
    media(),
    muxInput(),
    presentationTool({
      previewUrl: {
        origin:
          process.env.SANITY_STUDIO_PREVIEW_ORIGIN?.replace(/\/+$/, '') || baseUrl,
        preview: '/',
        draftMode: { enable: '/api/draft-mode/enable' },
      },
      resolve: {
        locations: {
          page: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: doc?.slug === 'home' ? '/' : `/${doc?.slug || ''}`,
                },
              ],
            }),
          },
          event: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: `/events/${doc?.slug || ''}`,
                },
              ],
            }),
          },
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((template) => template.templateId !== 'mux.videoAsset')
      }
      return prev
    },
  },
})
