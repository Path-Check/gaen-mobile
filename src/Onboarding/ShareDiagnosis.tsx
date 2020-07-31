import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { Screens } from "../navigation"
import { isPlatformiOS } from "../utils"
import ExplanationScreen, { IconStyle } from "./ExplanationScreen"

import { Icons, Images } from "../assets"

const ShareDiagnosis: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const handleOnPressNext = () => {
    navigation.navigate(
      isPlatformiOS()
        ? Screens.NotificationPermissions
        : Screens.EnableExposureNotifications,
    )
  }

  const explanationScreenContent = {
    backgroundImage: Images.EmptyPathBackground,
    icon: Icons.Heart,
    iconLabel: t("label.heart_icon"),
    header: t("label.launch_screen4_header_bluetooth"),
    body: t("label.launch_screen4_subheader_bluetooth"),
    primaryButtonLabel: t("label.launch_set_up_phone_bluetooth"),
  }

  const iconStyle = IconStyle.Blue

  const explanationScreenStyles = {
    iconStyle: iconStyle,
    statusBarStyle: "dark-content" as const,
  }

  const explanationScreenActions = {
    primaryButtonOnPress: handleOnPressNext,
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenStyles={explanationScreenStyles}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default ShareDiagnosis
