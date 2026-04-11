'use client'

import { motion } from 'framer-motion'
import SanityImage from '@/components/sanity-image'

import type { ImageBlockProps } from '@/types/components/image-block-type'

export default function ImageBlock({
  active = true,
  componentIndex = 0,
  anchor,
  image,
  imageMobile,
  maxWidth = 'max-w-2xl',
}: ImageBlockProps) {
  if (!active) return null

  const mobileImage = imageMobile ?? image

  return (
    <section
      id={anchor || `image-block-${componentIndex}`}
      className="image-block w-full flex justify-center px-5 py-16 md:py-24"
    >
      <div className="container flex flex-col items-center gap-6">
        {image || mobileImage ? (
          <motion.div
            className={`relative w-full ${maxWidth} mx-auto`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {image ? (
              <div className="hidden md:block relative w-full">
                <SanityImage
                  image={image}
                  fill={false}
                  alt={image.alt || 'Hero'}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : null}
            {mobileImage ? (
              <div className="md:hidden relative w-full">
                <SanityImage
                  image={mobileImage}
                  fill={false}
                  alt={(mobileImage as { alt?: string }).alt || 'Hero'}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
