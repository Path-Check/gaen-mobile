import { useEffect, useState, useCallback } from "react"
import { Platform } from "react-native"

import useOnAppStateChange from "./useOnAppStateChange"
import { doesDeviceSupportLocationlessScanning } from "../gaen/nativeModule"

const useIsLocationRequired = (): boolean => {
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

  useEffect(() => {
    determineIsLocationRequired()
  }, [determineIsLocationRequired])

  useOnAppStateChange(determineIsLocationRequired)

  return isLocationRequired
}

export default useIsLocationRequired
