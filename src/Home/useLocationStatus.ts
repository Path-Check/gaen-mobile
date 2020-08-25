import { useEffect, useState } from "react"
import { AppState } from "react-native"
import { isLocationEnabledAndroid } from "../gaen/nativeModule"
import determineOSListener from "./determineOSListener"

export const useLocationStatus = (): boolean => {
  const [locationStatus, setLocationStatus] = useState(false)
  useEffect(() => {
    const fetchLocationStatusEnabled = async () => {
      const status = await fetchLocationStatus()
      setLocationStatus(status)
    }

    fetchLocationStatusEnabled()

    AppState.addEventListener(determineOSListener(), () =>
      fetchLocationStatusEnabled(),
    )

    return AppState.removeEventListener(determineOSListener(), () =>
      fetchLocationStatusEnabled(),
    )
  }, [])

  return locationStatus
}

const fetchLocationStatus = async (): Promise<boolean> => {
  return isLocationEnabledAndroid()
}
