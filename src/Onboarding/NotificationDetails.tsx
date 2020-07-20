import React from "react"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import ExplanationScreen, { IconStyle } from "./ExplanationScreen"

import { Screens } from "../navigation"
import { Icons, Images } from "../assets"

const NotificationDetails = (): JSX.Element => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const explanationScreenContent = {
    backgroundImage: Images.MultipleCrossPathBackground,
    icon: Icons.BellYellow,
    header: t("label.launch_screen3_header_bluetooth"),
    body: t("label.launch_screen3_subheader_bluetooth"),
    primaryButtonLabel: t("label.launch_next"),
  }

  const iconStyle = IconStyle.Gold

  const explanationScreenStyles = {
    iconStyle: iconStyle,
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () => navigation.navigate(Screens.ShareDiagnosis),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenStyles={explanationScreenStyles}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default NotificationDetails
