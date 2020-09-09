import { useEffect, useState, useCallback } from "react"

import useOnAppStateChange from "./useOnAppStateChange"
import { isBluetoothEnabled } from "../gaen/nativeModule"

const useIsBluetoothOn = (): boolean => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(false)

  const determineIsBluetoothOn = useCallback(async () => {
    isBluetoothEnabled().then((result) => setIsBluetoothOn(result))
  }, [])

  useEffect(() => {
    determineIsBluetoothOn()
  }, [determineIsBluetoothOn])

  useOnAppStateChange(determineIsBluetoothOn)

  return isBluetoothOn
}

export default useIsBluetoothOn
