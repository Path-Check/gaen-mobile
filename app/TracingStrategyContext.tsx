import React, { createContext, useContext, FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { PermissionsProvider } from "./PermissionsContext"

import {
  TracingStrategy,
  StrategyCopyContent,
  StrategyCopyContentHook,
  StrategyAssets,
} from "./tracingStrategy"

import { ExposureHistoryProvider } from "./ExposureHistoryContext"

interface TracingStrategyContextState {
  name: string
  assets: StrategyAssets
  useCopy: StrategyCopyContentHook
}

const TracingStrategyContext = createContext<
  TracingStrategyContextState | undefined
>(undefined)

interface TracingStrategyProps {
  strategy: TracingStrategy
}

export const TracingStrategyProvider: FunctionComponent<TracingStrategyProps> = ({
  children,
  strategy,
}) => {
  return (
    <TracingStrategyContext.Provider
      value={{
        name: strategy.name,
        assets: strategy.assets,
        useCopy: strategy.useCopy,
      }}
    >
      <PermissionsProvider>
        <ExposureHistoryProvider
          exposureEventsStrategy={strategy.exposureEventsStrategy}
        >
          {children}
        </ExposureHistoryProvider>
      </PermissionsProvider>
    </TracingStrategyContext.Provider>
  )
}

export const useTracingStrategyContext = (): TracingStrategyContextState => {
  const context = useContext(TracingStrategyContext)
  if (context === undefined) {
    throw new Error("TracingStrategyContext must be used with a provider")
  }
  return context
}

export const useStrategyContent = (): {
  StrategyCopy: StrategyCopyContent
  StrategyAssets: StrategyAssets
} => {
  const { t } = useTranslation()
  const { useCopy, assets } = useTracingStrategyContext()
  const StrategyCopy = useCopy(t)
  const StrategyAssets = assets
  return { StrategyCopy, StrategyAssets }
}
