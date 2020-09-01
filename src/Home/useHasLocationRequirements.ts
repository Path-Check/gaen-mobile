import { useEffect, useState } from "react"
import { AppState, Platform } from "react-native"

import { isLocationEnabled } from "../gaen/nativeModule"
import { doesDeviceSupportLocationlessScanning } from "../gaen/nativeModule"
import determineOSListener from "./determineOSListener"

interface LocationRequirements {
  isLocationOn: boolean
  isLocationNeeded: boolean
  isLocationOffAndNeeded: boolean
}

const useIsLocationOn = (): Pick<LocationRequirements, "isLocationOn"> => {
  const [isLocationOn, setIsLocationOn] = useState(false)

  useEffect(() => {
    const determineIsLocationOn = async () => {
      const status = await fetchIsLocationOn()
      setIsLocationOn(status)
    }

    determineIsLocationOn()

    AppState.addEventListener(determineOSListener(), () =>
      determineIsLocationOn(),
    )

    return AppState.removeEventListener(determineOSListener(), () =>
      determineIsLocationOn(),
    )
  }, [])

  return { isLocationOn }
}

const useIsLocationNeeded = (): Pick<
  LocationRequirements,
  "isLocationNeeded"
> => {
  const [isLocationNeeded, setIsLocationNeeded] = useState(false)

  useEffect(() => {
    const determineLocationIsNeeded = async () => {
      const supportsLocationlessScanning = await fetchSupportsLocationlessScanning()
      setIsLocationNeeded(!supportsLocationlessScanning)
    }

    determineLocationIsNeeded()
  }, [])

  return { isLocationNeeded }
}

const useIsLocationOffAndNeeded = (): Pick<
  LocationRequirements,
  "isLocationOffAndNeeded"
> => {
  const { isLocationOn } = useIsLocationOn()
  const { isLocationNeeded } = useIsLocationNeeded()
  console.log({ isLocationNeeded })

  const isLocationOffAndNeeded = isLocationNeeded && !isLocationOn

  return { isLocationOffAndNeeded }
}

const useHasLocationRequirements = (): LocationRequirements => {
  const { isLocationOn } = useIsLocationOn()
  const { isLocationNeeded } = useIsLocationNeeded()
  const { isLocationOffAndNeeded } = useIsLocationOffAndNeeded()

  return { isLocationOn, isLocationNeeded, isLocationOffAndNeeded }
}

const fetchIsLocationOn = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    return isLocationEnabled()
  } else {
    return true
  }
}

const fetchSupportsLocationlessScanning = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    return doesDeviceSupportLocationlessScanning()
  } else {
    return true
  }
}

export { useHasLocationRequirements }
