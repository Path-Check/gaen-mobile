import { useState, useEffect } from "react"
import NetInfo from "@react-native-community/netinfo"

export const useConnectionStatus = (): boolean => {
  const [isInternetReachable, setIsInternetReachable] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (typeof state.isInternetReachable === "boolean") {
        setIsInternetReachable(state.isInternetReachable)
      }
    })
    return unsubscribe
  }, [])

  return isInternetReachable
}
