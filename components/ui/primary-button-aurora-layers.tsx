'use client'

import AuroraBits from '@/components/aurora-bits'

import type { PrimaryButtonAuroraLayersProps } from '@/types/components/primary-button-aurora-layers-type'

/** Same hues as banner SoftAurora: #f7f7f7 and #3566ff */
export const PRIMARY_AURORA_STOPS = ['#f7f7f7', '#3566ff', '#f7f7f7'] as const

export function PrimaryButtonAuroraLayers({
  children,
  mountAurora = true,
}: PrimaryButtonAuroraLayersProps) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-primary transition-opacity duration-300 ease-out group-hover:opacity-0 motion-reduce:opacity-100 motion-reduce:group-hover:opacity-100"
      />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:opacity-0 motion-reduce:group-hover:opacity-0">
        {mountAurora ? (
          <div className="relative h-full min-h-0 w-full">
            {/* Column-card tone behind the shader (darker columns use bg-muted/40) */}
            <span aria-hidden className="absolute inset-0 bg-muted/40" />
            <AuroraBits
              colorStops={[...PRIMARY_AURORA_STOPS]}
              blend={0.5}
              amplitude={1}
              speed={0.6}
            />
          </div>
        ) : null}
      </div>
      <span className="relative z-10 inline-flex min-w-0 items-center justify-center gap-2">
        {children}
      </span>
    </>
  )
}
