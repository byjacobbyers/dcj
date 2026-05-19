'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react'
import { AppContextType, GeolocationData } from '@/types/context'
import { hasAnalytics } from '@/lib/analytics'
import { trackGeolocation } from '@/lib/gtm'

type AppReducerState = Pick<AppContextType, 'geolocation'> & {
  updateGeolocation: AppContextType['updateGeolocation']
}

const initialState: AppReducerState = {
  geolocation: {
    country: '',
    region: '',
    city: '',
    isLoading: true,
    error: null,
  },
  updateGeolocation: () => {},
}

type AppAction = { type: 'UPDATE_GEOLOCATION'; payload: Partial<GeolocationData> }

function appReducer(state: AppReducerState, action: AppAction): AppReducerState {
  switch (action.type) {
    case 'UPDATE_GEOLOCATION':
      return {
        ...state,
        geolocation: { ...state.geolocation, ...action.payload },
      }
    default:
      return state
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const updateGeolocation = (data: Partial<GeolocationData>) => {
    dispatch({ type: 'UPDATE_GEOLOCATION', payload: data })
  }

  // Geolocation OFF by default – only fetch when NEXT_PUBLIC_ENABLE_GEOLOCATION=true
  useEffect(() => {
    const fetchGeolocation = async () => {
      if (process.env.NEXT_PUBLIC_ENABLE_GEOLOCATION !== 'true') {
        updateGeolocation({ isLoading: false, error: null })
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
          if (hasAnalytics()) {
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
  }, [])

  return (
    <AppContext.Provider
      value={{
        geolocation: state.geolocation,
        updateGeolocation,
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
