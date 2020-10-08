import React, { FunctionComponent } from "react"
import { StyleSheet, View } from "react-native"

import COVIDDataStateTrend from "./COVIDDataStateTrend"
import { useConfigurationContext } from "../ConfigurationContext"

import { Affordances } from "../styles"

const COVIDDataDashboard: FunctionComponent = () => {
  const { stateAbbreviation } = useConfigurationContext()

  if (stateAbbreviation === null) {
    return null
  }

  return (
    <View style={style.dataContainer}>
      <COVIDDataStateTrend stateAbbreviation={stateAbbreviation} />
    </View>
  )
}

const style = StyleSheet.create({
  dataContainer: {
    ...Affordances.floatingContainer,
  },
})

export default COVIDDataDashboard
