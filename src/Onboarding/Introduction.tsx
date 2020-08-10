import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import OnboardingScreen from "./OnboardingScreen"

import { OnboardingScreens } from "../navigation"
import { Images } from "../assets"

const Introduction: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const onboardingScreenContent = {
    screenNumber: 1,
    image: Images.PeopleHighFiving,
    imageLabel: t("onboarding.screen1_image_label"),
    header: t("onboarding.screen1_header"),
    primaryButtonLabel: t("onboarding.screen1_button"),
  }

  const onboardingScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(OnboardingScreens.PhoneRemembersDevices),
  }

  return (
    <OnboardingScreen
      onboardingScreenContent={onboardingScreenContent}
      onboardingScreenActions={onboardingScreenActions}
    />
  )
}

export default Introduction
