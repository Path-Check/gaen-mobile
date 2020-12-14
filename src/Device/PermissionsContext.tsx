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

import * as GaenNativeModule from "../gaen/nativeModule"
import useOnAppStateChange from "./useOnAppStateChange"
import useLocationPermissions, {
  LocationPermissions,
} from "./useLocationPermissions"

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
  | "Restricted"
  | "Paused"
  | "Unauthorized"

export interface PermissionsContextState {
  locationPermissions: LocationPermissions
  notification: {
    status: NotificationPermissionStatus
    check: () => void
    request: () => void
  }
  exposureNotifications: {
    status: ENPermissionStatus
  }
}

const initialState = {
  locationPermissions: "RequiredOff" as const,
  notification: {
    status: "Unknown" as const,
    check: () => {},
    request: () => {},
  },
  exposureNotifications: {
    status: "Unknown" as const,
  },
}

const PermissionsContext = createContext<PermissionsContextState>(initialState)

const PermissionsProvider: FunctionComponent = ({ children }) => {
  const locationPermissions = useLocationPermissions()
  const { enPermission } = useENPermissions()
  const {
    notificationPermission,
    checkNotificationPermission,
    requestNotificationPermission,
  } = useNotificationPermissions()

  return (
    <PermissionsContext.Provider
      value={{
        locationPermissions,
        notification: {
          status: notificationPermission,
          check: checkNotificationPermission,
          request: requestNotificationPermission,
        },
        exposureNotifications: {
          status: enPermission,
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

const usePermissionsContext = (): PermissionsContextState => {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error("PermissionsContext must be used with a provider")
  }
  return context
}

export { PermissionsContext, PermissionsProvider, usePermissionsContext }
