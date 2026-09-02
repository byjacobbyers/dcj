'use client'

/**
 * Live preview uses POST /api/og/preview with the **current form** heading/background
 * so it matches the editor without waiting for Sanity to persist. Debounced to limit work.
 * Production metadata still uses GET /api/og (CMS state only).
 */

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { ObjectInputProps } from 'sanity'
import { useFormValue } from 'sanity'
import { Stack, Text, Box, Spinner } from '@sanity/ui'
import { getPublicSiteUrl } from '@/lib/site-url'
import { hasPortableHeading } from '@/lib/og-simple-text'

function normalizeOrigin(url: string): string {
  return url.replace(/\/+$/, '')
}

/** Never changes after mount, so nothing to subscribe to. */
const subscribeToNothing = () => () => {}

/** Prefer the tab’s origin so /api/og/preview hits the same Next app as Studio (avoids env pointing at prod + 307 to CDN + CORS on blob). */
function usePreviewOrigin(): string {
  return useSyncExternalStore(
    subscribeToNothing,
    () => normalizeOrigin(window.location.origin),
    () => normalizeOrigin(getPublicSiteUrl())
  )
}

function readSlug(doc: Record<string, unknown> | undefined): string {
  if (!doc) return ''
  const slug = doc.slug as { current?: string } | undefined
  return typeof slug?.current === 'string' ? slug.current : ''
}

const PREVIEW_DEBOUNCE_MS = 380

export default function AutoShareImageInput(props: ObjectInputProps) {
  const { value, renderDefault } = props
  const document = useFormValue([]) as Record<string, unknown> | undefined
  const docType = document?._type as string | undefined
  const slug = readSlug(document)

  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const blobUrlRef = useRef<string | null>(null)

  const origin = usePreviewOrigin()
  const canPreview =
    (docType === 'page' || docType === 'event' || docType === 'post') && slug.length > 0

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [])

  const docTitle =
    typeof document?.title === 'string' ? document.title : ''

  useEffect(() => {
    if (!canPreview || !origin) {
      setPreviewSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        blobUrlRef.current = null
        return null
      })
      setPreviewLoading(false)
      return
    }

    let cancelled = false
    let abort: AbortController | null = null
    const timer = window.setTimeout(() => {
      abort = new AbortController()
      setPreviewLoading(true)

      const body = {
        slug,
        type: docType,
        title: docTitle,
        heading: (value as { heading?: unknown } | undefined)?.heading,
        background: (value as { background?: string } | undefined)?.background,
      }

      fetch(`${origin}/api/og/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abort.signal,
        redirect: 'manual',
      })
        .then((res) => {
          if (res.status >= 300 && res.status < 400) {
            throw new Error(
              `Unexpected redirect ${res.status} from OG preview (try restarting dev server so /api/og/preview has the latest handler)`
            )
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.blob()
        })
        .then((blob) => {
          if (cancelled) return
          const url = URL.createObjectURL(blob)
          setPreviewSrc((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            blobUrlRef.current = url
            return url
          })
        })
        .catch((e) => {
          if (cancelled || (e instanceof Error && e.name === 'AbortError')) return
          setPreviewSrc((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            blobUrlRef.current = null
            return null
          })
        })
        .finally(() => {
          if (!cancelled) setPreviewLoading(false)
        })
    }, PREVIEW_DEBOUNCE_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      abort?.abort()
    }
  }, [canPreview, origin, slug, docType, docTitle, value])

  const staticOgUrl =
    canPreview && origin
      ? `${origin}/api/og?slug=${encodeURIComponent(slug)}&type=${encodeURIComponent(docType!)}`
      : null

  const headingEmpty = !hasPortableHeading((value as { heading?: unknown } | undefined)?.heading)
  const titleFallback = docTitle.trim().length > 0 ? docTitle.trim() : null

  return (
    <Stack space={4}>
      {docType === 'site' ? (
        <Text size={1} muted>
          Defaults here apply to auto-generated share images on pages, posts, and events. Open one of
          those documents to see a live preview. You can also open{' '}
          <a href={`${origin}/api/og?slug=home&type=page`} target="_blank" rel="noreferrer">
            /api/og?slug=home&amp;type=page
          </a>{' '}
          if your home page uses the <code>home</code> slug.
        </Text>
      ) : !canPreview ? (
        <Text size={1} muted>
          Save the document with a slug to preview the share image (requires the Next site running so{' '}
          <code>/api/og</code> is available).
        </Text>
      ) : (
        <Box>
          <Text size={1} weight="semibold" style={{ marginBottom: 8 }}>
            Preview (live form, debounced)
          </Text>
          <Text size={1} muted style={{ marginBottom: 8 }}>
            Matches the fields below before publish. Production sharing still uses{' '}
            <a href={staticOgUrl ?? '#'} target="_blank" rel="noreferrer">
              GET /api/og
            </a>
            .
            {headingEmpty && titleFallback
              ? ` Empty heading → document title as H2 (“${titleFallback}”).`
              : null}
          </Text>
          <Box
            padding={2}
            style={{
              border: '1px solid var(--card-border-color)',
              borderRadius: 4,
              background: 'var(--card-bg-color)',
              position: 'relative',
              minHeight: 120,
            }}
          >
            {previewLoading ? (
              <Box padding={4} style={{ display: 'flex', justifyContent: 'center' }}>
                <Spinner />
              </Box>
            ) : null}
            {previewSrc ? (
              /* eslint-disable-next-line @next/next/no-img-element -- Studio preview blob URL */
              <img
                src={previewSrc}
                alt=""
                width={600}
                height={315}
                style={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  display: 'block',
                  borderRadius: 2,
                  opacity: previewLoading ? 0.55 : 1,
                }}
              />
            ) : !previewLoading ? (
              <Text size={1} muted>
                Could not load preview. Ensure the site is running and the slug exists in Sanity.
              </Text>
            ) : null}
          </Box>
        </Box>
      )}

      {renderDefault(props)}
    </Stack>
  )
}
