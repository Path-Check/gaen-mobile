import { useEffect, useState, useCallback } from "react"

import useOnAppStateChange from "./useOnAppStateChange"
import { isBluetoothEnabled, subscribeToBluetoothStatusEvents } from "../Device"

const useIsBluetoothOn = (): boolean => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(false)

  const determineIsBluetoothOn = useCallback(async () => {
    isBluetoothEnabled().then((result) => setIsBluetoothOn(result))
  }, [])

  useEffect(() => {
    determineIsBluetoothOn()
  }, [determineIsBluetoothOn])

  useEffect(() => {
    const subscription = subscribeToBluetoothStatusEvents(
      (enabled: boolean) => {
        setIsBluetoothOn(enabled)
      },
    )

    return () => {
      subscription.remove()
    }
  }, [])

  useOnAppStateChange(determineIsBluetoothOn)

  return isBluetoothOn
}

export default useIsBluetoothOn
