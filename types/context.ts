export type GeolocationData = {
  country: string
  region: string
  city: string
  isLoading: boolean
  error: string | null
}

export type CookieConsent = {
  ad_storage: boolean
  analytics_storage: boolean
  functionality_storage: boolean
  ad_user_data: boolean
  ad_personalization: boolean
}

export type AppContextType = {
  geolocation: GeolocationData
  updateGeolocation: (data: Partial<GeolocationData>) => void
  cookieConsent: CookieConsent
  updateCookieConsent: (consent: Partial<CookieConsent>) => void
  hasAcceptedCookies: boolean
  showCookiePreferences: boolean
  setShowCookiePreferences: (show: boolean) => void
}
