import React, { FunctionComponent } from "react"
import { Alert } from "react-native"
import { useSystemServicesContext } from "../SystemServicesContext"
import { ActivationStatus } from "./ActivationStatus"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { HomeStackScreens } from "../navigation"
import { openAppSettings } from "../gaen/nativeModule"

export const BluetoothActivationStatus: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { isBluetoothOn } = useSystemServicesContext()

  const handleOnPressFix = () => {
    showFixBluetoothAlert()
  }

  const handleOnPressShowInfo = () => {
    navigation.navigate(HomeStackScreens.BluetoothInfo)
  }

  const showFixBluetoothAlert = () => {
    Alert.alert(
      t("home.bluetooth.bluetooth_disabled_error_title"),
      t("home.bluetooth.bluetooth_disabled_error_message"),
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
  return (
    <ActivationStatus
      headerText={t("home.bluetooth.bluetooth_header")}
      isActive={isBluetoothOn}
      infoAction={handleOnPressShowInfo}
      fixAction={handleOnPressFix}
      testID={"home-bluetooth-status-container"}
    />
  )
}
