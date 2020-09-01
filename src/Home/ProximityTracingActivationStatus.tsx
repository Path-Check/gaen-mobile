import React, { FunctionComponent } from "react"
import { Alert, Linking } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { usePermissionsContext, ENStatus } from "../PermissionsContext"
import { HomeScreens } from "../navigation"
import { useApplicationName } from "../hooks/useApplicationInfo"
import { ActivationStatus } from "./ActivationStatus"

export const ProximityTracingActivationStatus: FunctionComponent = () => {
  const navigation = useNavigation()
  const { exposureNotifications } = usePermissionsContext()
  const { applicationName } = useApplicationName()
  const { t } = useTranslation()

  const { status } = exposureNotifications

  const handleOnPressFix = () => {
    if (status === ENStatus.UNAUTHORIZED_DISABLED) {
      showUnauthorizedAlert()
    } else {
      showEnableProximityTracingAlert()
    }
  }

  const handleOnPressShowInfo = () => {
    navigation.navigate(HomeScreens.ProximityTracingInfo)
  }

  const showUnauthorizedAlert = () => {
    Alert.alert(
      t("home.bluetooth.unauthorized_error_title"),
      t("home.bluetooth.unauthorized_error_message"),
      [
        {
          text: t("common.back"),
          style: "cancel",
        },
        {
          text: t("common.settings"),
          onPress: () => Linking.openSettings(),
        },
      ],
    )
  }

  const showEnableProximityTracingAlert = () => {
    Alert.alert(
      t("onboarding.proximity_tracing_alert_header", { applicationName }),
      t("onboarding.proximity_tracing_alert_body", { applicationName }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.enable"),
          onPress: exposureNotifications.request,
        },
      ],
    )
  }

  return (
    <ActivationStatus
      headerText={t("home.bluetooth.proximity_tracing_header")}
      isActive={status === ENStatus.AUTHORIZED_ENABLED}
      infoAction={handleOnPressShowInfo}
      fixAction={handleOnPressFix}
      testID={"home-proximity-tracing-status-container"}
    />
  )
}
