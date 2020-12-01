import { Alert } from "react-native"
import { useTranslation } from "react-i18next"
import { openAppSettings } from "./nativeModule"

type DeviceAlerts = {
  showFixLocationAlert: () => void
}

export const useDeviceAlert = (): DeviceAlerts => {
  const { t } = useTranslation()

  const showFixLocationAlert = () => {
    Alert.alert(
      t("home.bluetooth.location_disabled_error_title"),
      t("home.bluetooth.location_disabled_error_message"),
      [
        {
          text: t("common.back"),
          style: "cancel",
        },
        {
          text: t("common.settings"),
          onPress: () => openAppSettings(),
        },
      ],
    )
  }

  return {
    showFixLocationAlert,
  }
}
