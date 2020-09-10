import React, { FunctionComponent, useState, useEffect } from "react"
import "array-flat-polyfill"
import env from "react-native-config"

import MainNavigator from "./src/navigation/MainNavigator"
import { ErrorBoundary } from "./src/ErrorBoundaries"
import { ExposureProvider } from "./src/ExposureContext"
import { OnboardingProvider } from "./src/OnboardingContext"
import { ConfigurationProvider } from "./src/ConfigurationContext"
import { PermissionsProvider } from "./src/PermissionsContext"
import { SystemServicesProvider } from "./src/SystemServicesContext"
import { initializei18next, loadUserLocale } from "./src/locales/languages"
import Logger from "./src/logger"
import SplashScreen from "react-native-splash-screen"

Logger.start()

const App: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const locales = env.SUPPORTED_LOCALES?.split(",") || []
    initializei18next(locales)
    loadUserLocale()

    setIsLoading(false)
    SplashScreen.hide()
  }, [])

  return (
    <>
      {!isLoading ? (
        <ErrorBoundary>
          <ConfigurationProvider>
            <OnboardingProvider>
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
