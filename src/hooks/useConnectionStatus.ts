import { useState, useEffect } from "react"
import NetInfo from "@react-native-community/netinfo"

export const useConnectionStatus = (): boolean => {
  const [isConnected, setIsConnected] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // netInfo state comes as null while unresolved so to avoid flicker we only set component state
      // if the netInfo state is resolved to boolean
      if (typeof state.isInternetReachable === "boolean") {
        setIsConnected(state.isInternetReachable)
      }
    })
    return unsubscribe
  }, [])

  return isConnected
}
