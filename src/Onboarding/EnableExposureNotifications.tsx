import React from "react"
import { StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { usePermissionsContext } from "../PermissionsContext"
import { useOnboardingContext } from "../OnboardingContext"
import ExplanationScreen, { IconStyle } from "./ExplanationScreen"

import { Icons, Images } from "../assets"
import { Colors } from "../styles"

const EnableExposureNotifications = (): JSX.Element => {
  const { t } = useTranslation()
  const { exposureNotifications } = usePermissionsContext()
  const { setOnboardingToComplete } = useOnboardingContext()

  const iconAccessibilityLabel = t("label.exposure_icon")
  const headerText = t("label.launch_exposure_notif_header")
  const bodyText = t("label.launch_exposure_notif_subheader")
  const buttonLabel = t("label.launch_enable_exposure_notif")
  const disableButtonLabel = t("label.launch_disable_exposure_notif")

  const handleOnPressEnable = () => {
    exposureNotifications.request()
    setOnboardingToComplete()
  }

  const handleOnPressDontEnable = () => {
    setOnboardingToComplete()
  }

  const explanationScreenContent = {
    backgroundImage: Images.BlueGradientBackground,
    icon: Icons.ExposureIcon,
    iconLabel: iconAccessibilityLabel,
    header: headerText,
    body: bodyText,
    primaryButtonLabel: buttonLabel,
    secondaryButtonLabel: disableButtonLabel,
  }

  const explanationScreenStyles = {
    headerStyle: style.header,
    bodyStyle: style.body,
    iconStyle: IconStyle.Blue,
    statusBarStyle: "light-content" as const,
  }

  const explanationScreenActions = {
    primaryButtonOnPress: handleOnPressEnable,
    secondaryButtonOnPress: handleOnPressDontEnable,
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenStyles={explanationScreenStyles}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

const style = StyleSheet.create({
  header: {
    color: Colors.white,
  },
  body: {
    color: Colors.white,
  },
})

export default EnableExposureNotifications
