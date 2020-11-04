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
import * as analyticsClient from "./analyticsClient"

export type ProductAnalyticsContextState = {
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

export type EventCategory = "product_analytics" | "epi_analytics"
export type EventAction = "button_tap" | "event_emitted"

const ProductAnalyticsContext = createContext<ProductAnalyticsContextState>(
  initialContext,
)
const ProductAnalyticsProvider: FunctionComponent = ({ children }) => {
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
      if (supportAnalyticsTracking) {
        analyticsClient.trackEvent(category, action, name)
      }
    }

    const trackScreenView = async (screen: string): Promise<void> => {
      if (supportAnalyticsTracking) {
        analyticsClient.trackScreenView(screen)
      }
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
    <ProductAnalyticsContext.Provider
      value={{
        userConsentedToAnalytics,
        updateUserConsent,
        ...analyticsConfiguration,
      }}
    >
      {children}
    </ProductAnalyticsContext.Provider>
  )
}

const useProductAnalyticsContext = (): ProductAnalyticsContextState => {
  const context = useContext(ProductAnalyticsContext)
  if (context === undefined) {
    throw new Error("ProductAnalyticsContext must be used with a provider")
  }

  return context
}

export {
  ProductAnalyticsContext,
  ProductAnalyticsProvider,
  useProductAnalyticsContext,
}
