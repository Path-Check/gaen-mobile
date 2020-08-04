import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import OnboardingScreen from "./OnboardingScreen"

import { ActivationScreens, Stacks } from "../navigation"
import { Images } from "../assets"

const ValueProposition: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const onboardingScreenContent = {
    screenNumber: 5,
    image: Images.PersonAndHealthExpert,
    imageLabel: t("onboarding_screen5_image_label"),
    header: t("label.onboarding_screen5_header"),
    primaryButtonLabel: t("label.onboarding_screen_5_button"),
  }

  const onboardingScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(Stacks.Activation, {
        screen: ActivationScreens.AcceptEula,
      }),
  }

  return (
    <OnboardingScreen
      onboardingScreenContent={onboardingScreenContent}
      onboardingScreenActions={onboardingScreenActions}
    />
  )
}

export default ValueProposition
