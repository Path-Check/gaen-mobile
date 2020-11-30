import { usePermissionsContext } from "../Device/PermissionsContext"

type ExposureDetectionStatus = "On" | "Off"

export const useExposureDetectionStatus = (): ExposureDetectionStatus => {
  const { locationPermissions, exposureNotifications } = usePermissionsContext()

  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const isExposureNotificationsActive =
    exposureNotifications.status === "Active"

  const exposureDetectionStatus =
    isExposureNotificationsActive && !isLocationRequiredAndOff ? "On" : "Off"

  return exposureDetectionStatus
}
