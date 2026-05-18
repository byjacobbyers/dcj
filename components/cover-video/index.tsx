'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import SimpleText from '@/components/simple-text'
import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import { normalizeCoverOverlay } from '@/lib/cover-overlay'
import { cleanStega } from '@/lib/stega'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { CoverVideoProps } from '@/types/components/cover-video-type'
import { normalizeSectionContentLayout } from '@/lib/section-content-layout'
import { Card } from '@/components/ui/card'

/** Mux `aspect_ratio` is typically `16:9` or `1920:1080`; also tolerates `/` and `x` delimiters (and stega). */
function aspectRatioToCss(ratio?: string | null): string | undefined {
  if (ratio == null || typeof ratio !== 'string') return undefined
  const normalized = cleanStega(ratio).replace(/\s+/g, '')
  if (!normalized) return undefined
  const match = normalized.match(/^([\d.]+)[:xX/]([\d.]+)$/)
  if (!match) return undefined
  const w = parseFloat(match[1])
  const h = parseFloat(match[2])
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return undefined
  return `${w} / ${h}`
}

const DEFAULT_AUTO_ASPECT = '16 / 9'

export default function CoverVideo({
  active = true,
  componentIndex = 0,
  sectionPadding,
  anchor,
  contentLayout,
  backgroundColor,
  videoProvider = 'mux',
  muxUrl,
  muxUrlMobile,
  vimeoUrl,
  vimeoUrlMobile,
  height = 'half',
  overlayColor: overlayColorRaw = 'none',
  overlayOpacity = 50,
  contentPosition = 'center',
  content,
  cta,
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
}: CoverVideoProps) {
  const [isMobile, setIsMobile] = useState(false)
  const bg = normalizeSectionBackground(backgroundColor)
  const overlayColor = normalizeCoverOverlay(overlayColorRaw as string | undefined)
  const layout = normalizeSectionContentLayout(contentLayout)

  const videoProviderValue =
    cleanStega(typeof videoProvider === 'string' ? videoProvider : 'mux') === 'vimeo'
      ? 'vimeo'
      : 'mux'
  const heightValue: 'auto' | 'full' | 'half' = (() => {
    const h = cleanStega(typeof height === 'string' ? height : 'half')
    if (h === 'full') return 'full'
    if (h === 'auto') return 'auto'
    return 'half'
  })()
  const contentPositionValue =
    cleanStega(typeof contentPosition === 'string' ? contentPosition : 'center') || 'center'

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!active) return null

  const isAutoHeight = heightValue === 'auto'
  const heightClass =
    heightValue === 'full'
      ? 'min-h-[75vh]'
      : heightValue === 'half'
        ? 'min-h-[50vh]'
        : isAutoHeight
          ? ''
          : 'min-h-[50vh]'

  const overlayColorValue =
    overlayColor === 'primary'
      ? 'var(--primary)'
      : overlayColor === 'secondary'
        ? 'var(--secondary)'
        : overlayColor === 'black'
          ? '#000000'
          : undefined

  const contentTextClass =
    overlayColor === 'primary'
      ? 'text-primary-foreground'
      : overlayColor === 'secondary'
        ? 'text-secondary-foreground'
        : overlayColor === 'black'
          ? 'text-white'
          : 'text-foreground'

  const buttonVariant = overlayColor === 'primary' ? 'secondary' : 'default'

  const positionClasses: Record<string, string> = {
    'top-left': 'items-start justify-start text-left',
    'top-center': 'items-start justify-center text-center',
    'top-right': 'items-start justify-end text-right',
    'center-left': 'items-center justify-start text-left',
    center: 'items-center justify-center text-center',
    'center-right': 'items-center justify-end text-right',
    'bottom-left': 'items-end justify-start text-left',
    'bottom-center': 'items-end justify-center text-center',
    'bottom-right': 'items-end justify-end text-right',
  }
  const positionClass =
    positionClasses[contentPositionValue] || 'items-center justify-center text-center'

  const muxPlaybackId =
    videoProviderValue === 'mux'
      ? isMobile && muxUrlMobile?.asset?.playbackId
        ? muxUrlMobile.asset.playbackId
        : muxUrl?.asset?.playbackId
      : null

  const vimeoUrlValue =
    videoProviderValue === 'vimeo'
      ? isMobile && vimeoUrlMobile
        ? vimeoUrlMobile
        : vimeoUrl ?? null
      : null

  if (!muxPlaybackId && !vimeoUrlValue) return null

  let sectionAspectStyle: CSSProperties | undefined
  if (isAutoHeight) {
    if (videoProviderValue === 'mux' && muxPlaybackId) {
      const asset =
        isMobile && muxUrlMobile?.asset?.playbackId ? muxUrlMobile.asset : muxUrl?.asset
      sectionAspectStyle = {
        aspectRatio: aspectRatioToCss(asset?.data?.aspect_ratio) ?? DEFAULT_AUTO_ASPECT,
      }
    } else {
      // Vimeo (no aspect_ratio in query) or edge cases — typical widescreen default
      sectionAspectStyle = { aspectRatio: DEFAULT_AUTO_ASPECT }
    }
  }

  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : null
  }

  return (
    <section
      id={anchor || `cover-video-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'cover-video w-full relative px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default'),
        heightClass,
        'flex',
        positionClass,
        'overflow-hidden'
      )}
      style={sectionAspectStyle}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoProviderValue === 'mux' && muxPlaybackId ? (
          <MuxPlayer
            playbackId={muxPlaybackId}
            streamType="on-demand"
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            className={`h-full w-full object-cover ${controls ? '' : '[&::part(controls)]:hidden'}`}
          />
        ) : videoProviderValue === 'vimeo' && vimeoUrlValue ? (
          (() => {
            const videoId = getVimeoId(vimeoUrlValue)
            if (!videoId) return null
            const params = new URLSearchParams({
              autoplay: autoplay ? '1' : '0',
              loop: loop ? '1' : '0',
              muted: muted ? '1' : '0',
              controls: controls ? '1' : '0',
              background: '1',
            })
            return (
              <iframe
                src={`https://player.vimeo.com/video/${videoId}?${params}`}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100vw',
                  height: '100vh',
                  transform: 'translate(-50%, -50%)',
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Vimeo video background"
              />
            )
          })()
        ) : null}
      </div>

      {overlayColor && overlayColor !== 'none' && overlayColorValue && (
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: overlayColorValue,
            opacity: (overlayOpacity ?? 50) / 100,
          }}
        />
      )}

      <div className="relative z-20 w-full container mx-auto">
        {layout === 'card' ? (
          <Card className="w-full">
            {content && Array.isArray(content) && content.length > 0 ? (
              <div className={`content ${contentTextClass}`}>
                <SimpleText content={content} />
              </div>
            ) : null}
            {cta?.active && cta?.route ? (
              <div className="mt-6">
                <Button asChild variant={buttonVariant}>
                  <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                    {(cta.route as { title?: string }).title || 'Learn More'}
                  </Route>
                </Button>
              </div>
            ) : null}
          </Card>
        ) : (
          <>
            {content && Array.isArray(content) && content.length > 0 ? (
              <div className={`content ${contentTextClass}`}>
                <SimpleText content={content} />
              </div>
            ) : null}
            {cta?.active && cta?.route ? (
              <div className="mt-6">
                <Button asChild variant={buttonVariant}>
                  <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                    {(cta.route as { title?: string }).title || 'Learn More'}
                  </Route>
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
