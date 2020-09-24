import React, { ReactNode, FunctionComponent } from "react"
import { StyleSheet } from "react-native"

import LinearGradient from "react-native-linear-gradient"

interface GradientBackgroundProps {
  gradient: string[]
  angleCenterY?: number
  children: ReactNode
}

const GradientBackground: FunctionComponent<GradientBackgroundProps> = ({
  gradient,
  angleCenterY = 0.5,
  children,
}) => {
  if (angleCenterY < 0 || angleCenterY > 1) {
    throw new Error("angleCenterY must be between 0 and 1")
  }

  return (
    <LinearGradient
      colors={gradient}
      style={style.gradient}
      useAngle
      angle={0}
      angleCenter={{ x: 0.5, y: angleCenterY }}
    >
      {children}
    </LinearGradient>
  )
}

const style = StyleSheet.create({
  gradient: {
    flex: 1,
  },
})

export default GradientBackground
