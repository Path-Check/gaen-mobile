import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
  useContext,
} from "react"
import { AppState, Platform } from "react-native"
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

  const fetchIsBluetoothOn = async (): Promise<boolean> => {
    return isBluetoothEnabled()
  }

  const determineIsBluetoothOn = useCallback(async () => {
    const status = await fetchIsBluetoothOn()
    setIsBluetoothOn(status)
  }, [])

  useEffect(() => {
    determineIsBluetoothOn()
  }, [determineIsBluetoothOn])

  useAppState({ onForeground: () => determineIsBluetoothOn() })

  return isBluetoothOn
}

const useIsLocationOn = () => {
  const [isLocationOn, setIsLocationOn] = useState(false)

  const fetchIsLocationOn = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      return isLocationEnabled()
    } else {
      return Promise.resolve(true)
    }
  }

  const determineIsLocationOn = useCallback(async () => {
    console.log("on run")
    const status = await fetchIsLocationOn()
    setIsLocationOn(status)
  }, [])

  useEffect(() => {
    determineIsLocationOn()
  }, [determineIsLocationOn])

  useAppState({ onForeground: () => determineIsLocationOn() })

  return isLocationOn
}

const useIsLocationNeeded = () => {
  const [isLocationNeeded, setIsLocationNeeded] = useState(false)

  const fetchIsLocationNeeded = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      return !doesDeviceSupportLocationlessScanning()
    } else {
      return Promise.resolve(true)
    }
  }

  const determineIsLocationNeeded = useCallback(async () => {
    console.log("need run")
    const status = await fetchIsLocationNeeded()
    setIsLocationNeeded(status)
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
