import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import ExplanationScreen from "./ExplanationScreen"

import { Screens } from "../navigation"
import { Images } from "../assets"

const PersonalPrivacy: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const explanationScreenContent = {
    screenNumber: 1,
    image: Images.PeopleHighFiving,
    imageLabel: "Placeholder",
    header: t("label.launch_screen2_header_bluetooth"),
    body: t("label.launch_screen2_subheader_bluetooth"),
    primaryButtonLabel: t("label.launch_next"),
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(Screens.NotificationDetails),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default PersonalPrivacy

