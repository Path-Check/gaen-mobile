import { usePermissionsContext } from "../Device/PermissionsContext"

interface ExposureDetectionStatus {
  exposureDetectionStatus: boolean
}

export const useExposureDetectionStatus = (): ExposureDetectionStatus => {
  const { locationPermissions, exposureNotifications } = usePermissionsContext()

  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const isExposureNotificationsOn = exposureNotifications.status === "Active"

  const exposureDetectionStatus =
    isExposureNotificationsOn && !isLocationRequiredAndOff

  return { exposureDetectionStatus }
}
