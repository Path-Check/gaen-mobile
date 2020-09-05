import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  useContext,
} from "react"
import { AppState, Platform } from "react-native"

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

  useEffect(() => {
    const determineIsBluetoothOn = async () => {
      const status = await fetchIsBluetoothOn()
      setIsBluetoothOn(status)
    }

    determineIsBluetoothOn()

    const handleAppStateChange = () => {
      determineIsBluetoothOn()
    }
    addListener(handleAppStateChange)
    return removeListener(handleAppStateChange)
  }, [])

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

  useEffect(() => {
    const determineIsLocationOn = async () => {
      const status = await fetchIsLocationOn()
      setIsLocationOn(status)
    }

    determineIsLocationOn()

    const handleAppStateChange = () => {
      determineIsLocationOn()
    }
    addListener(handleAppStateChange)
    return removeListener(handleAppStateChange)
  }, [])

  return isLocationOn
}

const useIsLocationNeeded = () => {
  const [isLocationNeeded, setIsLocationNeeded] = useState(false)

  const fetchSupportsLocationlessScanning = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      return doesDeviceSupportLocationlessScanning()
    } else {
      return Promise.resolve(true)
    }
  }

  useEffect(() => {
    const determineIsLocationNeeded = async () => {
      const supportsLocationlessScanning = await fetchSupportsLocationlessScanning()
      setIsLocationNeeded(!supportsLocationlessScanning)
    }

    determineIsLocationNeeded()
  }, [])

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

type ListenerMethod = "focus" | "change"
const determineOSListener = (): ListenerMethod => {
  return Platform.select({
    ios: "change",
    android: "focus",
    default: "change",
  })
}

const addListener = (handleAppStateChange: () => void): void => {
  AppState.addEventListener(determineOSListener(), () => handleAppStateChange())
}

const removeListener = (handleAppStateChange: () => void): void => {
  AppState.removeEventListener(determineOSListener(), () =>
    handleAppStateChange(),
  )
}
