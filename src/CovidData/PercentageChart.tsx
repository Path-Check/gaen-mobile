import React, { ReactNode, FunctionComponent } from "react"
import { StyleSheet, View } from "react-native"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"

import { Icons } from "../assets"
import { Colors, Typography, Spacing, Outlines } from "../styles"

type PercentageChartProps = {
  percentage: number | null
  label: string
}

const PercentageChart: FunctionComponent<PercentageChartProps> = ({
  percentage,
  label,
}) => {
  const determineIndicator = (percent: number | null): ReactNode => {
    if (percent === null) {
      return null
    } else if (isNaN(percent)) {
      return null
    } else if (percent > 0) {
      return <SvgXml xml={Icons.ChevronUp} fill={Colors.neutral.black} />
    } else {
      return <SvgXml xml={Icons.ChevronDown} fill={Colors.neutral.black} />
    }
  }

  const determinePercentageText = (percent: number | null): string => {
    if (percent === null) {
      return "- %"
    } else if (isNaN(percent)) {
      return "- %"
    } else {
      return percent.toFixed() + " %"
    }
  }

  const percentageText = determinePercentageText(percentage)
  const indicator = determineIndicator(percentage)

  return (
    <View style={style.container}>
      <View style={style.percentageContainer}>
        <View style={style.trendArrowContainer}>{indicator}</View>
        <Text style={style.percentageText}>{percentageText}</Text>
      </View>
      <Text style={style.headerText}>{label}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  percentageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: Outlines.baseBorderRadius,
    backgroundColor: Colors.secondary.shade50,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xSmall,
    marginRight: Spacing.small,
  },
  trendArrowContainer: {
    paddingRight: Spacing.xxSmall,
  },
  percentageText: {
    ...Typography.body.x30,
    ...Typography.style.bold,
    color: Colors.neutral.black,
  },
  headerText: {
    ...Typography.header.x30,
    ...Typography.style.normal,
  },
})

export default PercentageChart
