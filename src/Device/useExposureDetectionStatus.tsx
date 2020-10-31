import {
  ENPermissionStatus,
  usePermissionsContext,
} from "../Device/PermissionsContext"

interface ExposureDetectionStatus {
  exposureDetectionStatus: boolean
}

export const useExposureDetectionStatus = (): ExposureDetectionStatus => {
  const {
    isBluetoothOn,
    locationPermissions,
    exposureNotifications,
  } = usePermissionsContext()

  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const isExposureNotificationsOn =
    exposureNotifications.status === ENPermissionStatus.ENABLED

  const exposureDetectionStatus =
    isExposureNotificationsOn && isBluetoothOn && !isLocationRequiredAndOff

  return { exposureDetectionStatus }
}
