import React, { FunctionComponent } from "react"
import { Linking, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { usePermissionsContext, ENStatus } from "../PermissionsContext"
import { HomeScreens } from "../navigation"
import { ActivationStatus } from "./ActivationStatus"
import { useApplicationName } from "../hooks/useApplicationInfo"
import { isPlatformiOS } from "../utils"

export const ProximityTracingActivationStatus: FunctionComponent = () => {
  const navigation = useNavigation()
  const { exposureNotifications } = usePermissionsContext()
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()

  const { status } = exposureNotifications

  const isUnauthorized = status === ENStatus.UNAUTHORIZED_DISABLED

  const showUnauthorizedAlert = () => {
    Alert.alert(
      t("home.bluetooth.unauthorized_error_title"),
      t("home.bluetooth.unauthorized_error_message", { applicationName }),
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

  const handleOnPressFix = () => {
    exposureNotifications.request()
    if (isUnauthorized && isPlatformiOS()) {
      showUnauthorizedAlert()
    }
  }

  const handleOnPressShowInfo = () => {
    navigation.navigate(HomeScreens.ProximityTracingInfo)
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
