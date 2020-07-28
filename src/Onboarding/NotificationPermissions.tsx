import React from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet } from "react-native"

import { usePermissionsContext } from "../PermissionsContext"
import { Screens } from "../navigation"
import { useStatusBarEffect } from "../navigation"
import ExplanationScreen, { IconStyle } from "../Onboarding/ExplanationScreen"

import { Icons, Images } from "../assets"
import { Colors } from "../styles"

const NotificationsPermissions = (): JSX.Element => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { notification } = usePermissionsContext()

  useStatusBarEffect("dark-content")

  const requestPermission = async () => {
    await notification.request()
  }

  const continueOnboarding = () => {
    navigation.navigate(Screens.EnableExposureNotifications)
  }

  const handleOnPressEnable = async () => {
    await requestPermission()
    continueOnboarding()
  }

  const handleOnPressMaybeLater = () => {
    continueOnboarding()
  }

  const explanationScreenContent = {
    backgroundImage: Images.BlueGradientBackground,
    icon: Icons.Bell,
    iconLabel: t("label.bell_icon"),
    header: t("onboarding.notification_header"),
    body: t("onboarding.notification_subheader"),
    primaryButtonLabel: t("label.launch_enable_notif"),
    secondaryButtonLabel: t("onboarding.maybe_later"),
  }

  const explanationScreenStyles = {
    headerStyle: styles.header,
    bodyStyle: styles.body,
    iconStyle: IconStyle.Blue,
  }

  const explanationScreenActions = {
    primaryButtonOnPress: handleOnPressEnable,
    secondaryButtonOnPress: handleOnPressMaybeLater,
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenStyles={explanationScreenStyles}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

const styles = StyleSheet.create({
  header: {
    color: Colors.white,
  },
  body: {
    color: Colors.white,
  },
})

export default NotificationsPermissions
