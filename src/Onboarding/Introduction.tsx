import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import ExplanationScreen from "./ExplanationScreen"

import { OnboardingScreens } from "../navigation"
import { Images } from "../assets"

const Introduction: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const explanationScreenContent = {
    screenNumber: 1,
    image: Images.PeopleHighFiving,
    imageLabel: "Placeholder",
    header: t("label.onboarding_screen1_header"),
    primaryButtonLabel: t("label.onboarding_screen1_button"),
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(OnboardingScreens.PhoneRemembersDevices),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default Introduction
