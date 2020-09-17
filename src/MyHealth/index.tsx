import React, { FunctionComponent, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import SegmentedControl from "@react-native-community/segmented-control"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { GlobalText, StatusBar } from "../components"
import Today from "./Today"
import OverTime from "./OverTime"

import { Typography, Colors, Spacing } from "../styles"

const MyHealthScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const determineDisplayToday = () => {
    if (selectedIndex === 0) {
      return {}
    }
    return style.hidden
  }

  const determineDisplayOverTime = () => {
    if (selectedIndex === 1) {
      return {}
    }
    return style.hidden
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <GlobalText style={style.headerText}>
          {t("symptom_checker.my_health")}
        </GlobalText>
        <View style={style.segmentedControlContainer}>
          <SegmentedControl
            values={[t("my_health.today"), t("my_health.over_time")]}
            selectedIndex={selectedIndex}
            onChange={(event) => {
              setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
            }}
            fontStyle={style.segmentedControlText}
            activeFontStyle={style.activeSegmentedControlText}
          />
        </View>
        <View style={determineDisplayToday()}>
          <Today />
        </View>
        <View style={determineDisplayOverTime()}>
          <OverTime />
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxxHuge,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.xLarge,
  },
  segmentedControlContainer: {
    marginBottom: Spacing.xLarge,
  },
  segmentedControlText: {
    fontFamily: "IBMPlexSans",
  },
  activeSegmentedControlText: {
    fontFamily: "IBMPlexSans-Medium",
  },
  hidden: {
    display: "none",
  },
})

export default MyHealthScreen
