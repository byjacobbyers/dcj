'use client'

import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const Silk = dynamic(() => import('@/components/effects/silk'), { ssr: false })

/**
 * Viewport-locked Silk backdrop.
 *
 * Uses `fixed inset-0` so the layer is sized to the viewport, not scroll height.
 * Page content should sit above with a higher z-index (e.g. `main` with `relative z-10`).
 */
export default function PageBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)}
      aria-hidden
    >
      <div className="h-full min-h-0 w-full" data-page-backdrop-root>
        <Silk speed={5} scale={1} color="#7B7481" noiseIntensity={1.5} rotation={0} />
      </div>
    </div>
  )
}
