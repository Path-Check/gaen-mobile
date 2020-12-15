import React, { FunctionComponent } from "react"
import { StyleSheet } from "react-native"

import { Text } from "../../components"
import * as Exposure from "../../exposure"

import { Spacing, Typography } from "../../styles"
interface ExposureListItemProps {
  exposureDatum: Exposure.ExposureDatum
}

const ExposureListItem: FunctionComponent<ExposureListItemProps> = ({
  exposureDatum,
}) => {
  return (
    <Text style={style.secondaryText} testID="exposure-list-item">
      - {Exposure.toDateRangeString(exposureDatum)}
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
