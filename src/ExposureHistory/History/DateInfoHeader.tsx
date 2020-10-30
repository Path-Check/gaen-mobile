import React, { FunctionComponent } from "react"
import { StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"

import { Text } from "../../components"
import { DateTimeUtils } from "../../utils"

import { Colors, Typography } from "../../styles"

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
    <View style={style.headerContainer}>
      <Text style={style.subHeaderText}>
        <>
          {lastDaysText}
          {updatedAtText}
        </>
      </Text>
    </View>
  )
}

const style = StyleSheet.create({
  subHeaderText: {
    ...Typography.header.x10,
    textTransform: "uppercase",
    color: Colors.neutral.shade140,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
})

export default DateInfoHeader
