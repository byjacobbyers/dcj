'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import SanityImage from '@/components/sanity-image'
import SimpleText from '@/components/simple-text'

import type { HeroBlockProps } from '@/types/components/hero-block-type'

export default function HeroBlock({
  active = true,
  componentIndex = 0,
  layout = 'image-right',
  anchor,
  image,
  content,
  cta,
}: HeroBlockProps) {
  if (!active) return null

  const layoutClass = layout === 'image-left' ? 'md:flex-row-reverse' : 'md:flex-row'

  return (
    <section
      id={anchor || `hero-block-${componentIndex}`}
      className="hero-block w-full flex justify-center px-5"
    >
      <div
        className={`container flex flex-wrap md:flex-nowrap ${layoutClass} flex-col-reverse items-center w-full gap-10`}
      >
        <motion.div
          className="w-full md:w-1/2 flex flex-col gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: componentIndex !== 0 ? 0.5 : 0 }}
        >
          {content ? (
            <div className="content">
              <SimpleText content={content} />
            </div>
          ) : null}
          {cta?.active && cta?.route ? (
            <div className='flex'>
              <Button asChild variant="default" className="mt-5">
                <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                  {(cta.route as { title?: string }).title || 'Learn More'}
                </Route>
              </Button>
            </div>
          ) : null}
        </motion.div>
        <motion.div
          className="w-full md:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: componentIndex !== 0 ? 0.5 : 0 }}
        >
          {image ? (
            <SanityImage
              image={image}
              fill={false}
              alt={image.alt || 'Hero'}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
