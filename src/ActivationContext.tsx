import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  useContext,
} from "react"
import { Platform } from "react-native"

import { isBluetoothEnabled } from "./gaen/nativeModule"

import { isLocationEnabled } from "./gaen/nativeModule"
import { doesDeviceSupportLocationlessScanning } from "./gaen/nativeModule"

import { AppState } from "react-native"

export interface ActivationState {
  btStatus: boolean
  isLocationOn: boolean
  isLocationNeeded: boolean
  isLocationOffAndNeeded: boolean
}

const initialState: ActivationState = {
  btStatus: false,
  isLocationOn: false,
  isLocationNeeded: true,
  isLocationOffAndNeeded: false,
}

export const ActivationContext = createContext<ActivationState>(initialState)

const ActivationProvider: FunctionComponent = ({ children }) => {
  const [btStatus, setBTStatus] = useState(false)
  const [isLocationOn, setIsLocationOn] = useState(false)
  const [isLocationNeeded, setIsLocationNeeded] = useState(false)

  // Bluetooth
  const fetchBTStatus = async (): Promise<boolean> => {
    return isBluetoothEnabled()
  }
  useEffect(() => {
    const determineBTStatus = async () => {
      const status = await fetchBTStatus()
      setBTStatus(status)
    }
    determineBTStatus()
    AppState.addEventListener(determineOSListener(), () => determineBTStatus())
    return AppState.removeEventListener(determineOSListener(), () =>
      determineBTStatus(),
    )
  }, [])

  // Location
  const fetchIsLocationOn = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      return isLocationEnabled()
    } else {
      return true
    }
  }
  const fetchSupportsLocationlessScanning = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      return doesDeviceSupportLocationlessScanning()
    } else {
      return true
    }
  }
  useEffect(() => {
    const determineIsLocationOn = async () => {
      const status = await fetchIsLocationOn()
      setIsLocationOn(status)
    }
    determineIsLocationOn()
    AppState.addEventListener(determineOSListener(), () =>
      determineIsLocationOn(),
    )
    return AppState.removeEventListener(determineOSListener(), () =>
      determineIsLocationOn(),
    )
  }, [])
  useEffect(() => {
    const determineLocationIsNeeded = async () => {
      const supportsLocationlessScanning = await fetchSupportsLocationlessScanning()
      setIsLocationNeeded(!supportsLocationlessScanning)
    }
    determineLocationIsNeeded()
  }, [])
  const isLocationOffAndNeeded = isLocationNeeded && !isLocationOn

  return (
    <ActivationContext.Provider
      value={{
        btStatus,
        isLocationOn,
        isLocationNeeded,
        isLocationOffAndNeeded,
      }}
    >
      {children}
    </ActivationContext.Provider>
  )
}

const useActivationContext = (): ActivationState => {
  const context = useContext(ActivationContext)
  if (context === undefined) {
    throw new Error("ActivationContext muse be used with a provider")
  }
  return context
}

export { ActivationProvider, useActivationContext }

type ListenerMethod = "focus" | "change"

const determineOSListener = (): ListenerMethod => {
  return Platform.select({
    ios: "change",
    android: "focus",
    default: "change",
  })
}
