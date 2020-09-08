import { useEffect, useState, useCallback } from "react"
import { Platform } from "react-native"

import useOnAppStateChange from "./useOnAppStateChange"
import { isLocationEnabled } from "../gaen/nativeModule"
import { doesDeviceSupportLocationlessScanning } from "../gaen/nativeModule"

export type LocationPermissions = "NotRequired" | "RequiredOff" | "RequiredOn"
type LocationEnabledState = "Unknown" | "Off" | "On"

const useLocationPermissions = (): LocationPermissions => {
  const [locationEnabledState, setLocationEnabledState] = useState<
    LocationEnabledState
  >("Unknown")
  const [isLocationRequired, setIsLocationRequired] = useState(false)

  const determineIsLocationRequired = useCallback(async () => {
    if (Platform.OS === "android") {
      doesDeviceSupportLocationlessScanning().then((result) =>
        setIsLocationRequired(!result),
      )
    }
  }, [])

  const determineLocationEnabledState = useCallback(async () => {
    if (isLocationRequired) {
      isLocationEnabled().then((result) => {
        if (result) {
          setLocationEnabledState("On")
        } else {
          setLocationEnabledState("Off")
        }
      })
    }
  }, [isLocationRequired])

  useEffect(() => {
    determineIsLocationRequired()
    determineLocationEnabledState()
  }, [determineIsLocationRequired, determineLocationEnabledState])

  const handleOnAppStateChange = useCallback(() => {
    if (isLocationRequired) {
      determineLocationEnabledState()
    }
  }, [isLocationRequired, determineLocationEnabledState])

  useOnAppStateChange(handleOnAppStateChange)

  const determineLocationPermissions = (): LocationPermissions => {
    if (!isLocationRequired) {
      return "NotRequired"
    } else if (locationEnabledState === "Off") {
      return "RequiredOff"
    } else {
      return "RequiredOn"
    }
  }

  const locationPermissions = determineLocationPermissions()

  return locationPermissions
}

export default useLocationPermissions
