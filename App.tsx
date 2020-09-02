import React, { FunctionComponent, useState, useEffect } from "react"
import SplashScreen from "react-native-splash-screen"
import "array-flat-polyfill"
import env from "react-native-config"
import Bugsnag from "@bugsnag/react-native"

import MainNavigator from "./src/navigation/MainNavigator"
import { ErrorBoundary } from "./src/ErrorBoundaries"
import { ExposureProvider } from "./src/ExposureContext"
import {
  OnboardingProvider,
  onboardingHasBeenCompleted,
} from "./src/OnboardingContext"
import { ConfigurationProvider } from "./src/ConfigurationContext"
import { PermissionsProvider } from "./src/PermissionsContext"
import { SystemServicesProvider } from "./src/SystemServicesContext"
import { initializei18next, loadUserLocale } from "./src/locales/languages"

Bugsnag.start()

const App: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingIsComplete, setOnboardingIsComplete] = useState(false)

  useEffect(() => {
    const locales = env.SUPPORTED_LOCALES?.split(",") || []
    initializei18next(locales)
    loadUserLocale()

    onboardingHasBeenCompleted()
      .then((onboardingHasBeenCompleted) => {
        setOnboardingIsComplete(onboardingHasBeenCompleted)
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
              userHasCompletedOnboarding={onboardingIsComplete}
            >
              <PermissionsProvider>
                <SystemServicesProvider>
                  <ExposureProvider>
                    <MainNavigator />
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
