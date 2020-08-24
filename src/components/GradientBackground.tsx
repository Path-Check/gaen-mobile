import React, { FunctionComponent } from "react"
import { StyleSheet } from "react-native"

import LinearGradient from "react-native-linear-gradient"

import { Colors } from "../styles"

const GradientBackground: FunctionComponent = () => {
  return (
    <LinearGradient
      colors={Colors.gradientPrimary10}
      style={style.gradient}
      useAngle
      angle={0}
      angleCenter={{ x: 0.5, y: 0.25 }}
    />
  )
}

const style = StyleSheet.create({
  gradient: {
    flex: 1,
  },
})

export default GradientBackground
