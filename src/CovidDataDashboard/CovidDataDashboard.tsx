import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet } from "react-native"

import { useConfigurationContext } from "../ConfigurationContext"
import { useCovidDataContext } from "../CovidDataContext"
import StateData from "./StateData"

import { Colors, Spacing } from "../styles"

const CovidDataDashboard: FunctionComponent = () => {
  const { stateAbbreviation } = useConfigurationContext()
  const {
    covidDataRequest: { data },
  } = useCovidDataContext()

  if (stateAbbreviation === null || data.length <= 0) {
    return null
  }

  const [todayCovidData] = data

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
    >
      <StateData
        todayCovidData={todayCovidData}
        stateAbbreviation={stateAbbreviation}
      />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xxxLarge,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.primaryLightBackground,
  },
})

export default CovidDataDashboard
