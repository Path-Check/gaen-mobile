import { useEffect, useState, useCallback } from "react"
import { Platform } from "react-native"

import useOnAppStateChange from "./useOnAppStateChange"
import { isLocationEnabled } from "../gaen/nativeModule"

const useIsLocationOn = (): boolean => {
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

  useOnAppStateChange(determineIsLocationOn)

  return isLocationOn
}

export default useIsLocationOn
