import React, { FunctionComponent, ReactNode } from "react"
import { StyleSheet, View, ScrollView } from "react-native"
import { useStatusBarEffect } from "../navigation"

import { Colors, Spacing } from "../styles"

interface SelfAssessmentLayoutProps {
  bottomActionsContent: ReactNode
}

const SelfAssessmentLayout: FunctionComponent<SelfAssessmentLayoutProps> = ({
  children,
  bottomActionsContent,
}) => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)

  return (
    <View style={style.outerContainer}>
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={style.contentContainer}
      >
        {children}
      </ScrollView>
      <View>{bottomActionsContent}</View>
    </View>
  )
}

const style = StyleSheet.create({
  outerContainer: {
    justifyContent: "space-between",
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    justifyContent: "space-between",
    paddingBottom: Spacing.xxLarge,
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.large,
  },
})

export default SelfAssessmentLayout
