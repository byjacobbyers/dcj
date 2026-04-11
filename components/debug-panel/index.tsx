'use client'

import { useState, useSyncExternalStore } from 'react'
import { useApp } from '@/context/app'
import { Button } from '@/components/ui/button'

function subscribeToWindow() {
  return () => {}
}

function getGtmAvailableSnapshot() {
  if (typeof window === 'undefined') return false
  return typeof (window as Window & { gtag?: unknown }).gtag === 'function'
}

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const gtmAvailable = useSyncExternalStore(
    subscribeToWindow,
    getGtmAvailableSnapshot,
    () => false
  )
  const { geolocation, cookieConsent, hasAcceptedCookies } = useApp()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-b-none font-mono"
      >
        {isOpen ? '▼' : '▲'} Debug
      </Button>

      {isOpen && (
        <div className="bg-white border border-gray-300 rounded-b-lg shadow-lg max-w-sm">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-gray-800 mb-2">
                Geolocation
              </h3>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span
                    className={
                      geolocation.country ? 'text-green-600' : 'text-gray-400'
                    }
                  >
                    {geolocation.country || 'Not available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Region:</span>
                  <span
                    className={
                      geolocation.region ? 'text-green-600' : 'text-gray-400'
                    }
                  >
                    {geolocation.region || 'Not available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span
                    className={
                      geolocation.city ? 'text-green-600' : 'text-gray-400'
                    }
                  >
                    {geolocation.city || 'Not available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loading:</span>
                  <span
                    className={
                      geolocation.isLoading
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }
                  >
                    {geolocation.isLoading ? 'Yes' : 'No'}
                  </span>
                </div>
                {geolocation.error && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error:</span>
                    <span className="text-red-600 text-xs">
                      {geolocation.error}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-800 mb-2">
                Cookie Consent
              </h3>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accepted:</span>
                  <span
                    className={
                      hasAcceptedCookies ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {hasAcceptedCookies ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ad Storage:</span>
                  <span
                    className={
                      cookieConsent.ad_storage
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {cookieConsent.ad_storage ? 'Granted' : 'Denied'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Analytics:</span>
                  <span
                    className={
                      cookieConsent.analytics_storage
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {cookieConsent.analytics_storage
                      ? 'Granted'
                      : 'Denied'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Functionality:</span>
                  <span
                    className={
                      cookieConsent.functionality_storage
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {cookieConsent.functionality_storage
                      ? 'Granted'
                      : 'Denied'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ad user data:</span>
                  <span
                    className={
                      cookieConsent.ad_user_data
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {cookieConsent.ad_user_data ? 'Granted' : 'Denied'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ad personalization:</span>
                  <span
                    className={
                      cookieConsent.ad_personalization
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {cookieConsent.ad_personalization ? 'Granted' : 'Denied'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-800 mb-2">System</h3>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <span className="text-blue-600">
                    {process.env.NODE_ENV}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GTM Available:</span>
                  <span
                    className={gtmAvailable ? 'text-green-600' : 'text-red-600'}
                  >
                    {gtmAvailable ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <details className="text-xs">
              <summary className="font-bold text-gray-800 cursor-pointer">
                Raw Context Data
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(
                  { geolocation, cookieConsent, hasAcceptedCookies },
                  null,
                  2
                )}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}
