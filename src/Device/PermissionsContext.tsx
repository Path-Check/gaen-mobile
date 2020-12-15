import React, {
  FunctionComponent,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react"
import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions"
import { Platform } from "react-native"

import * as GaenNativeModule from "../gaen/nativeModule"
import * as DeviceInfoModule from "../Device/nativeModule"

import useOnAppStateChange from "./useOnAppStateChange"

export type NotificationPermissionStatus =
  | "Unavailable"
  | "Denied"
  | "Blocked"
  | "Granted"
  | "Unknown"

export const notificationPermissionStatusFromString = (
  status: string | void,
): NotificationPermissionStatus => {
  switch (status) {
    case "unavailable": {
      return "Unavailable"
    }
    case "denied": {
      return "Denied"
    }
    case "blocked": {
      return "Blocked"
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
  | "Active"
  | "Disabled"
  | "BluetoothOff"
  | "LocationOffAndRequired"
  | "Restricted"
  | "Paused"
  | "Unauthorized"

export type LocationRequirement = "Required" | "NotRequired" | "Unknown"

export interface PermissionsContextState {
  notification: {
    status: NotificationPermissionStatus
    check: () => void
    request: () => void
  }
  exposureNotifications: {
    status: ENPermissionStatus
  }
  locationRequirement: LocationRequirement
}

const initialState = {
  notification: {
    status: "Unknown" as const,
    check: () => {},
    request: () => {},
  },
  exposureNotifications: {
    status: "Unknown" as const,
  },
  locationRequirement: "Unknown" as const,
}

const PermissionsContext = createContext<PermissionsContextState>(initialState)

const PermissionsProvider: FunctionComponent = ({ children }) => {
  const { enPermission } = useENPermissions()
  const {
    notificationPermission,
    checkNotificationPermission,
    requestNotificationPermission,
  } = useNotificationPermissions()
  const locationRequirement = useLocationRequirement()

  return (
    <PermissionsContext.Provider
      value={{
        notification: {
          status: notificationPermission,
          check: checkNotificationPermission,
          request: requestNotificationPermission,
        },
        exposureNotifications: {
          status: enPermission,
        },
        locationRequirement,
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
    checkNotificationPermission()
  }, [])

  useOnAppStateChange(() => {
    checkNotificationPermission()
  })

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

  return {
    enPermission: enPermissionStatus,
  }
}

const useLocationRequirement = (): LocationRequirement => {
  const doesDeviceSupportLocationlessScanning = async () => {
    return await DeviceInfoModule.doesDeviceSupportLocationlessScanning()
  }

  const determineLocationRequirement = () => {
    if (Platform.OS === "ios") {
      return "NotRequired"
    } else if (doesDeviceSupportLocationlessScanning()) {
      return "NotRequired"
    } else {
      return "Required"
    }
  }

  return determineLocationRequirement()
}

const usePermissionsContext = (): PermissionsContextState => {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error("PermissionsContext must be used with a provider")
  }
  return context
}

export { PermissionsContext, PermissionsProvider, usePermissionsContext }
