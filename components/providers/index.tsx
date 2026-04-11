'use client'

import { AppProvider } from '@/context/app'
import { CookieConsentBanner } from '@/components/cookie-consent-banner'
import { DebugPanel } from '@/components/debug-panel'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <TooltipProvider delayDuration={200}>
        {children}
        <CookieConsentBanner />
        <DebugPanel />
      </TooltipProvider>
    </AppProvider>
  )
}
