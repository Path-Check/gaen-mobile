import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import OnboardingScreen from "./OnboardingScreen"

import { OnboardingScreens } from "../navigation"
import { Images } from "../assets"

const PhoneRemembersDevices: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const onboardingScreenContent = {
    screenNumber: 2,
    image: Images.PeopleOnPhones,
    imageLabel: t("onboarding_screen2_image_label"),
    header: t("label.onboarding_screen2_header"),
    primaryButtonLabel: t("label.onboarding_screen2_button"),
  }

  const onboardingScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(OnboardingScreens.PersonalPrivacy),
  }

  return (
    <OnboardingScreen
      onboardingScreenContent={onboardingScreenContent}
      onboardingScreenActions={onboardingScreenActions}
    />
  )
}

export default PhoneRemembersDevices
