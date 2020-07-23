import React, { FunctionComponent, useState, useEffect } from "react"
import SplashScreen from "react-native-splash-screen"
import env from "react-native-config"
import "array-flat-polyfill"

import MainNavigator from "./src/navigation/MainNavigator"
import { ErrorBoundary } from "./src/ErrorBoundaries"
import { TracingStrategyProvider } from "./src/TracingStrategyContext"
import gaenStrategy from "./src/gaen"
import {
  OnboardingProvider,
  isOnboardingComplete,
} from "./src/OnboardingContext"

const determineTracingStrategy = () => {
  switch (env.TRACING_STRATEGY) {
    case "bt": {
      return gaenStrategy
    }
    default: {
      throw new Error("Unsupported Tracing Strategy")
    }
  }
}

const strategy = determineTracingStrategy()

const App: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingIsComplete, setOnboardingIsComplete] = useState(false)

  useEffect(() => {
    isOnboardingComplete()
      .then((isComplete) => {
        setOnboardingIsComplete(isComplete)
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
          <OnboardingProvider onboardingIsComplete={onboardingIsComplete}>
            <TracingStrategyProvider strategy={strategy}>
              <MainNavigator />
            </TracingStrategyProvider>
          </OnboardingProvider>
        </ErrorBoundary>
      ) : null}
    </>
  )
}

export default App
