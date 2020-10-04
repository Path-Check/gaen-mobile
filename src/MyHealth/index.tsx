import React, { FunctionComponent, useState } from "react"
import { View, StyleSheet } from "react-native"
import SegmentedControl from "@react-native-community/segmented-control"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { GlobalText, StatusBar } from "../components"
import Today from "./Today"
import OverTime from "./OverTime"

import { Typography, Colors, Spacing } from "../styles"

const MyHealthScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const todayStyle = selectedIndex === 0 ? style.innerContainer : style.hidden

  const overTimeStyle =
    selectedIndex === 1 ? style.innerContainer : style.hidden

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary10} />
      <View style={style.container}>
        <View style={style.headerContainer}>
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
        </View>
        <View style={todayStyle}>
          <Today />
        </View>
        <View style={overTimeStyle}>
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
