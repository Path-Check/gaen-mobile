import { useTranslation } from "react-i18next"
import { Alert, Platform } from "react-native"

import { ENPermissionStatus } from "./Device/PermissionsContext"
import { RequestAuthorizationError } from "./gaen/nativeModule"
import { useApplicationName } from "./Device/useApplicationInfo"
import { openAppSettings } from "./Device/nativeModule"
import * as NativeModule from "./gaen/nativeModule"

export const useRequestExposureNotifications = (): (() => void) => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()

  const requestExposureNotifications = async () => {
    const response = await NativeModule.requestAuthorization()
    if (response.kind === "success") {
      handleENRequestSuccess(response.status)
    } else {
      handleENRequestFailure(response.error)
    }
  }

  const handleENRequestSuccess = (status: ENPermissionStatus) => {
    switch (status) {
      case "Active":
        break
      case "BluetoothOff":
        showEnableBluetoothAlert()
        break
      default:
        showBaseExposureNotificationsAlert()
    }
  }

  const handleENRequestFailure = (error: RequestAuthorizationError) => {
    switch (error) {
      case "Restricted":
        showSetToActiveRegionAlert()
        break
      case "NotAuthorized":
        showBaseExposureNotificationsAlert()
        break
      case "Unknown":
        showBaseExposureNotificationsAlert()
        break
      default:
        showBaseExposureNotificationsAlert()
    }
  }

  const showBaseExposureNotificationsAlert = () => {
    if (Platform.OS === "ios") {
      showShareExposureInformationAlert()
    } else {
      showUseExposureNotificationsAlert()
    }
  }

  const showAlert = (title: string, body: string) => {
    Alert.alert(title, body, [
      {
        text: t("common.back"),
        style: "cancel",
      },
      {
        text: t("common.settings"),
        onPress: () => openAppSettings(),
      },
    ])
  }

  const showUseExposureNotificationsAlert = () => {
    showAlert(
      t(
        "exposure_notification_alerts.use_exposure_notifications_android_title",
      ),
      t("exposure_notification_alerts.use_exposure_notifications_android_body"),
    )
  }

  const showShareExposureInformationAlert = () => {
    showAlert(
      t("exposure_notification_alerts.share_exposure_information_ios_title"),
      t("exposure_notification_alerts.share_exposure_information_ios_body"),
    )
  }

  const showSetToActiveRegionAlert = () => {
    showAlert(
      t("exposure_notification_alerts.set_active_region_ios_title"),
      t("exposure_notification_alerts.set_active_region_ios_body"),
    )
  }

  const showEnableBluetoothAlert = () => {
    showAlert(
      t("exposure_notification_alerts.bluetooth_title", {
        applicationName,
      }),
      t("exposure_notification_alerts.bluetooth_body"),
    )
  }

  return requestExposureNotifications
}
