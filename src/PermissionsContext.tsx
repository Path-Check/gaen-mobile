import React, {
  FunctionComponent,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react"

import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions"
import { Platform } from "react-native"
import { PermissionStatus, statusToEnum } from "./permissionStatus"

type ENEnablement = `DISABLED` | `ENABLED`
type ENAuthorization = `UNAUTHORIZED` | `AUTHORIZED`
import gaenStrategy from "./gaen"

export type ENPermissionStatus = [ENAuthorization, ENEnablement]

const initialENStatus: ENPermissionStatus = ["UNAUTHORIZED", "DISABLED"]
const { permissionStrategy } = gaenStrategy

interface PermissionContextState {
  notification: {
    status: PermissionStatus
    check: () => void
    request: () => void
  }
  exposureNotifications: {
    status: ENPermissionStatus
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

const PermissionsContext = createContext<PermissionContextState>(initialState)

export interface PermissionStrategy {
  statusSubscription: (
    cb: (status: ENPermissionStatus) => void,
  ) => { remove: () => void }
  check: (cb: (status: ENPermissionStatus) => void) => void
  request: (cb: (response: string) => void) => void
}

const PermissionsProvider: FunctionComponent = ({ children }) => {
  const [
    exposureNotificationsPermission,
    setExposureNotificationsPermission,
  ] = useState<ENPermissionStatus>(initialENStatus)

  const [notificationPermission, setNotificationPermission] = useState(
    PermissionStatus.UNKNOWN,
  )

  const checkENPermission = useCallback(() => {
    const handleNativeResponse = (status: ENPermissionStatus) => {
      setExposureNotificationsPermission(status)
    }
    permissionStrategy.check(handleNativeResponse)
  }, [])

  useEffect(() => {
    const subscription = permissionStrategy.statusSubscription(
      (status: ENPermissionStatus) => {
        setExposureNotificationsPermission(status)
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

  return (
    <PermissionsContext.Provider
      value={{
        notification: {
          status: notificationPermission,
          check: checkNotificationPermission,
          request: requestNotificationPermission,
        },
        exposureNotifications: {
          status: exposureNotificationsPermission,
          check: checkENPermission,
          request: requestENPermission,
        },
      }}
    >
      {children}
    </PermissionsContext.Provider>
  )
}

export { PermissionsProvider }
export default PermissionsContext
