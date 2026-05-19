export type GeolocationData = {
  country: string
  region: string
  city: string
  isLoading: boolean
  error: string | null
}

export type AppContextType = {
  geolocation: GeolocationData
  updateGeolocation: (data: Partial<GeolocationData>) => void
}
