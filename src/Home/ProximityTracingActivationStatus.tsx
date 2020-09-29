import React, { FunctionComponent } from "react"
import { Alert, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import {
  usePermissionsContext,
  ENPermissionStatus,
} from "../PermissionsContext"
import { HomeStackScreens } from "../navigation"
import { ActivationStatus } from "./ActivationStatus"
import { useApplicationName } from "../hooks/useApplicationInfo"
import { openAppSettings } from "../gaen/nativeModule"

export const ProximityTracingActivationStatus: FunctionComponent = () => {
  const navigation = useNavigation()
  const { exposureNotifications } = usePermissionsContext()
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()

  const { status } = exposureNotifications

  const showNotAuthorizedAlert = () => {
    const errorMessage = Platform.select({
      ios: t("home.proximity_tracing.unauthorized_error_message_ios", {
        applicationName,
      }),
      android: t("home.proximity_tracing.unauthorized_error_message_android", {
        applicationName,
      }),
    })

    Alert.alert(
      t("home.proximity_tracing.unauthorized_error_title"),
      errorMessage,
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

  const handleOnPressFix = async () => {
    try {
      await exposureNotifications.request()

      if (status !== ENPermissionStatus.ENABLED) {
        showNotAuthorizedAlert()
      }
    } catch {
      showNotAuthorizedAlert()
    }
  }

  const handleOnPressShowInfo = () => {
    navigation.navigate(HomeStackScreens.ProximityTracingInfo)
  }

  const isENEnabled = status === ENPermissionStatus.ENABLED

  return (
    <ActivationStatus
      headerText={t("home.bluetooth.proximity_tracing_header")}
      isActive={isENEnabled}
      infoAction={handleOnPressShowInfo}
      fixAction={handleOnPressFix}
      testID={"home-proximity-tracing-status-container"}
    />
  )
}
