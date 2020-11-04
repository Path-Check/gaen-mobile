import React, {
  FunctionComponent,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react"

import { StorageUtils } from "../utils"
import { useConfigurationContext } from "../ConfigurationContext"

export type ProductAnalyticsContextState = {
  userConsentedToAnalytics: boolean
  updateUserConsent: (consent: boolean) => Promise<void>
  trackEvent: (
    category: EventCategory,
    action: EventAction,
    name: string,
  ) => Promise<void>
  trackScreenView: (screen: string) => Promise<void>
}

const initialContext = {
  userConsentedToAnalytics: false,
  updateUserConsent: () => Promise.resolve(),
  trackEvent: () => Promise.resolve(),
  trackScreenView: () => Promise.resolve(),
}

export type EventCategory = "product_analytics" | "epi_analytics"
export type EventAction = "button_tap" | "event_emitted"
export type ProductAnalyticsClient = {
  trackEvent: (
    category: EventCategory,
    action: EventAction,
    name: string,
  ) => Promise<void>
  trackView: (route: string[]) => Promise<void>
}

const ProductAnalyticsContext = createContext<ProductAnalyticsContextState>(
  initialContext,
)
const ProductAnalyticsProvider: FunctionComponent<{
  productAnalyticsClient: ProductAnalyticsClient
}> = ({ productAnalyticsClient, children }) => {
  const { healthAuthoritySupportsAnalytics } = useConfigurationContext()
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

  const supportAnalyticsTracking =
    healthAuthoritySupportsAnalytics && userConsentedToAnalytics

  const trackEvent = async (
    category: EventCategory,
    action: EventAction,
    name: string,
  ): Promise<void> => {
    if (supportAnalyticsTracking) {
      productAnalyticsClient.trackEvent(category, action, name)
    }
  }

  const trackScreenView = async (screen: string): Promise<void> => {
    if (supportAnalyticsTracking) {
      productAnalyticsClient.trackView([screen])
    }
  }
  const updateUserConsent = async (consent: boolean) => {
    await StorageUtils.setAnalyticsConsent(consent)
    setUserConsentedToAnalytics(consent)
  }

  return (
    <ProductAnalyticsContext.Provider
      value={{
        userConsentedToAnalytics,
        updateUserConsent,
        trackEvent,
        trackScreenView,
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
