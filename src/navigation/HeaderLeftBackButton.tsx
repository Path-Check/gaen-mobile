import React, { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { HeaderBackButton } from "@react-navigation/stack"
import { useNavigation, CommonActions } from "@react-navigation/native"

import { Colors } from "../styles"

export const applyHeaderLeftBackButton = () => {
  return function modalHeader(): ReactNode {
    return <HeaderLeftBackButton />
  }
}

const HeaderLeftBackButton = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  // Go back to the Dashboard if there are no routes to go back.
  const handleBack = () =>
    navigation.dispatch(() => {
      if (navigation.canGoBack()) {
        return CommonActions.goBack()
      }
      // Navigate to route "name: App" since "Home" is not the base route name.
      return CommonActions.reset({
        index: 1,
        routes: [{ name: "App" }],
      })
    })
  return (
    <HeaderBackButton
      label={t("common.back")}
      tintColor={Colors.primary.shade150}
      onPress={handleBack}
    />
  )
}
