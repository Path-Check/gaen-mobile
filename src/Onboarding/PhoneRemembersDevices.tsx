import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import OnboardingScreen from "./OnboardingScreen"

import { OnboardingScreens } from "../navigation"
import { Images } from "../assets"

const PhoneRemembersDevices: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const onboardingScreenContent = {}

  const onboardingScreenActions = {}

  return (
    <OnboardingScreen
      onboardingScreenContent={onboardingScreenContent}
      onboardingScreenActions={onboardingScreenActions}
    />
  )
}

export default PhoneRemembersDevices
