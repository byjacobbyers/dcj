// Google Tag Manager / GA4 dataLayer helpers

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
