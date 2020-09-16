import React, {
  FunctionComponent,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react"
import { StorageUtils } from "./utils"
import { actions } from "./analytics"

export type AnalyticsContextState = {
  userConsentedToAnalytics: boolean
  updateUserConsent: (consent: boolean) => Promise<void>
  trackEvent: (event: string) => Promise<string | boolean>
}

const initialState: AnalyticsContextState = {
  userConsentedToAnalytics: false,
  updateUserConsent: () => Promise.resolve(),
  trackEvent: () => Promise.resolve(false),
}

const AnalyticsContext = createContext<AnalyticsContextState>(initialState)

const AnalyticsProvider: FunctionComponent = ({ children }) => {
  const [userConsentedToAnalytics, setUserConsentedToAnalytics] = useState<
    boolean
  >(false)
  useEffect(() => {
    const checkAnalyticsConsent = async () => {
      const userConsented = await StorageUtils.getAnalyticsConsent()
      setUserConsentedToAnalytics(userConsented)
    }

    checkAnalyticsConsent()
  }, [userConsentedToAnalytics])

  const updateUserConsent = async (consent: boolean) => {
    await StorageUtils.setAnalyticsConsent(consent)
    setUserConsentedToAnalytics(consent)
  }

  const trackEvent = async (event: string) => {
    return userConsentedToAnalytics && actions.trackEvent(event)
  }

  return (
    <AnalyticsContext.Provider
      value={{ userConsentedToAnalytics, updateUserConsent, trackEvent }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

const useAnalyticsContext = (): AnalyticsContextState => {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("AnalyticsContext must be used with a provider")
  }

  return context
}

export { AnalyticsContext, AnalyticsProvider, useAnalyticsContext }
