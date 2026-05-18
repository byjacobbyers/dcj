'use client'

import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portable-text-components'
import type { NormalTextProps } from '@/types/components/normal-text-type'

export default function NormalText({ content }: NormalTextProps) {
  if (!content || !Array.isArray(content) || content.length === 0) return null

  return (
    <PortableText
      value={content as Parameters<typeof PortableText>[0]['value']}
      components={portableTextComponents}
    />
  )
}
