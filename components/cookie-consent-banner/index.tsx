'use client'

import { useApp } from '@/context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const checkboxClass =
  'h-4 w-4 shrink-0 rounded border-2 border-input bg-background accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/**
 * Cookie consent UI + preferences. Only mounts when `NEXT_PUBLIC_GTM_ID` is set
 * (GTM consent bootstrap in layout expects the same).
 */
export function CookieConsentBanner() {
  const {
    cookieConsent,
    updateCookieConsent,
    hasAcceptedCookies,
    showCookiePreferences,
    setShowCookiePreferences,
  } = useApp()

  if (!process.env.NEXT_PUBLIC_GTM_ID) {
    return null
  }

  if (hasAcceptedCookies) {
    if (!showCookiePreferences) return null

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
      >
        <div
          className={cn(
            'relative w-full max-w-md rounded-lg border-4 border-primary bg-card p-6 text-card-foreground shadow-lg'
          )}
        >
          <button
            type="button"
            onClick={() => setShowCookiePreferences(false)}
            className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close cookie preferences"
          >
            ×
          </button>
          <h3
            id="cookie-preferences-title"
            className="mb-4 pr-8 text-base font-semibold"
          >
            Cookie preferences
          </h3>
          <div className="space-y-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={cookieConsent.ad_storage}
                onChange={(e) =>
                  updateCookieConsent({ ad_storage: e.target.checked })
                }
                className={checkboxClass}
              />
              <span className="text-sm">Ad storage (personalized ads)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={cookieConsent.analytics_storage}
                onChange={(e) =>
                  updateCookieConsent({
                    analytics_storage: e.target.checked,
                  })
                }
                className={checkboxClass}
              />
              <span className="text-sm">Analytics storage</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={cookieConsent.functionality_storage}
                onChange={(e) =>
                  updateCookieConsent({
                    functionality_storage: e.target.checked,
                  })
                }
                className={checkboxClass}
              />
              <span className="text-sm">
                Functionality storage (basic site features)
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={cookieConsent.ad_user_data}
                onChange={(e) =>
                  updateCookieConsent({ ad_user_data: e.target.checked })
                }
                className={checkboxClass}
              />
              <span className="text-sm">Ad user data</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={cookieConsent.ad_personalization}
                onChange={(e) =>
                  updateCookieConsent({
                    ad_personalization: e.target.checked,
                  })
                }
                className={checkboxClass}
              />
              <span className="text-sm">Ad personalization</span>
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="default"
              onClick={() => setShowCookiePreferences(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-primary bg-background px-5 py-5 text-foreground shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold">We use cookies</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            We use cookies to improve your experience and analyze our traffic.
          </p>
        </div>
        <div className="mt-2 flex shrink-0 justify-center gap-3 sm:mt-0 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              updateCookieConsent({
                ad_storage: false,
                analytics_storage: false,
                functionality_storage: true,
                ad_user_data: false,
                ad_personalization: false,
              })
            }
          >
            Reject all
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() =>
              updateCookieConsent({
                ad_storage: true,
                analytics_storage: true,
                functionality_storage: true,
                ad_user_data: true,
                ad_personalization: true,
              })
            }
          >
            Accept all
          </Button>
        </div>
      </div>
    </div>
  )
}
