import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import ExplanationScreen from "./ExplanationScreen"
import { NUMBER_OF_ONBOARDING_SCREENS } from "../navigation/OnboardingStack"

import { OnboardingScreens } from "../navigation"
import { Images } from "../assets"

const PersonalPrivacy: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const explanationScreenContent = {
    screenNumber: 3,
    totalNumberOfScreens: NUMBER_OF_ONBOARDING_SCREENS,
    image: Images.PersonWithLockedPhone,
    imageLabel: t("onboarding_screen3_image_label"),
    header: t("label.onboarding_screen3_header"),
    primaryButtonLabel: t("label.onboarding_screen3_button"),
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(OnboardingScreens.GetNotified),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default PersonalPrivacy
