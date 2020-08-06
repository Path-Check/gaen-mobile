import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import ExplanationScreen from "./ExplanationScreen"
import { NUMBER_OF_ONBOARDING_SCREENS } from "../navigation/OnboardingStack"

import { OnboardingScreens } from "../navigation"
import { Images } from "../assets"

const GetNotified: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const explanationScreenContent = {
    screenNumber: 4,
    totalNumberOfScreens: NUMBER_OF_ONBOARDING_SCREENS,
    image: Images.PersonGettingNotification,
    imageLabel: t("onboarding_screen4_image_label"),
    header: t("label.onboarding_screen4_header"),
    primaryButtonLabel: t("label.onboarding_screen4_button"),
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(OnboardingScreens.ValueProposition),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default GetNotified
