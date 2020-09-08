import React, { createContext, FunctionComponent, useContext } from "react"

import useIsBluetoothOn from "./useIsBluetoothOn"
import useIsLocationOn from "./useIsLocationOn"
import useIsLocationRequired from "./useIsLocationRequired"

export enum LocationPermissions {
  NOT_REQUIRED,
  REQUIRED_OFF,
  REQUIRED_ON,
}

export interface SystemServicesState {
  isBluetoothOn: boolean
  locationPermissions: LocationPermissions
}

const initialState: SystemServicesState = {
  isBluetoothOn: false,
  locationPermissions: LocationPermissions.REQUIRED_OFF,
}

export const SystemServicesContext = createContext<SystemServicesState>(
  initialState,
)

const SystemServicesProvider: FunctionComponent = ({ children }) => {
  const isBluetoothOn = useIsBluetoothOn()
  const isLocationOn = useIsLocationOn()
  const isLocationRequired = useIsLocationRequired()

  const determineLocationPermissions = (): LocationPermissions => {
    if (!isLocationRequired) {
      return LocationPermissions.NOT_REQUIRED
    } else if (!isLocationOn) {
      return LocationPermissions.REQUIRED_OFF
    } else {
      return LocationPermissions.REQUIRED_ON
    }
  }

  const locationPermissions = determineLocationPermissions()

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
