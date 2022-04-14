import { useTranslation } from "react-i18next"
import { Alert, Platform } from "react-native"

import { useApplicationName } from "./Device/useApplicationInfo"
import { openAppSettings } from "./Device/nativeModule"
import * as NativeModule from "./gaen/nativeModule"
import { usePermissionsContext } from "./Device/PermissionsContext"

export const useRequestExposureNotifications = (): (() => void) => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()
  const { exposureNotifications } = usePermissionsContext()

  const requestExposureNotifications = async () => {
    if (exposureNotifications.status === "LocationOffAndRequired") {
      showEnableLocationAlert()
    } else if (exposureNotifications.status === "BluetoothOff") {
      showEnableBluetoothAlert()
    } else {
      const response = await NativeModule.requestAuthorization()

      if (response.kind === "success") {
        switch (response.status) {
          case "Active":
            break
          default:
            showBaseExposureNotificationsAlert()
        }
      } else if (response.kind === "failure") {
        switch (response.error) {
          case "BluetoothOff":
            showEnableBluetoothAlert()
            break
          case "LocationOffAndRequired":
            showEnableLocationAlert()
            break
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

  const showBaseExposureNotificationsAlert = () => {
    if (Platform.OS === "ios") {
      showShareExposureInformationAlert()
    } else {
      showUseExposureNotificationsAlert()
    }
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

  const showEnableLocationAlert = () => {
    showAlert(
      t("exposure_notification_alerts.location_title", {
        applicationName,
      }),
      t("exposure_notification_alerts.location_body", { applicationName }),
    )
  }

  return requestExposureNotifications
}
