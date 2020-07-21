import React, { FunctionComponent } from "react"
import { StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

import { RTLEnabledText } from "../components/RTLEnabledText"
import { DateTimeUtils } from "../utils"

import { Typography } from "../styles"

type Posix = number

interface DateInfoHeaderProps {
  lastDetectionDate: Posix | null
}

const DateInfoHeader: FunctionComponent<DateInfoHeaderProps> = ({
  lastDetectionDate,
}) => {
  const { t } = useTranslation()

  const determineUpdatedAtText = (posix: Posix): string => {
    const updated = t("exposure_history.updated")
    const timeAgoInWords = DateTimeUtils.timeAgoInWords(posix)
    return ` • ${updated} ${timeAgoInWords}`
  }

  const lastDaysText = t("exposure_history.last_days")
  const updatedAtText = lastDetectionDate
    ? determineUpdatedAtText(lastDetectionDate)
    : ""

  return (
    <RTLEnabledText style={styles.subHeaderText}>
      <>
        {lastDaysText}
        {updatedAtText}
      </>
    </RTLEnabledText>
  )
}

const styles = StyleSheet.create({
  subHeaderText: {
    ...Typography.header4,
    ...Typography.bold,
  },
})

export default DateInfoHeader
