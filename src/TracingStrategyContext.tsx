import React, { createContext, useContext, FunctionComponent } from "react"
import { PermissionsProvider } from "./PermissionsContext"

import { TracingStrategy } from "./tracingStrategy"

import { ExposureProvider } from "./ExposureContext"

interface TracingStrategyContextState {
  name: string
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
      }}
    >
      <PermissionsProvider permissionStrategy={strategy.permissionStrategy}>
        <ExposureProvider
          exposureEventsStrategy={strategy.exposureEventsStrategy}
        >
          {children}
        </ExposureProvider>
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
