import React, { createContext, FunctionComponent, useContext } from "react"

import useIsBluetoothOn from "./useIsBluetoothOn"
import useIsLocationOn from "./useIsLocationOn"
import useIsLocationNeeded from "./useIsLocationNeeded"

export interface SystemServicesState {
  isBluetoothOn: boolean
  isLocationOn: boolean
  isLocationNeeded: boolean
}

const initialState: SystemServicesState = {
  isBluetoothOn: false,
  isLocationOn: false,
  isLocationNeeded: true,
}

export const SystemServicesContext = createContext<SystemServicesState>(
  initialState,
)

const SystemServicesProvider: FunctionComponent = ({ children }) => {
  const isBluetoothOn = useIsBluetoothOn()
  const isLocationOn = useIsLocationOn()
  const isLocationNeeded = useIsLocationNeeded()

  return (
    <SystemServicesContext.Provider
      value={{
        isBluetoothOn,
        isLocationOn,
        isLocationNeeded,
      }}
    >
      {children}
    </SystemServicesContext.Provider>
  )
}

const useSystemServicesContext = (): SystemServicesState => {
  const context = useContext(SystemServicesContext)
  if (context === undefined) {
    throw new Error("SystemServicesContext muse be used with a provider")
  }
  return context
}

export { SystemServicesProvider, useSystemServicesContext }
