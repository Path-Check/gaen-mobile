import { useEffect, useState } from "react"
import { AppState } from "react-native"

import { isBluetoothEnabled } from "./gaen/nativeModule"
import determineOSListener from "./determineOSListener"

export const useBluetoothStatus = (): boolean => {
  const [btStatus, setBTStatus] = useState(false)

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

  return btStatus
}

const fetchBTStatus = async (): Promise<boolean> => {
  return isBluetoothEnabled()
}
