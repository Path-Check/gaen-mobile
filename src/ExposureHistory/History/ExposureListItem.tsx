import React, { FunctionComponent } from "react"
import { StyleSheet } from "react-native"
import dayjs from "dayjs"

import { Text } from "../../components"
import * as Exposure from "../../exposure"

import { Spacing, Typography } from "../../styles"

type Posix = number

interface ExposureListItemProps {
  exposureDatum: Exposure.ExposureDatum
}

const ExposureListItem: FunctionComponent<ExposureListItemProps> = ({
  exposureDatum,
}) => {
  const formatDate = (posix: Posix) => {
    return dayjs(posix).format("dddd, MMM Do")
  }

  const [startDate, endDate] = Exposure.toExposureRange(exposureDatum)
  const startDateText = formatDate(startDate)
  const endDateText = formatDate(endDate)
  const exposureRangeText = `${startDateText} - ${endDateText}`

  return (
    <Text style={style.secondaryText} testID="exposure-list-item">
      - {exposureRangeText}
    </Text>
  )
}

const style = StyleSheet.create({
  secondaryText: {
    ...Typography.body.x10,
    letterSpacing: Typography.letterSpacing.x20,
    marginBottom: Spacing.xxSmall,
  },
})

export default ExposureListItem
