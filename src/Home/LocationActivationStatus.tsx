import React, { FunctionComponent } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useSystemServicesContext } from "../SystemServicesContext"
import { ActivationStatus } from "./ActivationStatus"
import { HomeStackScreens } from "../navigation"
import { openAppSettings } from "../gaen/nativeModule"

export const LocationActivationStatus: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { locationPermissions } = useSystemServicesContext()

  const handleOnPressFix = () => {
    showFixLocationAlert()
  }

  const handleOnPressShowInfo = () => {
    navigation.navigate(HomeStackScreens.LocationInfo)
  }

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

  if (locationPermissions === "NotRequired") {
    return null
  }

  const isLocationOn = locationPermissions === "RequiredOn"

  return (
    <ActivationStatus
      headerText={t("home.bluetooth.location_header")}
      isActive={isLocationOn}
      infoAction={handleOnPressShowInfo}
      fixAction={handleOnPressFix}
      testID={"home-location-status-container"}
    />
  )
}
