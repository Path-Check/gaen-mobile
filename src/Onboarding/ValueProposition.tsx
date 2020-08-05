import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import ExplanationScreen from "./ExplanationScreen"

import { Screens } from "../navigation"
import { Images } from "../assets"

const ValueProposition: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const explanationScreenContent = {
    screenNumber: 5,
    image: Images.PersonAndHealthExpert,
    imageLabel: "Placeholder",
    header: t("label.onboarding_screen5_header"),
    primaryButtonLabel: t("label.onboarding_screen_5_button"),
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(Screens.NotificationPermissions),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default ValueProposition

