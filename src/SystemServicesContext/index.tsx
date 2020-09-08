import React, { createContext, FunctionComponent, useContext } from "react"

import useIsBluetoothOn from "./useIsBluetoothOn"
import useLocationPermissions, {
  LocationPermissions,
} from "./useLocationPermissions"

export interface SystemServicesState {
  isBluetoothOn: boolean
  locationPermissions: LocationPermissions
}

const initialState: SystemServicesState = {
  isBluetoothOn: false,
  locationPermissions: "RequiredOff",
}

export const SystemServicesContext = createContext<SystemServicesState>(
  initialState,
)

const SystemServicesProvider: FunctionComponent = ({ children }) => {
  const isBluetoothOn = useIsBluetoothOn()
  const locationPermissions = useLocationPermissions()

  return (
    <SystemServicesContext.Provider
      value={{
        isBluetoothOn,
        locationPermissions,
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
