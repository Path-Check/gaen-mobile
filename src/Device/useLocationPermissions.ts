import { useEffect, useState, useCallback } from "react"
import { Platform } from "react-native"

import useOnAppStateChange from "./useOnAppStateChange"
import {
  subscribeToLocationStatusEvents,
  isLocationEnabled,
  doesDeviceSupportLocationlessScanning,
} from "../Device"

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
        const enabledState = result ? "On" : "Off"
        setLocationEnabledState(enabledState)
      })
    }
  }, [isLocationRequired])

  useEffect(() => {
    determineIsLocationRequired()
    determineLocationEnabledState()
  }, [determineIsLocationRequired, determineLocationEnabledState])

  useEffect((): (() => void) | void => {
    if (Platform.OS === "android") {
      const subscription = subscribeToLocationStatusEvents(
        (enabled: boolean) => {
          const enabledState = enabled ? "On" : "Off"
          setLocationEnabledState(enabledState)
        },
      )

      return () => {
        subscription.remove()
      }
    }
  }, [])

  const handleOnAppStateChange = useCallback(() => {
    if (isLocationRequired) {
      determineLocationEnabledState()
    }
  }, [isLocationRequired, determineLocationEnabledState])

  useOnAppStateChange(handleOnAppStateChange)

  const locationPermissions = determineLocationPermissions(
    isLocationRequired,
    locationEnabledState,
  )

  return locationPermissions
}

export default useLocationPermissions

const determineLocationPermissions = (
  isLocationRequired: boolean,
  locationEnabledState: LocationEnabledState,
): LocationPermissions => {
  if (!isLocationRequired) {
    return "NotRequired"
  } else if (locationEnabledState === "Off") {
    return "RequiredOff"
  } else {
    return "RequiredOn"
  }
}
