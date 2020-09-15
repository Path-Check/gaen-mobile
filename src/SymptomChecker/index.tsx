import React, { FunctionComponent } from "react"
import { StyleSheet, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { StatusBar, GlobalText } from "../components"

import { Colors, Typography, Spacing } from "../styles"

const SymptomCheckerScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView contentContainerStyle={style.contentContainer}>
        <GlobalText style={style.headerText}>
          {t("symptom_checker.my_health")}
        </GlobalText>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.xxxHuge,
    paddingHorizontal: Spacing.large,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
  },
})

export default SymptomCheckerScreen
