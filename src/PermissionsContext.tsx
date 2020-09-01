import React, {
  FunctionComponent,
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react"
import { Platform, AppState } from "react-native"
import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions"

import { PermissionStatus, statusToEnum } from "./permissionStatus"
import gaenStrategy from "./gaen"

type ENAuthorizationStatus = `UNAUTHORIZED` | `AUTHORIZED`
type ENEnablementStatus = `DISABLED` | `ENABLED`
export type ENPermissionStatus = [ENAuthorizationStatus, ENEnablementStatus]
const initialENPermissionStatus: ENPermissionStatus = [
  "UNAUTHORIZED",
  "DISABLED",
]

export enum ENStatus {
  UNAUTHORIZED_DISABLED,
  AUTHORIZED_DISABLED,
  AUTHORIZED_ENABLED,
}

const toENStatus = (enPermissionStatus: ENPermissionStatus): ENStatus => {
  const isAuthorized = enPermissionStatus[0] === "AUTHORIZED"
  const isEnabled = enPermissionStatus[1] === "ENABLED"

  if (!isAuthorized && !isEnabled) {
    return ENStatus.UNAUTHORIZED_DISABLED
  }

  if (isAuthorized && !isEnabled) {
    return ENStatus.AUTHORIZED_DISABLED
  }

  if (isAuthorized && isEnabled) {
    return ENStatus.AUTHORIZED_ENABLED
  }

  return ENStatus.UNAUTHORIZED_DISABLED
}

const initialENStatus: ENStatus = toENStatus(initialENPermissionStatus)

export interface PermissionsContextState {
  notification: {
    status: PermissionStatus
    check: () => void
    request: () => void
  }
  exposureNotifications: {
    status: ENStatus
    check: () => void
    request: () => void
  }
}

const initialState = {
  notification: {
    status: PermissionStatus.UNKNOWN,
    check: () => {},
    request: () => {},
  },
  exposureNotifications: {
    status: initialENStatus,
    check: () => {},
    request: () => {},
  },
}

const PermissionsContext = createContext<PermissionsContextState>(initialState)

export interface PermissionStrategy {
  statusSubscription: (
    cb: (status: ENPermissionStatus) => void,
  ) => { remove: () => void }
  check: (cb: (status: ENPermissionStatus) => void) => void
  request: (cb: (response: string) => void) => void
}

const PermissionsProvider: FunctionComponent = ({ children }) => {
  const [
    exposureNotificationsPermissionStatus,
    setExposureNotificationsPermissionStatus,
  ] = useState<ENPermissionStatus>(initialENPermissionStatus)

  const [notificationPermission, setNotificationPermission] = useState(
    PermissionStatus.UNKNOWN,
  )

  const { permissionStrategy } = gaenStrategy

  const checkENPermission = useCallback(() => {
    const handleNativeResponse = (status: ENPermissionStatus) => {
      setExposureNotificationsPermissionStatus(status)
    }
    permissionStrategy.check(handleNativeResponse)
  }, [permissionStrategy])

  useEffect(() => {
    const handleAppStateChange = () => {
      checkENPermission()
    }

    AppState.addEventListener("change", handleAppStateChange)
    const subscription = permissionStrategy.statusSubscription(
      (status: ENPermissionStatus) => {
        setExposureNotificationsPermissionStatus(status)
      },
    )

    const checkAllPermissions = async () => {
      const isiOS = Platform.OS === "ios"
      await Promise.all([
        isiOS ? checkNotificationPermission() : null,
        checkENPermission(),
      ])
    }

    checkAllPermissions()

    return () => {
      subscription?.remove()
      AppState.removeEventListener("change", handleAppStateChange)
    }
  }, [checkENPermission, permissionStrategy])

  const checkNotificationPermission = async () => {
    const { status } = await checkNotifications()
    setNotificationPermission(statusToEnum(status))
  }

  const requestENPermission = () => {
    const handleNativeResponse = () => {}
    permissionStrategy.request(handleNativeResponse)
  }

  const requestNotificationPermission = async () => {
    const { status } = await requestNotifications(["alert", "sound"])
    setNotificationPermission(statusToEnum(status))
    return status
  }

  const isENAuthorizedAndEnabled: ENStatus = toENStatus(
    exposureNotificationsPermissionStatus,
  )

  return (
    <PermissionsContext.Provider
      value={{
        notification: {
          status: notificationPermission,
          check: checkNotificationPermission,
          request: requestNotificationPermission,
        },
        exposureNotifications: {
          status: isENAuthorizedAndEnabled,
          check: checkENPermission,
          request: requestENPermission,
        },
      }}
    >
      {children}
    </PermissionsContext.Provider>
  )
}

const usePermissionsContext = (): PermissionsContextState => {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error("PermissionsContext must be used with a provider")
  }
  return context
}

export { PermissionsContext, PermissionsProvider, usePermissionsContext }
