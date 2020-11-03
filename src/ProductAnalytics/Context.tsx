import React, {
  FunctionComponent,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react"
import Matomo from "react-native-matomo-sdk"
import { StorageUtils } from "../utils"
import { useConfigurationContext } from "../ConfigurationContext"

export type AnalyticsContextState = {
  userConsentedToAnalytics: boolean
  updateUserConsent: (consent: boolean) => Promise<void>
} & AnalyticsConfiguration

type AnalyticsConfiguration = {
  trackEvent: (
    category: EventCategory,
    action: EventAction,
    name: string,
  ) => Promise<void>
  trackScreenView: (screen: string) => Promise<void>
}

const initialAnalyticsConfiguration = {
  trackEvent: () => Promise.resolve(),
  trackScreenView: () => Promise.resolve(),
}

const initialContext = {
  userConsentedToAnalytics: false,
  updateUserConsent: () => Promise.resolve(),
  ...initialAnalyticsConfiguration,
}

type EventCategory = "product_analytics" | "epi_analytics"
type EventAction = "button_tap" | "event_emitted"

const AnalyticsContext = createContext<AnalyticsContextState>(initialContext)
const AnalyticsProvider: FunctionComponent = ({ children }) => {
  const {
    healthAuthoritySupportsAnalytics,
    healthAuthorityAnalyticsUrl,
    healthAuthorityAnalyticsSiteId,
  } = useConfigurationContext()
  const [userConsentedToAnalytics, setUserConsentedToAnalytics] = useState<
    boolean
  >(false)

  const [analyticsConfiguration, setAnalyticsConfiguration] = useState<
    AnalyticsConfiguration
  >(initialAnalyticsConfiguration)

  useEffect(() => {
    const checkAnalyticsConsent = async () => {
      const userConsented = await StorageUtils.getAnalyticsConsent()
      setUserConsentedToAnalytics(userConsented)
    }

    checkAnalyticsConsent()
  }, [userConsentedToAnalytics])

  useEffect(() => {
    const supportAnalyticsTracking =
      healthAuthoritySupportsAnalytics && userConsentedToAnalytics

    const initializeAnalyticsTracking = () => {
      if (healthAuthorityAnalyticsUrl && healthAuthorityAnalyticsSiteId) {
        Matomo.initialize(
          healthAuthorityAnalyticsUrl,
          healthAuthorityAnalyticsSiteId,
        )
      }
    }

    const trackEvent = async (
      category: EventCategory,
      action: EventAction,
      name: string,
    ): Promise<void> => {
      Matomo.trackEvent(category, action, name)
    }

    const trackScreenView = async (screen: string): Promise<void> => {
      Matomo.trackView([screen])
    }

    if (supportAnalyticsTracking) {
      initializeAnalyticsTracking()
      setAnalyticsConfiguration({ trackEvent, trackScreenView })
    }
  }, [
    healthAuthoritySupportsAnalytics,
    userConsentedToAnalytics,
    healthAuthorityAnalyticsSiteId,
    healthAuthorityAnalyticsUrl,
  ])

  const updateUserConsent = async (consent: boolean) => {
    await StorageUtils.setAnalyticsConsent(consent)
    setUserConsentedToAnalytics(consent)
  }

  return (
    <AnalyticsContext.Provider
      value={{
        userConsentedToAnalytics,
        updateUserConsent,
        ...analyticsConfiguration,
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
