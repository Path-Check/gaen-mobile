import React, { FunctionComponent, ReactNode } from "react"
import { StyleSheet, View, ScrollView } from "react-native"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"
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
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  return (
    <View style={style.outerContainer}>
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={style.contentContainer}
      >
        {children}
      </ScrollView>
      <View style={style.bottomActionsContainer}>{bottomActionsContent}</View>
    </View>
  )
}

const createStyle = (insets: EdgeInsets) => {
  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
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
    bottomActionsContainer: {
      alignItems: "center",
      paddingTop: Spacing.small,
      paddingBottom: insets.bottom + Spacing.small,
      backgroundColor: Colors.secondary.shade10,
      paddingHorizontal: Spacing.large,
    },
  })
}

export default SelfAssessmentLayout
