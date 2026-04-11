'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import SimpleText from '@/components/simple-text'
import { Button } from '@/components/ui/button'
import Route from '@/components/route'

import type { CoverVideoProps } from '@/types/components/cover-video-type'

function aspectRatioToCss(ratio?: string | null): string | undefined {
  if (!ratio || typeof ratio !== 'string') return undefined
  const parts = ratio.split(':').map((s) => parseFloat(s.trim()))
  if (
    parts.length !== 2 ||
    !Number.isFinite(parts[0]) ||
    !Number.isFinite(parts[1]) ||
    parts[0] <= 0 ||
    parts[1] <= 0
  ) {
    return undefined
  }
  return `${parts[0]} / ${parts[1]}`
}

const DEFAULT_AUTO_ASPECT = '16 / 9'

export default function CoverVideo({
  active = true,
  componentIndex = 0,
  anchor,
  videoProvider = 'mux',
  muxUrl,
  muxUrlMobile,
  vimeoUrl,
  vimeoUrlMobile,
  height = 'half',
  overlayColor = 'none',
  overlayOpacity = 50,
  contentPosition = 'center',
  contentHalfWidth = false,
  content,
  cta,
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
}: CoverVideoProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!active) return null

  const isAutoHeight = height === 'auto'
  const heightClass =
    height === 'full'
      ? 'min-h-screen'
      : height === 'half'
        ? 'min-h-[50vh]'
        : isAutoHeight
          ? ''
          : 'min-h-[50vh]'

  const overlayColorValue =
    overlayColor === 'black'
      ? 'var(--foreground)'
      : overlayColor === 'primary'
        ? 'var(--primary)'
        : overlayColor === 'white'
          ? 'var(--background)'
          : undefined

  const contentTextClass =
    overlayColor === 'black'
      ? 'text-background'
      : overlayColor === 'primary'
        ? 'text-primary-foreground'
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
  const positionClass = positionClasses[contentPosition] || 'items-center justify-center text-center'

  const muxPlaybackId =
    videoProvider === 'mux'
      ? isMobile && muxUrlMobile?.asset?.playbackId
        ? muxUrlMobile.asset.playbackId
        : muxUrl?.asset?.playbackId
      : null

  const vimeoUrlValue =
    videoProvider === 'vimeo'
      ? isMobile && vimeoUrlMobile
        ? vimeoUrlMobile
        : vimeoUrl ?? null
      : null

  if (!muxPlaybackId && !vimeoUrlValue) return null

  let sectionAspectStyle: CSSProperties | undefined
  if (isAutoHeight) {
    if (videoProvider === 'mux' && muxPlaybackId) {
      const asset =
        isMobile && muxUrlMobile?.asset?.playbackId ? muxUrlMobile.asset : muxUrl?.asset
      sectionAspectStyle = {
        aspectRatio: aspectRatioToCss(asset?.data?.aspect_ratio) ?? DEFAULT_AUTO_ASPECT,
      }
    } else {
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
      className={`cover-video w-full relative px-5 py-24 ${heightClass} flex ${positionClass} overflow-hidden`}
      style={sectionAspectStyle}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoProvider === 'mux' && muxPlaybackId ? (
          <MuxPlayer
            playbackId={muxPlaybackId}
            streamType="on-demand"
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            className={`h-full w-full object-cover ${controls ? '' : '[&::part(controls)]:hidden'}`}
          />
        ) : videoProvider === 'vimeo' && vimeoUrlValue ? (
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
        <div className={`transition-all duration-300 ${contentHalfWidth ? 'md:max-w-[50%]' : ''}`}>
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
        </div>
      </div>
    </section>
  )
}
