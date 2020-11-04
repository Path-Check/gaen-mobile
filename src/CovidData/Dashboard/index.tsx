import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet } from "react-native"

import { useCovidDataContext } from "../Context"
import StateData from "./StateData"

import { Colors, Spacing } from "../../styles"

const CovidDataDashboard: FunctionComponent = () => {
  const {
    locationName,
    request: { status, data },
  } = useCovidDataContext()

  if (status === "MISSING_INFO") {
    return null
  }

  const todayData = data[0]

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
    >
      <StateData todayCovidData={todayData} stateAbbreviation={locationName} />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xxxLarge,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.background.primaryLight,
  },
})

export default CovidDataDashboard
