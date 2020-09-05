import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
  useContext,
} from "react"
import { Platform } from "react-native"
import useAppState from "react-native-appstate-hook"

import { isBluetoothEnabled } from "./gaen/nativeModule"
import { isLocationEnabled } from "./gaen/nativeModule"
import { doesDeviceSupportLocationlessScanning } from "./gaen/nativeModule"

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

const useIsBluetoothOn = () => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(false)

  const determineIsBluetoothOn = useCallback(async () => {
    isBluetoothEnabled().then((result) => setIsBluetoothOn(result))
  }, [])

  useEffect(() => {
    determineIsBluetoothOn()
  }, [determineIsBluetoothOn])

  useAppState({ onForeground: () => determineIsBluetoothOn() })

  return isBluetoothOn
}

const useIsLocationOn = () => {
  const [isLocationOn, setIsLocationOn] = useState(false)

  const determineIsLocationOn = useCallback(async () => {
    if (Platform.OS === "android") {
      isLocationEnabled().then((result) => setIsLocationOn(result))
    } else {
      setIsLocationOn(true)
    }
  }, [])

  useEffect(() => {
    determineIsLocationOn()
  }, [determineIsLocationOn])

  useAppState({ onForeground: () => determineIsLocationOn() })

  return isLocationOn
}

const useIsLocationNeeded = () => {
  const [isLocationNeeded, setIsLocationNeeded] = useState(false)

  const determineIsLocationNeeded = useCallback(async () => {
    if (Platform.OS === "android") {
      doesDeviceSupportLocationlessScanning().then((result) =>
        setIsLocationNeeded(!result),
      )
    } else {
      setIsLocationNeeded(false)
    }
  }, [])

  useEffect(() => {
    determineIsLocationNeeded()
  }, [determineIsLocationNeeded])

  useAppState({ onForeground: () => determineIsLocationNeeded() })

  return isLocationNeeded
}

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
