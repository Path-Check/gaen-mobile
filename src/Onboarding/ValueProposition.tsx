import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import ExplanationScreen from "./ExplanationScreen"
import { NUMBER_OF_ONBOARDING_SCREENS } from "../navigation/OnboardingStack"

import { ActivationScreens, Stacks } from "../navigation"
import { Images } from "../assets"

const ValueProposition: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const explanationScreenContent = {
    screenNumber: 5,
    totalNumberOfScreens: NUMBER_OF_ONBOARDING_SCREENS,
    image: Images.PersonAndHealthExpert,
    imageLabel: t("onboarding_screen5_image_label"),
    header: t("label.onboarding_screen5_header"),
    primaryButtonLabel: t("label.onboarding_screen_5_button"),
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(Stacks.Activation, {
        screen: ActivationScreens.ActivateProximityTracing,
      }),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default ValueProposition
