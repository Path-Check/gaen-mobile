import { useEffect, useState, useCallback } from "react"
import { Platform } from "react-native"

import useOnAppStateChange from "./useOnAppStateChange"
import { isLocationEnabled } from "../gaen/nativeModule"
import { doesDeviceSupportLocationlessScanning } from "../gaen/nativeModule"

export type LocationPermissions = "NotRequired" | "RequiredOff" | "RequiredOn"

const useLocationPermissions = (): LocationPermissions => {
  const [isLocationOn, setIsLocationOn] = useState(false)
  const [isLocationRequired, setIsLocationRequired] = useState(false)

  const determineIsLocationRequired = useCallback(async () => {
    if (Platform.OS === "android") {
      doesDeviceSupportLocationlessScanning().then((result) =>
        setIsLocationRequired(!result),
      )
    } else {
      setIsLocationRequired(false)
    }
  }, [])

  const determineIsLocationOn = useCallback(async () => {
    if (isLocationRequired) {
      isLocationEnabled().then((result) => setIsLocationOn(result))
    }
  }, [isLocationRequired])

  const handleOnAppStateChange = useCallback(() => {
    determineIsLocationOn()
    determineIsLocationRequired()
  }, [determineIsLocationOn, determineIsLocationRequired])

  useEffect(() => {
    handleOnAppStateChange()
  }, [handleOnAppStateChange])

  useOnAppStateChange(handleOnAppStateChange)

  const determineLocationPermissions = (): LocationPermissions => {
    if (!isLocationRequired) {
      return "NotRequired"
    } else if (!isLocationOn) {
      return "RequiredOff"
    } else {
      return "RequiredOn"
    }
  }

  const locationPermissions = determineLocationPermissions()

  return locationPermissions
}

export default useLocationPermissions
