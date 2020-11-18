import React, {
  FunctionComponent,
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react"
import { Platform } from "react-native"
import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions"

import * as GaenNativeModule from "../gaen/nativeModule"
import * as DeviceNativeModule from "./nativeModule"
import useOnAppStateChange from "./useOnAppStateChange"
import useLocationPermissions, {
  LocationPermissions,
} from "./useLocationPermissions"

export type NotificationPermissionStatus = "Unknown" | "Granted" | "Denied"

export const notificationPermissionStatusFromString = (
  status: string | void,
): NotificationPermissionStatus => {
  switch (status) {
    case "unknown": {
      return "Unknown"
    }
    case "denied": {
      return "Denied"
    }
    case "blocked": {
      return "Denied"
    }
    case "granted": {
      return "Granted"
    }
    default: {
      return "Unknown"
    }
  }
}

export type ENPermissionStatus =
  | "Unknown"
  | "NotAuthorized"
  | "Disabled"
  | "Enabled"

export interface PermissionsContextState {
  isBluetoothOn: boolean
  locationPermissions: LocationPermissions
  notification: {
    status: NotificationPermissionStatus
    check: () => void
    request: () => void
  }
  exposureNotifications: {
    status: ENPermissionStatus
    request: () => Promise<GaenNativeModule.RequestAuthorizationResponse>
  }
}

const initialState = {
  isBluetoothOn: false,
  locationPermissions: "RequiredOff" as const,
  notification: {
    status: "Unknown" as const,
    check: () => {},
    request: () => {},
  },
  exposureNotifications: {
    status: "Unknown" as const,
    request: () =>
      Promise.resolve({ kind: "failure" as const, error: "Unknown" as const }),
  },
}

const PermissionsContext = createContext<PermissionsContextState>(initialState)

const PermissionsProvider: FunctionComponent = ({ children }) => {
  const isBluetoothOn = useIsBluetoothOn()
  const locationPermissions = useLocationPermissions()
  const { enPermission, requestENPermission } = useENPermissions()
  const {
    notificationPermission,
    checkNotificationPermission,
    requestNotificationPermission,
  } = useNotificationPermissions()

  return (
    <PermissionsContext.Provider
      value={{
        isBluetoothOn,
        locationPermissions,
        notification: {
          status: notificationPermission,
          check: checkNotificationPermission,
          request: requestNotificationPermission,
        },
        exposureNotifications: {
          status: enPermission,
          request: requestENPermission,
        },
      }}
    >
      {children}
    </PermissionsContext.Provider>
  )
}

const useNotificationPermissions = () => {
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermissionStatus
  >("Unknown")

  useEffect(() => {
    if (Platform.OS === "ios") {
      checkNotificationPermission()
    }
  }, [])

  const checkNotificationPermission = async () => {
    const { status } = await checkNotifications()
    setNotificationPermission(notificationPermissionStatusFromString(status))
  }

  const requestNotificationPermission = async () => {
    const { status } = await requestNotifications(["alert", "sound"])
    setNotificationPermission(notificationPermissionStatusFromString(status))
    return status
  }

  return {
    notificationPermission,
    checkNotificationPermission,
    requestNotificationPermission,
  }
}

const useENPermissions = () => {
  const [enPermissionStatus, setEnPermissionStatus] = useState<
    ENPermissionStatus
  >("Unknown")

  const checkENPermission = () => {
    const handleNativeResponse = (status: ENPermissionStatus) => {
      setEnPermissionStatus(status)
    }
    GaenNativeModule.getCurrentENPermissionsStatus(handleNativeResponse)
  }

  useEffect(() => {
    checkENPermission()
  }, [])

  useOnAppStateChange(checkENPermission)

  useEffect(() => {
    const subscription = GaenNativeModule.subscribeToEnabledStatusEvents(
      (status: ENPermissionStatus) => {
        setEnPermissionStatus(status)
      },
    )

    return () => {
      subscription?.remove()
    }
  }, [])

  const requestENPermission = async () => {
    return GaenNativeModule.requestAuthorization()
  }

  return {
    enPermission: enPermissionStatus,
    requestENPermission,
  }
}

const useIsBluetoothOn = (): boolean => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(false)

  const determineIsBluetoothOn = useCallback(async () => {
    DeviceNativeModule.isBluetoothEnabled().then((result) =>
      setIsBluetoothOn(result),
    )
  }, [])

  useEffect(() => {
    determineIsBluetoothOn()
  }, [determineIsBluetoothOn])

  useEffect(() => {
    const subscription = DeviceNativeModule.subscribeToBluetoothStatusEvents(
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

const usePermissionsContext = (): PermissionsContextState => {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error("PermissionsContext must be used with a provider")
  }
  return context
}

export { PermissionsContext, PermissionsProvider, usePermissionsContext }
