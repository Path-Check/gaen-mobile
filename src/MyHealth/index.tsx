import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { Text, StatusBar } from "../components"
import SymptomLog from "./SymptomLog"

import { Typography, Colors, Spacing } from "../styles"

const MyHealthScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const { t } = useTranslation()

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary10} />
      <View style={style.container}>
        <View style={style.headerContainer}>
          <Text style={style.headerText}>
            {t("symptom_checker.symptom_log")}
          </Text>
        </View>
        <View style={style.innerContainer}>
          <SymptomLog />
        </View>
      </View>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.secondary10,
    paddingTop: Spacing.large,
  },
  headerContainer: {
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.secondary10,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.medium,
  },
  segmentedControlContainer: {
    marginBottom: Spacing.large,
  },
  segmentedControlText: {
    fontFamily: "IBMPlexSans",
  },
  activeSegmentedControlText: {
    fontFamily: "IBMPlexSans-Medium",
  },
  innerContainer: {
    flexGrow: 1,
  },
  hidden: {
    display: "none",
  },
})

export default MyHealthScreen
