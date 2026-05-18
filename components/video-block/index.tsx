'use client'

import { useEffect, useState } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { normalizeSectionContentLayout } from '@/lib/section-content-layout'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { VideoBlockProps } from '@/types/components/video-block-type'
import { Card } from '@/components/ui/card'

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

export default function VideoBlock({
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
  maxWidth = 'max-w-2xl',
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
}: VideoBlockProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!active) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const layout = normalizeSectionContentLayout(contentLayout)

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

  return (
    <section
      id={anchor || `video-block-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'video-block w-full flex justify-center px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default')
      )}
    >
      <div className={`w-full ${maxWidth} mx-auto`}>
        {layout === 'card' ? (
          <Card className="w-full gap-0 p-0 py-0">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border bg-muted">
              {videoProvider === 'mux' && muxPlaybackId ? (
                <MuxPlayer
                  playbackId={muxPlaybackId}
                  streamType="on-demand"
                  autoPlay={autoplay}
                  loop={loop}
                  muted={muted}
                  className={`h-full w-full object-contain ${controls ? '' : '[&::part(controls)]:hidden'}`}
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
                  })
                  return (
                    <iframe
                      src={`https://player.vimeo.com/video/${videoId}?${params}`}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="Vimeo video"
                    />
                  )
                })()
              ) : null}
            </div>
          </Card>
        ) : (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
            {videoProvider === 'mux' && muxPlaybackId ? (
              <MuxPlayer
                playbackId={muxPlaybackId}
                streamType="on-demand"
                autoPlay={autoplay}
                loop={loop}
                muted={muted}
                className={`h-full w-full object-contain ${controls ? '' : '[&::part(controls)]:hidden'}`}
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
                })
                return (
                  <iframe
                    src={`https://player.vimeo.com/video/${videoId}?${params}`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Vimeo video"
                  />
                )
              })()
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
