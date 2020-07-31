import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import ExplanationScreen, { IconStyle } from "./ExplanationScreen"

import { Screens } from "../navigation"
import { Icons, Images } from "../assets"

const PersonalPrivacy: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const explanationScreenContent = {
    backgroundImage: Images.SingleCrossPathBackground,
    icon: Icons.RadioWave,
    iconLabel: t("label.bluetooth_icon"),
    header: t("label.launch_screen2_header_bluetooth"),
    body: t("label.launch_screen2_subheader_bluetooth"),
    primaryButtonLabel: t("label.launch_next"),
  }

  const explanationScreenStyles = {
    iconStyle: IconStyle.Blue,
    statusBarStyle: "dark-content" as const,
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(Screens.NotificationDetails),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenStyles={explanationScreenStyles}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default PersonalPrivacy
