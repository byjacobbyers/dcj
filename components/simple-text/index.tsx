'use client'

import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portable-text-components'

import type { SimpleTextProps } from '@/types/components/simple-text-type'

export default function SimpleText({ content }: SimpleTextProps) {
  if (!content || !Array.isArray(content) || content.length === 0) return null

  return (
    <PortableText
      value={content as Parameters<typeof PortableText>[0]['value']}
      components={portableTextComponents}
    />
  )
}
