import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import dayjs from "dayjs"

import { Text } from "../../components"
import * as Exposure from "../../exposure"

import { Spacing, Colors, Typography } from "../../styles"

type Posix = number

interface ExposureSummaryProps {
  exposure: Exposure.ExposureDatum
  quarantineLength: number
}

export const determineRemainingQuarantine = (
  quarantineLength: number,
  today: Posix,
  date: Posix,
): number => {
  const dayOfExposure = dayjs(date).add(1, "day")
  const daysSinceExposure = dayjs(today).diff(dayOfExposure, "day")
  const daysRemaining = quarantineLength - daysSinceExposure

  const maxDays = Math.min(quarantineLength, daysRemaining)
  const result = Math.max(0, maxDays)
  return result
}

const ExposureSummary: FunctionComponent<ExposureSummaryProps> = ({
  exposure,
  quarantineLength,
}) => {
  const daysOfQuarantineLeft = determineRemainingQuarantine(
    quarantineLength,
    Date.now(),
    exposure.date,
  )

  return (
    <View style={style.container}>
      <Text style={style.headerText}>Exposure Summary</Text>
      <Text>{Exposure.toDateRangeString(exposure)}</Text>
      <Text>{daysOfQuarantineLeft}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.medium,
    paddingBottom: Spacing.small,
    marginHorizontal: Spacing.small,
    marginBottom: Spacing.xxLarge,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.shade10,
  },
  headerText: Typography.header.x20,
})

export default ExposureSummary
