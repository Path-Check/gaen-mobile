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
      <ScrollView contentContainerStyle={style.contentContainer}>
        <CheckIn />
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
})

export default SymptomCheckerScreen
