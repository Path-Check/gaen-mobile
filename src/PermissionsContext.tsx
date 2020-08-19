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

const toAuthorizationEnablementStatus = (
  enPermissionStatus: ENPermissionStatus,
): ENAuthorizationEnablementStatus => {
  const isENAuthorized = enPermissionStatus[0] === "AUTHORIZED"
  const isENEnabled = enPermissionStatus[1] === "ENABLED"

  return { authorization: isENAuthorized, enablement: isENEnabled }
}

export type ENAuthorizationEnablementStatus = {
  authorization: boolean
  enablement: boolean
}
const initialENAuthorizationEnablementStatus: ENAuthorizationEnablementStatus = toAuthorizationEnablementStatus(
  initialENPermissionStatus,
)

interface PermissionsContextState {
  notification: {
    status: PermissionStatus
    check: () => void
    request: () => void
  }
  exposureNotifications: {
    status: ENAuthorizationEnablementStatus
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
    status: initialENAuthorizationEnablementStatus,
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
  }, [])

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
  }, [checkENPermission])

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

  const isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus = toAuthorizationEnablementStatus(
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
