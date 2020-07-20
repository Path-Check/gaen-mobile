import React, { FunctionComponent, useState, useEffect } from "react"
import { MenuProvider } from "react-native-popup-menu"
import SplashScreen from "react-native-splash-screen"
import env from "react-native-config"
import "array-flat-polyfill"

import MainNavigator from "./src/navigation/MainNavigator"
import { TracingStrategyProvider } from "./src/TracingStrategyContext"
import btStrategy from "./src/bt"
import {
  OnboardingProvider,
  isOnboardingComplete,
} from "./src/OnboardingContext"

const determineTracingStrategy = () => {
  switch (env.TRACING_STRATEGY) {
    case "bt": {
      return btStrategy
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
        <OnboardingProvider onboardingIsComplete={onboardingIsComplete}>
          <MenuProvider>
            <TracingStrategyProvider strategy={strategy}>
              <MainNavigator />
            </TracingStrategyProvider>
          </MenuProvider>
        </OnboardingProvider>
      ) : null}
    </>
  )
}

export default App
