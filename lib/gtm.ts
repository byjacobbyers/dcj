// Google Tag Manager utility functions (dataLayer-first)

type ConsentModeValue = 'granted' | 'denied'

type ConsentUpdate = {
  ad_storage: ConsentModeValue
  analytics_storage: ConsentModeValue
  functionality_storage: ConsentModeValue
  ad_user_data: ConsentModeValue
  ad_personalization: ConsentModeValue
}

type GTMEvent = {
  event: string
  [key: string]: unknown
}

const ensureDataLayer = () => {
  if (typeof window === 'undefined') return null
  const win = window as Window & { dataLayer?: Array<unknown> }
  win.dataLayer = win.dataLayer || []
  return win.dataLayer
}

export const pushToDataLayer = (payload: Record<string, unknown>) => {
  const dataLayer = ensureDataLayer()
  if (!dataLayer) return
  dataLayer.push(payload)
}

export const updateConsentMode = (consent: ConsentUpdate, mode: 'default' | 'update' = 'update') => {
  if (typeof window === 'undefined') return

  const dataLayer = ensureDataLayer()
  if (!dataLayer) return

  if (mode === 'default') {
    const win = window as Window & {
      gtag?: (cmd: string, action: string, params: Record<string, string>) => void
    }
    if (win.gtag) {
      win.gtag('consent', mode, consent)
    } else {
      dataLayer.push(['consent', mode, consent])
    }
    return
  }

  const win = window as Window & {
    gtag?: (cmd: string, action: string, params: Record<string, string>) => void
  }
  if (win.gtag) {
    win.gtag('consent', 'update', consent)
  } else {
    dataLayer.push(['consent', 'update', consent])
  }

  const consentEvent = {
    event: 'consent_update',
    ad_storage: consent.ad_storage,
    analytics_storage: consent.analytics_storage,
    functionality_storage: consent.functionality_storage,
    ad_user_data: consent.ad_user_data,
    ad_personalization: consent.ad_personalization,
  }
  setTimeout(() => dataLayer.push(consentEvent), 0)
}

export const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  pushToDataLayer({ event: eventName, ...parameters })
}

export const trackGeolocation = (geolocation: { country: string; region: string; city: string }) => {
  const payload: GTMEvent = {
    event: 'geolocation_detected',
    country: geolocation.country,
    region: geolocation.region,
    city: geolocation.city,
  }

  pushToDataLayer(payload)
}
