import React, { FunctionComponent, useState, useEffect } from "react"
import SplashScreen from "react-native-splash-screen"
import "array-flat-polyfill"

import MainNavigator from "./src/navigation/MainNavigator"
import { ErrorBoundary } from "./src/ErrorBoundaries"
import { ExposureProvider } from "./src/ExposureContext"
import {
  OnboardingProvider,
  onboardingHasBeenCompleted,
} from "./src/OnboardingContext"
import { PermissionsProvider } from "./src/PermissionsContext"

const App: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingIsComplete, setOnboardingIsComplete] = useState(false)

  useEffect(() => {
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
          <OnboardingProvider userHasCompletedOboarding={onboardingIsComplete}>
            <PermissionsProvider>
              <ExposureProvider>
                <MainNavigator />
              </ExposureProvider>
            </PermissionsProvider>
          </OnboardingProvider>
        </ErrorBoundary>
      ) : null}
    </>
  )
}

export default App

