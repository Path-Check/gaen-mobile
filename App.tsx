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
import { PermissionsProvider } from "./src/PermissionsContext"
import { SystemServicesProvider } from "./src/SystemServicesContext"
import { initializei18next, loadUserLocale } from "./src/locales/languages"
import Logger from "./src/logger"
import { AnalyticsProvider } from "./src/AnalyticsContext"
import { SymptomLogProvider } from "./src/SymptomHistory/SymptomLogContext"
import { CovidDataContextProvider } from "./src/CovidDataContext"

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
                <SystemServicesProvider>
                  <ExposureProvider>
                    <AnalyticsProvider>
                      <SymptomLogProvider>
                        <CovidDataContextProvider>
                          <MainNavigator />
                          <FlashMessage />
                        </CovidDataContextProvider>
                      </SymptomLogProvider>
                    </AnalyticsProvider>
                  </ExposureProvider>
                </SystemServicesProvider>
              </PermissionsProvider>
            </OnboardingProvider>
          </ConfigurationProvider>
        </ErrorBoundary>
      ) : null}
    </>
  )
}

export default App
