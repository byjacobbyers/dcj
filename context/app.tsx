'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  AppContextType,
  GeolocationData,
  CookieConsent,
} from '@/types/context'
import { trackGeolocation, updateConsentMode } from '@/lib/gtm'

function normalizeParsedConsent(raw: Partial<CookieConsent> & Record<string, unknown>): CookieConsent {
  return {
    ad_storage: !!raw.ad_storage,
    analytics_storage: !!raw.analytics_storage,
    functionality_storage: raw.functionality_storage !== false,
    ad_user_data: !!raw.ad_user_data,
    ad_personalization: !!raw.ad_personalization,
  }
}

function mapConsentToMode(consent: CookieConsent) {
  return {
    ad_storage: consent.ad_storage ? ('granted' as const) : ('denied' as const),
    analytics_storage: consent.analytics_storage ? ('granted' as const) : ('denied' as const),
    functionality_storage: consent.functionality_storage ? ('granted' as const) : ('denied' as const),
    ad_user_data: consent.ad_user_data ? ('granted' as const) : ('denied' as const),
    ad_personalization: consent.ad_personalization ? ('granted' as const) : ('denied' as const),
  }
}

type AppReducerState = Omit<
  AppContextType,
  'showCookiePreferences' | 'setShowCookiePreferences'
>

const initialState: AppReducerState = {
  geolocation: {
    country: '',
    region: '',
    city: '',
    isLoading: true,
    error: null,
  },
  updateGeolocation: () => {},
  cookieConsent: {
    ad_storage: false,
    analytics_storage: false,
    functionality_storage: true,
    ad_user_data: false,
    ad_personalization: false,
  },
  updateCookieConsent: () => {},
  hasAcceptedCookies: false,
}

type AppAction =
  | { type: 'UPDATE_GEOLOCATION'; payload: Partial<GeolocationData> }
  | { type: 'UPDATE_COOKIE_CONSENT'; payload: Partial<CookieConsent> }
  | { type: 'SET_HAS_ACCEPTED_COOKIES'; payload: boolean }

function appReducer(
  state: AppReducerState,
  action: AppAction
): AppReducerState {
  switch (action.type) {
    case 'UPDATE_GEOLOCATION':
      return {
        ...state,
        geolocation: { ...state.geolocation, ...action.payload },
      }
    case 'UPDATE_COOKIE_CONSENT':
      return {
        ...state,
        cookieConsent: { ...state.cookieConsent, ...action.payload },
      }
    case 'SET_HAS_ACCEPTED_COOKIES':
      return { ...state, hasAcceptedCookies: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [showCookiePreferences, setShowCookiePreferences] = useState(false)

  const updateGeolocation = (data: Partial<GeolocationData>) => {
    dispatch({ type: 'UPDATE_GEOLOCATION', payload: data })
  }

  const updateCookieConsent = (consent: Partial<CookieConsent>) => {
    const newConsent: CookieConsent = { ...state.cookieConsent, ...consent }
    dispatch({ type: 'UPDATE_COOKIE_CONSENT', payload: consent })
    dispatch({ type: 'SET_HAS_ACCEPTED_COOKIES', payload: true })
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', JSON.stringify(newConsent))
      updateConsentMode(mapConsentToMode(newConsent), 'update')
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedConsent = localStorage.getItem('cookieConsent')
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent) as Partial<CookieConsent> & Record<string, unknown>
        const consent = normalizeParsedConsent(parsed)
        dispatch({ type: 'UPDATE_COOKIE_CONSENT', payload: consent })
        dispatch({ type: 'SET_HAS_ACCEPTED_COOKIES', payload: true })
        updateConsentMode(mapConsentToMode(consent), 'update')
      } catch {
        // ignore
      }
    }
  }, [])

  // Geolocation OFF by default – only fetch when NEXT_PUBLIC_ENABLE_GEOLOCATION=true
  useEffect(() => {
    const fetchGeolocation = async () => {
      if (process.env.NEXT_PUBLIC_ENABLE_GEOLOCATION !== 'true') {
        updateGeolocation({ isLoading: false, error: null })
        return
      }
      if (
        !state.cookieConsent.analytics_storage &&
        !state.cookieConsent.functionality_storage
      ) {
        updateGeolocation({
          isLoading: false,
          error: 'Geolocation requires consent',
        })
        return
      }
      try {
        const response = await fetch('/api/geolocation')
        if (response.ok) {
          const data = await response.json()
          const geolocationData = {
            country: data.country || '',
            region: data.region || '',
            city: data.city || '',
          }
          updateGeolocation({
            ...geolocationData,
            isLoading: false,
            error: null,
          })
          if (
            process.env.NEXT_PUBLIC_GTM_ID &&
            state.cookieConsent.analytics_storage
          ) {
            trackGeolocation(geolocationData)
          }
        } else {
          updateGeolocation({
            isLoading: false,
            error: 'Failed to fetch geolocation',
          })
        }
      } catch {
        updateGeolocation({
          isLoading: false,
          error: 'Geolocation service unavailable',
        })
      }
    }
    fetchGeolocation()
  }, [
    state.cookieConsent.analytics_storage,
    state.cookieConsent.functionality_storage,
  ])

  return (
    <AppContext.Provider
      value={{
        ...state,
        updateGeolocation,
        updateCookieConsent,
        showCookiePreferences,
        setShowCookiePreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export { AppContext }
