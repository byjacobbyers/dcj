'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import SimpleText from '@/components/simple-text'
import { ImagePlaceholder } from '@/components/sanity-image/placeholder'
import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import { urlFor } from '@/sanity/lib/image'
import { normalizeCoverOverlay } from '@/lib/cover-overlay'
import { cleanStega } from '@/lib/stega'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { normalizeSectionContentLayout } from '@/lib/section-content-layout'
import type {
  CoverBlockImage,
  CoverBlockImageMobile,
  CoverBlockProps,
} from '@/types/components/cover-block-type'
import { Card } from '@/components/ui/card'

const DEFAULT_AUTO_IMAGE_ASPECT = '16 / 9'

/** Coerce API strings to current CMS values; unknown values default to transparent. */
function normalizeCoverBg(raw: string | undefined): 'primary' | 'secondary' | 'transparent' {
  const v = cleanStega(raw ?? '')
  if (v === 'primary' || v === 'secondary' || v === 'transparent') return v
  return 'transparent'
}

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
  sectionPadding,
  anchor,
  contentLayout,
  backgroundType = 'image',
  image,
  imageMobile,
  backgroundColor: backgroundColorRaw = 'transparent',
  height = 'half',
  overlayColor: overlayColorRaw = 'none',
  overlayOpacity = 50,
  contentPosition = 'center',
  contentHalfWidth = false,
  content,
  cta,
}: CoverBlockProps) {
  const [isMobile, setIsMobile] = useState(false)

  const backgroundTypeValue =
    cleanStega(typeof backgroundType === 'string' ? backgroundType : 'image') === 'color'
      ? 'color'
      : 'image'
  const heightValue: 'auto' | 'full' | 'half' = (() => {
    const h = cleanStega(typeof height === 'string' ? height : 'half')
    if (h === 'full') return 'full'
    if (h === 'auto') return 'auto'
    return 'half'
  })()
  const contentPositionValue =
    cleanStega(typeof contentPosition === 'string' ? contentPosition : 'center') || 'center'

  const backgroundColor = normalizeCoverBg(backgroundColorRaw as string | undefined)
  const overlayColor = normalizeCoverOverlay(overlayColorRaw as string | undefined)
  const layout = normalizeSectionContentLayout(contentLayout)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isAutoHeight = heightValue === 'auto'
  const heightClass =
    heightValue === 'full'
      ? 'min-h-[75vh]'
      : heightValue === 'half'
        ? 'min-h-[50vh]'
        : isAutoHeight && backgroundTypeValue === 'color'
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
    backgroundTypeValue === 'image'
      ? overlayColor === 'primary'
        ? 'text-primary-foreground'
        : overlayColor === 'secondary'
          ? 'text-secondary-foreground'
          : overlayColor === 'black'
            ? 'text-white'
            : 'text-foreground'
      : 'text-foreground'

  const buttonVariant =
    backgroundTypeValue === 'color'
      ? backgroundColor === 'secondary'
        ? 'secondary'
        : 'default'
      : overlayColor === 'primary'
        ? 'secondary'
        : 'default'

  const buttonSize =
    backgroundTypeValue === 'color' &&
    (backgroundColor === 'primary' || backgroundColor === 'transparent')
      ? 'lg'
      : 'default'

  const colorSurfaceProps =
    backgroundTypeValue === 'color'
      ? {
          'data-background-color': backgroundColor,
          ...(backgroundColor === 'primary' || backgroundColor === 'secondary'
            ? { 'data-surface': backgroundColor as 'primary' | 'secondary' }
            : {}),
        }
      : {}

  const colorBgClass =
    backgroundTypeValue === 'color'
      ? backgroundColor === 'transparent'
        ? 'bg-transparent text-foreground'
        : 'bg-background text-foreground'
      : ''

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

  const getBackgroundImageUrl = (
    img: CoverBlockImage | null | undefined,
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
    backgroundTypeValue === 'image' ? getBackgroundImageUrl(image, false) : undefined

  const mobileBackgroundImageUrl =
    backgroundTypeValue === 'image'
      ? getBackgroundImageUrl(imageMobile ?? image ?? undefined, true)
      : undefined
  const backgroundPosition =
    backgroundTypeValue === 'image' ? getBackgroundPosition(image) : 'center'
  const mobileBackgroundPosition =
    backgroundTypeValue === 'image' ? getBackgroundPosition(imageMobile ?? image) : 'center'

  const isFirstBlock = componentIndex === 0

  useEffect(() => {
    if (
      !active ||
      backgroundTypeValue !== 'image' ||
      !isFirstBlock ||
      !backgroundImageUrl
    )
      return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = backgroundImageUrl
    document.head.appendChild(link)
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
    }
  }, [active, backgroundTypeValue, isFirstBlock, backgroundImageUrl])

  if (!active) return null

  let sectionAspectStyle: CSSProperties | undefined
  if (isAutoHeight && backgroundTypeValue === 'image') {
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

  const showImageBgFallback =
    backgroundTypeValue === 'image' && !backgroundImageUrl && !mobileBackgroundImageUrl

  return (
    <section
      id={anchor || `cover-block-${componentIndex}`}
      className={`cover-block w-full relative px-5 ${sectionPaddingToClass(sectionPadding, 'default')} ${heightClass} flex ${positionClass} ${colorBgClass}`}
      style={sectionStyle}
      {...colorSurfaceProps}
    >
      {showImageBgFallback ? (
        <ImagePlaceholder
          variant="grey"
          fill
          className="z-5"
          alt="Background image unavailable"
        />
      ) : null}
      {backgroundTypeValue === 'image' && mobileBackgroundImageUrl && (
        <div
          className="md:hidden absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${mobileBackgroundImageUrl})`,
            backgroundPosition: mobileBackgroundPosition,
          }}
        />
      )}

      {backgroundTypeValue === 'image' && overlayColor !== 'none' && overlayColorValue && (
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
        {layout === 'card' ? (
          <Card className="w-full">
            {content && Array.isArray(content) && content.length > 0 ? (
              <div className={`content ${contentTextClass}`}>
                <SimpleText content={content} />
              </div>
            ) : null}
            {cta?.active && cta?.route ? (
              <div className="mt-6">
                <Button asChild variant={buttonVariant} size={buttonSize}>
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
                <Button asChild variant={buttonVariant} size={buttonSize}>
                  <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                    {(cta.route as { title?: string }).title || 'Learn More'}
                  </Route>
                </Button>
              </div>
            ) : null}
          </>
        )}
        </div>
      </div>
    </section>
  )
}
