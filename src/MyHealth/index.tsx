import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { GlobalText, StatusBar } from "../components"
import OverTime from "./OverTime"

import { Typography, Colors, Spacing } from "../styles"

const MyHealthScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const { t } = useTranslation()

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary10} />
      <View style={style.container}>
        <View style={style.headerContainer}>
          <GlobalText style={style.headerText}>
            {t("symptom_checker.my_health")}
          </GlobalText>
        </View>
        <View style={style.innerContainer}>
          <OverTime />
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
