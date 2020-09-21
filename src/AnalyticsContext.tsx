import React, {
  FunctionComponent,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react"
import Matomo from "react-native-matomo"
import { StorageUtils } from "./utils"
import { actions } from "./analytics"
import { useConfigurationContext } from "./ConfigurationContext"

export type AnalyticsContextState = {
  userConsentedToAnalytics: boolean
  updateUserConsent: (consent: boolean) => Promise<void>
  trackEvent: (event: string) => Promise<string | boolean>
  trackScreenView: (screen: string) => Promise<void>
}

const initialState: AnalyticsContextState = {
  userConsentedToAnalytics: false,
  updateUserConsent: () => Promise.resolve(),
  trackEvent: actions.trackEvent,
  trackScreenView: actions.trackScreenView,
}

const AnalyticsContext = createContext<AnalyticsContextState>(initialState)

const AnalyticsProvider: FunctionComponent = ({ children }) => {
  const {
    healthAuthoritySupportsAnalytics,
    healthAuthorityAnalyticsUrl,
    healthAuthorityAnalyticsSiteId,
  } = useConfigurationContext()
  const [userConsentedToAnalytics, setUserConsentedToAnalytics] = useState<
    boolean
  >(false)
  const supportAnalyticsTracking =
    healthAuthoritySupportsAnalytics && userConsentedToAnalytics

  useEffect(() => {
    const checkAnalyticsConsent = async () => {
      const userConsented = await StorageUtils.getAnalyticsConsent()
      setUserConsentedToAnalytics(userConsented)
    }

    checkAnalyticsConsent()
  }, [userConsentedToAnalytics])

  useEffect(() => {
    supportAnalyticsTracking &&
      Matomo.initTracker(
        healthAuthorityAnalyticsUrl,
        healthAuthorityAnalyticsSiteId,
      )
  }, [
    supportAnalyticsTracking,
    healthAuthorityAnalyticsSiteId,
    healthAuthorityAnalyticsUrl,
  ])

  const updateUserConsent = async (consent: boolean) => {
    await StorageUtils.setAnalyticsConsent(consent)
    setUserConsentedToAnalytics(consent)
  }

  const trackEvent = async (event: string) => {
    return supportAnalyticsTracking && actions.trackEvent(event)
  }

  const trackScreenView = async (screen: string) => {
    supportAnalyticsTracking && actions.trackScreenView(screen)
  }

  return (
    <AnalyticsContext.Provider
      value={{
        userConsentedToAnalytics,
        updateUserConsent,
        trackEvent,
        trackScreenView,
      }}
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
