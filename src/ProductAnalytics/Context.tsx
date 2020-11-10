import React, {
  FunctionComponent,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react"

import { StorageUtils } from "../utils"

export type ProductAnalyticsContextState = {
  userConsentedToAnalytics: boolean
  updateUserConsent: (consent: boolean) => Promise<void>
  trackEvent: (
    category: EventCategory,
    action: string,
    name?: string,
    value?: number,
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
export type ProductAnalyticsClient = {
  trackEvent: (
    category: EventCategory,
    action: string,
    name?: string,
    value?: number,
  ) => Promise<void>
  trackView: (route: string[]) => Promise<void>
}

const ProductAnalyticsContext = createContext<ProductAnalyticsContextState>(
  initialContext,
)
const ProductAnalyticsProvider: FunctionComponent<{
  productAnalyticsClient: ProductAnalyticsClient
}> = ({ productAnalyticsClient, children }) => {
  const [userConsentedToAnalytics, setUserConsentedToAnalytics] = useState<
    boolean
  >(false)

  useEffect(() => {
    const checkAnalyticsConsent = async () => {
      const userConsented = await StorageUtils.getAnalyticsConsent()
      setUserConsentedToAnalytics(userConsented)
    }

    checkAnalyticsConsent()
  }, [])

  const trackEvent = async (
    category: EventCategory,
    action: string,
    name?: string,
    value?: number,
  ): Promise<void> => {
    if (userConsentedToAnalytics) {
      productAnalyticsClient.trackEvent(category, action, name, value)
    }
  }

  const trackScreenView = async (screen: string): Promise<void> => {
    if (userConsentedToAnalytics) {
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
