import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import { Text } from "../../components"
import * as Exposure from "../../exposure"
import ExposureActions from "../detail/ExposureActions"

import { Spacing, Typography } from "../../styles"

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
  const { t } = useTranslation()

  const daysOfQuarantineLeft = determineRemainingQuarantine(
    quarantineLength,
    Date.now(),
    exposure.date,
  )

  const startDate = Exposure.toStartDateString(exposure)
  const endDate = Exposure.toEndDateString(exposure)

  return (
    <View style={style.container}>
      <Text style={style.summaryText}>
        {t("exposure_history.exposure_summary", { startDate, endDate })}
      </Text>
      <Text style={style.daysRemainingText}>{`${t(
        "exposure_history.days_remaining",
      )}: ${daysOfQuarantineLeft}`}</Text>
      <ExposureActions />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.medium,
    marginBottom: Spacing.xxLarge,
  },
  summaryText: {
    ...Typography.body.x20,
    marginBottom: Spacing.small,
  },
  daysRemainingText: {
    ...Typography.body.x20,
  },
})

export default ExposureSummary
