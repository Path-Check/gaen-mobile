import React, { FunctionComponent } from "react"
import { StyleSheet, Text, View } from "react-native"
import * as CovidData from "./covidData"

import { Colors, Outlines, Spacing, Typography } from "../styles"

interface RiskLevelBadgeProps {
  riskLevel: CovidData.RiskLevel
}

const RiskLevelBadge: FunctionComponent<RiskLevelBadgeProps> = ({
  riskLevel,
}) => {
  const riskLevelString = CovidData.toRiskLevelString(riskLevel)
  const color = CovidData.toRiskLevelColor(riskLevel)

  const riskLevelTextContainerStyle = {
    ...style.riskLevelTextContainer,
    backgroundColor: color,
  }

  return (
    <View style={riskLevelTextContainerStyle}>
      <Text style={style.riskLevelText}>{riskLevelString}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  riskLevelTextContainer: {
    paddingVertical: Spacing.xxxSmall,
    paddingHorizontal: Spacing.xxSmall,
    borderRadius: Outlines.baseBorderRadius,
  },
  riskLevelText: {
    ...Typography.header.x20,
    ...Typography.style.semibold,
    color: Colors.neutral.white,
  },
})

export default RiskLevelBadge
