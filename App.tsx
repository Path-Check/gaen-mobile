import React, { FunctionComponent, useState, useEffect } from "react"
import SplashScreen from "react-native-splash-screen"
import "array-flat-polyfill"
import env from "react-native-config"

import MainNavigator from "./src/navigation/MainNavigator"
import { ErrorBoundary } from "./src/ErrorBoundaries"
import { ExposureProvider } from "./src/ExposureContext"
import {
  OnboardingProvider,
  onboardingHasBeenCompleted,
} from "./src/OnboardingContext"
import { TestModeProvider } from "./src/TestModeContext"
import { PermissionsProvider } from "./src/PermissionsContext"
import { initializei18next, loadUserLocale } from "./src/locales/languages"

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
          <TestModeProvider>
            <OnboardingProvider
              userHasCompletedOboarding={onboardingIsComplete}
            >
              <PermissionsProvider>
                <ExposureProvider>
                  <MainNavigator />
                </ExposureProvider>
              </PermissionsProvider>
            </OnboardingProvider>
          </TestModeProvider>
        </ErrorBoundary>
      ) : null}
    </>
  )
}

export default App
