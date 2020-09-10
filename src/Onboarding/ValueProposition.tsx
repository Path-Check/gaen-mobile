import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import OnboardingScreen from "./OnboardingScreen"

import { Images } from "../assets"
import { useOnboardingContext } from "../OnboardingContext"

const ValueProposition: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { destinationAfterComplete } = useOnboardingContext()

  const onboardingScreenContent = {
    screenNumber: 5,
    image: Images.PersonAndHealthExpert,
    imageLabel: t("onboarding.screen5_image_label"),
    header: t("onboarding.screen5_header"),
    primaryButtonLabel: t("onboarding.screen_5_button"),
  }

  const onboardingScreenActions = {
    primaryButtonOnPress: () => {
      return navigation.navigate(destinationAfterComplete)
    },
  }

  return (
    <OnboardingScreen
      onboardingScreenContent={onboardingScreenContent}
      onboardingScreenActions={onboardingScreenActions}
    />
  )
}

export default ValueProposition
