import { useEffect, useState, useCallback } from "react"
import { Platform } from "react-native"

import useOnAppStateChange from "./useOnAppStateChange"
import { doesDeviceSupportLocationlessScanning } from "../gaen/nativeModule"

const useIsLocationNeeded = (): boolean => {
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

  useOnAppStateChange(() => determineIsLocationNeeded)

  return isLocationNeeded
}

export default useIsLocationNeeded
