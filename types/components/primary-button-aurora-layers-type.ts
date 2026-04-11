import type { ReactNode } from 'react'

export type PrimaryButtonAuroraLayersProps = {
  children: ReactNode
  /** When false, Aurora WebGL is not mounted (lazy first hover). */
  mountAurora?: boolean
}
