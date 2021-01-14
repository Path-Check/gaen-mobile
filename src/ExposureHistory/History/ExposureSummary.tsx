import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import { Text } from "../../components"
import * as Exposure from "../../exposure"

import { Colors, Outlines, Spacing, Typography } from "../../styles"

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

  const formatDate = (posix: Posix) => {
    return dayjs(posix).format("dddd, MMM Do")
  }

  const [exposureStartDate, exposureEndDate] = Exposure.toExposureRange(
    exposure,
  )
  const exposureStartDateText = formatDate(exposureStartDate)
  const exposureEndDateText = formatDate(exposureEndDate)

  const daysOfQuarantineLeft = determineRemainingQuarantine(
    quarantineLength,
    Date.now(),
    exposure.date,
  )
  const quarantineEndDate = dayjs().add(daysOfQuarantineLeft, "day").valueOf()
  const quarantineEndDateText = formatDate(quarantineEndDate)

  const quarantineInEffect = daysOfQuarantineLeft > 0

  return (
    <View>
      <Text style={style.summaryText}>
        {t("exposure_history.exposure_summary", {
          startDate: exposureStartDateText,
          endDate: exposureEndDateText,
        })}
      </Text>
      {quarantineInEffect ? (
        <View style={style.recommendationContainer}>
          <View style={style.daysRemainingContainer}>
            <View style={style.daysRemainingTextContainer}>
              <Text style={style.recommendationText}>
                {t("exposure_history.days_remaining")}
              </Text>
            </View>
            <View style={style.dayNumberContainer}>
              <Text style={style.dayNumberText}>{daysOfQuarantineLeft}</Text>
            </View>
          </View>

          <View style={style.quarantineEndDateContainer}>
            <Text style={style.recommendationText}>
              {t("exposure_history.stay_quarantined_through")}
            </Text>
            <Text style={style.recommendationText}>
              {quarantineEndDateText}
            </Text>
          </View>
        </View>
      ) : (
        <View style={style.recommendationContainer}>
          <Text style={style.recommendationText}>
            {t("exposure_history.your_recommended_quarantine_is_over")}
          </Text>
        </View>
      )}
    </View>
  )
}

const style = StyleSheet.create({
  summaryText: {
    ...Typography.body.x20,
    marginBottom: Spacing.small,
  },
  recommendationContainer: {
    backgroundColor: Colors.neutral.shade10,
    borderRadius: Outlines.baseBorderRadius,
    paddingVertical: Spacing.xSmall,
    paddingHorizontal: Spacing.xSmall,
  },
  recommendationText: {
    ...Typography.body.x20,
    color: Colors.neutral.black,
  },
  daysRemainingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quarantineEndDateContainer: {
    marginTop: Spacing.xSmall,
    paddingTop: Spacing.xxSmall,
    borderTopWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade30,
  },
  daysRemainingTextContainer: {
    flex: 3,
  },
  dayNumberContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    paddingVertical: Spacing.xSmall,
    paddingHorizontal: Spacing.medium,
    borderRadius: Outlines.baseBorderRadius,
    marginLeft: Spacing.xSmall,
  },
  dayNumberText: {
    ...Typography.base.x50,
    ...Typography.style.bold,
  },
})

export default ExposureSummary
