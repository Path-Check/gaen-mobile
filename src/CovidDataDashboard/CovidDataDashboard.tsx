import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet } from "react-native"

import {
  CovidDataRequestStatus,
  useCovidDataContext,
} from "../CovidDataContext"
import StateData from "./StateData"

import { Colors, Spacing } from "../styles"

const CovidDataDashboard: FunctionComponent = () => {
  const {
    stateAbbreviation,
    covidDataRequest: { status, todayData },
  } = useCovidDataContext()

  if (status === CovidDataRequestStatus.MISSING_INFO) {
    return null
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
    >
      <StateData
        todayCovidData={todayData}
        stateAbbreviation={stateAbbreviation}
      />
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
