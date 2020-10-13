import {
  ENPermissionStatus,
  usePermissionsContext,
} from "../PermissionsContext"
import { useSystemServicesContext } from "../SystemServicesContext"

interface ExposureDetectionStatus {
  exposureDetectionStatus: boolean
}

export const useExposureDetectionStatus = (): ExposureDetectionStatus => {
  const { isBluetoothOn, locationPermissions } = useSystemServicesContext()
  const { exposureNotifications } = usePermissionsContext()

  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const isExposureNotificationsOn =
    exposureNotifications.status === ENPermissionStatus.ENABLED

  const exposureDetectionStatus =
    isExposureNotificationsOn && isBluetoothOn && !isLocationRequiredAndOff

  return { exposureDetectionStatus }
}
