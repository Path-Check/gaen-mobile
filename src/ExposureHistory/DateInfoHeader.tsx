import React, { FunctionComponent, useContext } from "react"
import { StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

import { RTLEnabledText } from "../components/RTLEnabledText"
import ExposureHistoryContext from "../ExposureHistoryContext"

import { Typography } from "../styles"

const DateInfoHeader: FunctionComponent = () => {
  const { t } = useTranslation()
  const { lastExposureDetectionDate } = useContext(ExposureHistoryContext)

  if (lastExposureDetectionDate === null) {
    return null
  }

  const lastDaysText = t("exposure_history.last_days")
  const updated = t("exposure_history.updated")
  let updatedAtText = ""

  if (lastExposureDetectionDate !== null) {
    const humanizedTimePassed = lastExposureDetectionDate.fromNow()
    updatedAtText = ` • ${updated} ${humanizedTimePassed}`
  }

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
