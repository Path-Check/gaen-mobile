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
  startDate: Posix,
): number => {
  const firstDay = dayjs(startDate)
  const daysSinceExposure = dayjs(today).diff(firstDay, "day")
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

  const quarantineStartDate = dayjs(exposureEndDate)
    .add(1, "day")
    .startOf("day")
    .valueOf()
  const quarantineEndDate = dayjs(quarantineStartDate)
    .add(quarantineLength - 1, "day")
    .startOf("day")
    .valueOf()
  const quarantineEndDateText = formatDate(quarantineEndDate)

  const daysOfQuarantineLeft = determineRemainingQuarantine(
    quarantineLength,
    Date.now(),
    quarantineStartDate,
  )

  const quarantineInEffect = daysOfQuarantineLeft > 0

  return (
    <View>
      <Text style={style.summaryText}>
        {t("exposure_history.exposure_summary", {
          startDate: exposureStartDateText,
          endDate: exposureEndDateText,
        })}
      </Text>
      <View style={style.recommendationContainer}>
        <View style={style.headerContainer}>
          <Text style={style.headerText}>
            {t("exposure_history.recommended_quarantine")}
          </Text>
        </View>
        <View style={style.recommendationContentContainer}>
          {quarantineInEffect ? (
            <View>
              <View style={style.daysRemainingContainer}>
                <View style={style.recommendationLabelContainer}>
                  <Text style={style.recommendationLabelText}>
                    {t("exposure_history.days_remaining")}
                  </Text>
                </View>
                <View style={style.recommendationValueContainer}>
                  <Text style={style.recommendationText}>
                    {daysOfQuarantineLeft}
                  </Text>
                </View>
              </View>

              <View style={style.daysRemainingContainer}>
                <View style={style.recommendationLabelContainer}>
                  <Text style={style.recommendationLabelText}>
                    {t("exposure_history.stay_quarantined_through")}
                  </Text>
                </View>
                <View style={style.recommendationValueContainer}>
                  <Text style={style.recommendationText}>
                    {quarantineEndDateText}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={style.recommendationLabelText}>
              {t("exposure_history.your_recommended_quarantine_is_over")}
            </Text>
          )}
        </View>
      </View>
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
  headerContainer: {
    paddingBottom: Spacing.xxSmall,
    borderBottomWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade30,
  },
  headerText: {
    ...Typography.header.x20,
  },
  recommendationContentContainer: {
    marginTop: Spacing.xxxSmall,
  },
  recommendationLabelText: {
    ...Typography.body.x20,
  },
  daysRemainingContainer: {
    marginTop: Spacing.xxSmall,
    flexDirection: "row",
    alignItems: "center",
  },
  recommendationLabelContainer: {
    flex: 1,
  },
  recommendationValueContainer: {
    flex: 2,
    alignItems: "flex-start",
    marginLeft: Spacing.xSmall,
  },
  recommendationText: {
    ...Typography.base.x40,
    ...Typography.style.semibold,
    ...Typography.style.monospace,
  },
})

export default ExposureSummary
