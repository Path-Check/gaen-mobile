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
  isBluetoothOn: boolean
  isLocationOn: boolean
  isLocationNeeded: boolean
}

const initialState: ActivationState = {
  isBluetoothOn: false,
  isLocationOn: false,
  isLocationNeeded: true,
}

export const ActivationContext = createContext<ActivationState>(initialState)

const ActivationProvider: FunctionComponent = ({ children }) => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(false)
  const [isLocationOn, setIsLocationOn] = useState(false)
  const [isLocationNeeded, setIsLocationNeeded] = useState(false)

  const fetchBTStatus = async (): Promise<boolean> => {
    return isBluetoothEnabled()
  }

  useEffect(() => {
    const determineIsBluetoothOn = async () => {
      const status = await fetchBTStatus()
      setIsBluetoothOn(status)
    }
    determineIsBluetoothOn()
    addListener(determineIsBluetoothOn)
    return removeListener(determineIsBluetoothOn)
  }, [])

  const fetchIsLocationOn = async (): Promise<boolean> => {
    return Platform.select({
      android: isLocationEnabled(),
      ios: new Promise(() => true),
      default: new Promise(() => true),
    })
  }

  const fetchSupportsLocationlessScanning = async (): Promise<boolean> => {
    return Platform.select({
      android: doesDeviceSupportLocationlessScanning(),
      ios: new Promise(() => true),
      default: new Promise(() => true),
    })
  }

  useEffect(() => {
    const determineIsLocationOn = async () => {
      const status = await fetchIsLocationOn()
      setIsLocationOn(status)
    }
    determineIsLocationOn()
    addListener(determineIsLocationOn)
    return removeListener(determineIsLocationOn)
  }, [])

  useEffect(() => {
    const determineLocationIsNeeded = async () => {
      const supportsLocationlessScanning = await fetchSupportsLocationlessScanning()
      setIsLocationNeeded(!supportsLocationlessScanning)
    }
    determineLocationIsNeeded()
  }, [])

  return (
    <ActivationContext.Provider
      value={{
        isBluetoothOn,
        isLocationOn,
        isLocationNeeded,
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

const addListener = (listener: () => void) => {
  return AppState.addEventListener(determineOSListener(), () => listener())
}

const removeListener = (listener: () => void) => {
  return AppState.removeEventListener(determineOSListener(), () => listener())
}
