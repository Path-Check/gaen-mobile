import React, { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { HeaderBackButton } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"

import { Colors } from "../styles"

export const applyHeaderLeftBackButton = () => {
  return function modalHeader(): ReactNode {
    return <HeaderLeftBackButton />
  }
}

const HeaderLeftBackButton = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  return (
    <HeaderBackButton
      label={t("common.back")}
      tintColor={Colors.primary.shade150}
      onPress={() => navigation.goBack()}
    />
  )
}
