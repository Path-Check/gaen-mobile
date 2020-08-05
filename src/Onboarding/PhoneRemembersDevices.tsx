import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import ExplanationScreen from "./ExplanationScreen"

import { OnboardingScreens } from "../navigation"
import { Images } from "../assets"

const PhoneRemembersDevices: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const explanationScreenContent = {
    screenNumber: 2,
    image: Images.PeopleOnPhones,
    imageLabel: "Placeholder",
    header: t("label.onboarding_screen2_header"),
    primaryButtonLabel: t("label.onboarding_screen2_button"),
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(OnboardingScreens.PersonalPrivacy),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default PhoneRemembersDevices

