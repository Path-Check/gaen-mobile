import React, { FunctionComponent, useState, useEffect } from "react"
import "array-flat-polyfill"
import env from "react-native-config"
import SplashScreen from "react-native-splash-screen"
import FlashMessage from "react-native-flash-message"

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
import { AnalyticsProvider } from "./src/ProductAnalytics/Context"
import { SymptomHistoryProvider } from "./src/SymptomHistory/SymptomHistoryContext"
import { CovidDataContextProvider } from "./src/CovidData/Context"

Logger.start()

const App: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true)

  useEffect(() => {
    const locales = env.SUPPORTED_LOCALES?.split(",") || []
    initializei18next(locales)
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

  return (
    <>
      {!isLoading ? (
        <ErrorBoundary>
          <ConfigurationProvider>
            <OnboardingProvider
              userHasCompletedOnboarding={isOnboardingComplete}
            >
              <PermissionsProvider>
                <ExposureProvider>
                  <AnalyticsProvider>
                    <SymptomHistoryProvider>
                      <CovidDataContextProvider>
                        <MainNavigator />
                        <FlashMessage />
                      </CovidDataContextProvider>
                    </SymptomHistoryProvider>
                  </AnalyticsProvider>
                </ExposureProvider>
              </PermissionsProvider>
            </OnboardingProvider>
          </ConfigurationProvider>
        </ErrorBoundary>
      ) : null}
    </>
  )
}

export default App
