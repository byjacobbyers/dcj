'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import MuxPlayer from '@mux/mux-player-react'

import type { VideoBlockProps } from '@/types/components/video-block-type'

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

export default function VideoBlock({
  active = true,
  componentIndex = 0,
  anchor,
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
      className="video-block w-full flex justify-center px-5 py-16 md:py-24"
    >
      <motion.div
        className={`w-full ${maxWidth} mx-auto`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
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
      </motion.div>
    </section>
  )
}
