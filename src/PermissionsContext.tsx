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
import { isPlatformiOS } from "./utils"

type ENAuthorizationStatus = `UNAUTHORIZED` | `AUTHORIZED`
type ENEnablementStatus = `DISABLED` | `ENABLED`
export type RawENPermissionStatus = [ENAuthorizationStatus, ENEnablementStatus]
const initialENPermissionStatus: RawENPermissionStatus = [
  "UNAUTHORIZED",
  "DISABLED",
]

export enum ENPermissionStatus {
  NOT_AUTHORIZED,
  DISABLED,
  ENABLED,
}

const toENPermissionStatusEnum = (
  enPermissionStatus: RawENPermissionStatus,
): ENPermissionStatus => {
  const isAuthorized = enPermissionStatus[0] === "AUTHORIZED"
  const isEnabled = enPermissionStatus[1] === "ENABLED"

  if (!isAuthorized) {
    return isPlatformiOS()
      ? ENPermissionStatus.NOT_AUTHORIZED
      : ENPermissionStatus.DISABLED
  } else if (!isEnabled) {
    return ENPermissionStatus.DISABLED
  } else {
    return ENPermissionStatus.ENABLED
  }
}

const initialENStatus: ENPermissionStatus = toENPermissionStatusEnum(
  initialENPermissionStatus,
)

export interface PermissionsContextState {
  notification: {
    status: PermissionStatus
    check: () => void
    request: () => void
  }
  exposureNotifications: {
    status: ENPermissionStatus
    check: () => void
    request: () => Promise<void>
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
    request: () => Promise.resolve(),
  },
}

const PermissionsContext = createContext<PermissionsContextState>(initialState)

export interface PermissionStrategy {
  statusSubscription: (
    cb: (status: RawENPermissionStatus) => void,
  ) => { remove: () => void }
  check: (cb: (status: RawENPermissionStatus) => void) => void
  request: () => Promise<void>
}

const PermissionsProvider: FunctionComponent = ({ children }) => {
  const [
    exposureNotificationsPermissionStatus,
    setExposureNotificationsPermissionStatus,
  ] = useState<RawENPermissionStatus>(initialENPermissionStatus)

  const [notificationPermission, setNotificationPermission] = useState(
    PermissionStatus.UNKNOWN,
  )

  const { permissionStrategy } = gaenStrategy

  const checkENPermission = useCallback(() => {
    const handleNativeResponse = (status: RawENPermissionStatus) => {
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
      (status: RawENPermissionStatus) => {
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

  const requestENPermission = async () => {
    return permissionStrategy.request()
  }

  const requestNotificationPermission = async () => {
    const { status } = await requestNotifications(["alert", "sound"])
    setNotificationPermission(statusToEnum(status))
    return status
  }

  const enPermission: ENPermissionStatus = toENPermissionStatusEnum(
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
          status: enPermission,
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
