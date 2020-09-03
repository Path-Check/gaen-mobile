import React, { FunctionComponent } from "react"
import { Alert, Linking } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { usePermissionsContext, ENStatus } from "../PermissionsContext"
import { HomeScreens } from "../navigation"
import { ActivationStatus } from "./ActivationStatus"

export const ProximityTracingActivationStatus: FunctionComponent = () => {
  const navigation = useNavigation()
  const { exposureNotifications } = usePermissionsContext()
  const { t } = useTranslation()

  const { status } = exposureNotifications

  const handleOnPressFix = () => {
    exposureNotifications.request()
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
