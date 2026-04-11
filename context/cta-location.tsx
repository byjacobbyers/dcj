'use client'

import { createContext, useContext, type ReactNode } from 'react'

type CtaLocationValue = string | null

const CtaLocationContext = createContext<CtaLocationValue>(null)

export function CtaLocationProvider({
  value,
  children,
}: {
  value: string
  children: ReactNode
}) {
  return (
    <CtaLocationContext.Provider value={value}>
      {children}
    </CtaLocationContext.Provider>
  )
}

export function useCtaLocation() {
  return useContext(CtaLocationContext)
}
