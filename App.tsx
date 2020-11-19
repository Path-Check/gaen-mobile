import React, { FunctionComponent, useState, useEffect } from "react"
import "array-flat-polyfill"
import env from "react-native-config"
import SplashScreen from "react-native-splash-screen"
import FlashMessage from "react-native-flash-message"
import Matomo from "react-native-matomo-sdk"

import MainNavigator from "./src/navigation/MainNavigator"
import { ErrorBoundary } from "./src/ErrorBoundaries"
import { ExposureProvider } from "./src/ExposureContext"
import {
  OnboardingProvider,
  determineIsOnboardingComplete,
} from "./src/OnboardingContext"
import { ConfigurationProvider } from "./src/ConfigurationContext"
import { PermissionsProvider } from "./src/Device/PermissionsContext"
import { initializei18next, loadUserLocale } from "./src/locales/languages"
import Logger from "./src/logger"
import {
  ProductAnalyticsClient,
  ProductAnalyticsProvider,
} from "./src/ProductAnalytics/Context"
import { SymptomHistoryProvider } from "./src/SymptomHistory/SymptomHistoryContext"
import { CovidDataContextProvider } from "./src/CovidData/Context"

Logger.start()

const App: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true)

  useEffect(() => {
    initializei18next()
    loadUserLocale()

    determineIsOnboardingComplete()
      .then((result) => {
        setIsOnboardingComplete(result)
      })
      .finally(() => {
        setIsLoading(false)
        SplashScreen.hide()
      })
  }, [])

  const initializeMatomo = () => {
    const matomoUrl = env.MATOMO_URL
    const matomoSiteId = parseInt(env.MATOMO_SITE_ID)

    const isValid = (siteUrl: string, siteId: number) => {
      return siteUrl && !isNaN(siteId)
    }

    if (isValid(matomoUrl, matomoSiteId)) {
      Matomo.initialize(matomoUrl, matomoSiteId)

      return Matomo
    } else {
      throw new Error("Must provide valid url and site id for Matomo SDK")
    }
  }

  const initializeProductAnalytics = () => {
    const displayAnalytics = env.ENABLE_PRODUCT_ANALYTICS === "true"

    const nullClient = {
      trackEvent: async (_category: string, _action: string) => {},
      trackView: async (_routes: string[]) => {},
    }

    if (displayAnalytics) {
      const client = initializeMatomo()
      return {
        trackEvent: client.trackEvent,
        trackView: client.trackView,
      }
    } else {
      return nullClient
    }
  }

  const productAnalyticsClient: ProductAnalyticsClient = initializeProductAnalytics()

  return (
    <>
      {!isLoading ? (
        <ErrorBoundary>
          <ConfigurationProvider>
            <OnboardingProvider
              userHasCompletedOnboarding={isOnboardingComplete}
            >
              <ProductAnalyticsProvider
                productAnalyticsClient={productAnalyticsClient}
              >
                <ExposureProvider>
                  <PermissionsProvider>
                    <SymptomHistoryProvider>
                      <CovidDataContextProvider>
                        <MainNavigator />
                        <FlashMessage />
                      </CovidDataContextProvider>
                    </SymptomHistoryProvider>
                  </PermissionsProvider>
                </ExposureProvider>
              </ProductAnalyticsProvider>
            </OnboardingProvider>
          </ConfigurationProvider>
        </ErrorBoundary>
      ) : null}
    </>
  )
}

export default App
