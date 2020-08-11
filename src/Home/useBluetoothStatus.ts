import { useEffect, useState } from "react"
import { Platform, AppState } from "react-native"
import { isBluetoothEnabled } from "../gaen/nativeModule"

export const useBluetoothStatus = (): boolean => {
  const [btStatus, setBTStatus] = useState(false)
  useEffect(() => {
    const fetchBTEnabled = async () => {
      const status = await fetchBTStatus()
      setBTStatus(status)
    }

    AppState.addEventListener(determineOSListener(), () => fetchBTEnabled())
    return AppState.removeEventListener(determineOSListener(), () =>
      fetchBTEnabled(),
    )
  }, [])

  return btStatus
}

const fetchBTStatus = async (): Promise<boolean> => {
  return isBluetoothEnabled()
}

type ListenerMethod = "focus" | "change"
const determineOSListener = (): ListenerMethod => {
  return Platform.select({
    ios: "change",
    android: "focus",
    default: "change",
  })
}
