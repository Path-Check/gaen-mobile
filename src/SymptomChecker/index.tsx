import React, { FunctionComponent } from "react"
import { StyleSheet, ScrollView } from "react-native"

import { useStatusBarEffect } from "../navigation"
import { StatusBar } from "../components"
import CheckIn from "./CheckIn"

import { Colors, Spacing } from "../styles"

const SymptomCheckerScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <CheckIn />
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
    paddingTop: Spacing.xxxHuge,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxxHuge,
  },
})

export default SymptomCheckerScreen
