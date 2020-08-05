import React from "react"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import ExplanationScreen from "./ExplanationScreen"

import { Screens } from "../navigation"
import { Images } from "../assets"

const NotificationDetails = (): JSX.Element => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const explanationScreenContent = {
    screenNumber: 2,
    image: Images.PeopleOnPhones,
    imageLabel: "Placeholder",
    header: t("label.launch_screen3_header_bluetooth"),
    body: t("label.launch_screen3_subheader_bluetooth"),
    primaryButtonLabel: t("label.launch_next"),
  }

  const explanationScreenActions = {
    primaryButtonOnPress: () => navigation.navigate(Screens.ShareDiagnosis),
  }

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenActions={explanationScreenActions}
    />
  )
}

export default NotificationDetails

