import React, { FunctionComponent } from "react"
import { Alert } from "react-native"
import { useActivationContext } from "../ActivationContext"
import { ActivationStatus } from "./ActivationStatus"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { HomeScreens } from "../navigation"

export const BluetoothActivationStatus: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { isBluetoothOn } = useActivationContext()

  const handleOnPressFix = () => {
    showFixBluetoothAlert()
  }

  const handleOnPressShowInfo = () => {
    navigation.navigate(HomeScreens.BluetoothInfo)
  }

  const showFixBluetoothAlert = () => {
    Alert.alert(
      t("home.bluetooth.bluetooth_disabled_error_title"),
      t("home.bluetooth.bluetooth_disabled_error_message"),
      [
        {
          text: t("common.okay"),
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
