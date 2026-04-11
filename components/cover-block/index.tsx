'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import SimpleText from '@/components/simple-text'
import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import { urlFor } from '@/sanity/lib/image'

import type {
  CoverBlockImage,
  CoverBlockImageMobile,
  CoverBlockProps,
} from '@/types/components/cover-block-type'

const DEFAULT_AUTO_IMAGE_ASPECT = '16 / 9'

function imageDimensionsToAspectCss(
  img?: CoverBlockImage | CoverBlockImageMobile | null | undefined
): string | undefined {
  const dims = img?.asset?.metadata?.dimensions
  if (!dims) return undefined
  const w = Number(dims.width)
  const h = Number(dims.height)
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return undefined
  return `${w} / ${h}`
}

export default function CoverBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundType = 'image',
  image,
  imageMobile,
  backgroundColor = 'black',
  height = 'half',
  overlayColor = 'none',
  overlayOpacity = 50,
  contentPosition = 'center',
  contentHalfWidth = false,
  content,
  cta,
}: CoverBlockProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isAutoHeight = height === 'auto'
  const heightClass =
    height === 'full'
      ? 'min-h-screen'
      : height === 'half'
        ? 'min-h-[50vh]'
        : isAutoHeight && backgroundType === 'color'
          ? 'min-h-[50vh]'
          : isAutoHeight
            ? ''
            : 'min-h-[50vh]'

  const bgClass =
    backgroundColor === 'black'
      ? 'bg-foreground text-background'
      : backgroundColor === 'primary'
        ? 'bg-primary text-primary-foreground'
        : 'bg-background text-foreground'

  const overlayColorValue =
    overlayColor === 'black'
      ? 'var(--foreground)'
      : overlayColor === 'primary'
        ? 'var(--primary)'
        : overlayColor === 'white'
          ? 'var(--background)'
          : undefined

  const effectiveColor =
    backgroundType === 'image' ? overlayColor : backgroundColor
  const contentTextClass =
    effectiveColor === 'black'
      ? 'text-background'
      : effectiveColor === 'primary'
        ? 'text-primary-foreground'
        : 'text-foreground'
  const buttonVariant = effectiveColor === 'primary' ? 'secondary' : 'default'

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

  const getBackgroundImageUrl = (
    img: CoverBlockImage | CoverBlockImageMobile | null | undefined,
    mobile = false
  ): string | undefined => {
    if (!img?.asset?.url) return undefined
    const w = mobile ? 768 : 1920
    const h = mobile ? 432 : 1080
    return urlFor(img).width(w).height(h).quality(82).auto('format').fit('scale').url()
  }

  const getBackgroundPosition = (
    img: CoverBlockImage | CoverBlockImageMobile | null | undefined
  ) => {
    if (!img?.hotspot || img.hotspot.x == null || img.hotspot.y == null) return 'center'
    const x = img.hotspot.x * 100
    const y = img.hotspot.y * 100
    return `${x}% ${y}%`
  }

  const backgroundImageUrl =
    backgroundType === 'image' ? getBackgroundImageUrl(image, false) : undefined

  const mobileBackgroundImageUrl =
    backgroundType === 'image'
      ? getBackgroundImageUrl(imageMobile ?? image ?? undefined, true)
      : undefined
  const backgroundPosition =
    backgroundType === 'image' ? getBackgroundPosition(image) : 'center'
  const mobileBackgroundPosition =
    backgroundType === 'image' ? getBackgroundPosition(imageMobile ?? image) : 'center'

  const isFirstBlock = componentIndex === 0

  useEffect(() => {
    if (!active || backgroundType !== 'image' || !isFirstBlock || !backgroundImageUrl) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = backgroundImageUrl
    document.head.appendChild(link)
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
    }
  }, [active, backgroundType, isFirstBlock, backgroundImageUrl])

  if (!active) return null

  let sectionAspectStyle: CSSProperties | undefined
  if (isAutoHeight && backgroundType === 'image') {
    const activeImage =
      isMobile && imageMobile?.asset?.url ? imageMobile : image
    sectionAspectStyle = {
      aspectRatio:
        imageDimensionsToAspectCss(activeImage) ?? DEFAULT_AUTO_IMAGE_ASPECT,
    }
  }

  const sectionStyle: CSSProperties = {
    backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition,
    backgroundRepeat: 'no-repeat',
    ...sectionAspectStyle,
  }

  return (
    <section
      id={anchor || `cover-block-${componentIndex}`}
      className={`cover-block w-full relative px-5 py-24 ${heightClass} flex ${positionClass} ${backgroundType === 'color' ? bgClass : ''}`}
      style={sectionStyle}
    >
      {backgroundType === 'image' && mobileBackgroundImageUrl && (
        <div
          className="md:hidden absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${mobileBackgroundImageUrl})`,
            backgroundPosition: mobileBackgroundPosition,
          }}
        />
      )}

      {backgroundType === 'image' && overlayColor && overlayColor !== 'none' && overlayColorValue && (
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: overlayColorValue,
            opacity: (overlayOpacity ?? 50) / 100,
          }}
        />
      )}

      <div className="relative z-20 w-full container mx-auto">
        <div
          className={`transition-all duration-300 ${contentHalfWidth ? 'md:max-w-[50%]' : ''}`}
        >
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
