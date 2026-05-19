'use client'

import { AppProvider } from '@/context/app'
import { DebugPanel } from '@/components/debug-panel'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { ProvidersProps } from '@/types/components/providers-type'

export function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      <TooltipProvider delayDuration={200}>
        {children}
        <DebugPanel />
      </TooltipProvider>
    </AppProvider>
  )
}
