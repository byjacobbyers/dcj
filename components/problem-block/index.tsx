'use client'

import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { LuClock, LuCode, LuLayers } from 'react-icons/lu'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import type {
  ProblemBlockIcon,
  ProblemBlockProps,
  ProblemColumnVisualProps,
} from '@/types/components/problem-block-type'

const PROBLEM_ICONS: Record<ProblemBlockIcon, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  LuClock,
  LuCode,
  LuLayers,
}

function ProblemColumnVisual({ column }: ProblemColumnVisualProps) {
  if (column.image) {
    return (
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <SanityImage image={column.image} fill sizes="48px" className="object-contain" />
      </div>
    )
  }
  const key = column.icon as ProblemBlockIcon | undefined
  if (key && PROBLEM_ICONS[key]) {
    const Icon = PROBLEM_ICONS[key]
    return <Icon className="h-12 w-12 shrink-0 text-destructive" aria-hidden />
  }
  return null
}

export default function ProblemBlock({
  active = true,
  componentIndex = 0,
  anchor,
  content,
  columns = [],
  excerpt,
}: ProblemBlockProps) {
  if (!active || !columns?.length) return null

  return (
    <section
      id={anchor || `problem-block-${componentIndex}`}
      className="problem-block w-full px-5 py-16 md:py-24 flex justify-center"
    >
      <div className="container flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex w-full flex-col items-center justify-center text-center"
        >
          {content && Array.isArray(content) && content.length > 0 ? (
            <div className="content mb-10 flex w-full justify-center text-balance">
              <SimpleText content={content} />
            </div>
          ) : null}

          <div className="flex w-full flex-wrap justify-center gap-x-6 gap-y-24 py-16 lg:mx-auto lg:max-w-[75vw] lg:flex-nowrap lg:justify-center">
            {columns.map((column, i) => (
              <div
                key={column._key ?? `problem-column-${i}`}
                className="mx-auto flex w-full max-w-md flex-col items-center gap-4 text-center sm:mx-0 sm:w-[calc(50%-0.75rem)] lg:mx-0 lg:w-auto lg:min-w-0 lg:max-w-none lg:flex-1 lg:basis-0"
              >
                <ProblemColumnVisual column={column} />
                {column.content && Array.isArray(column.content) ? (
                  <div className="content max-w-sm flex w-full justify-center text-balance">
                    <SimpleText content={column.content} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {excerpt && Array.isArray(excerpt) && excerpt.length > 0 ? (
            <div className="content mt-10 flex w-full justify-center">
              <SimpleText content={excerpt} />
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
