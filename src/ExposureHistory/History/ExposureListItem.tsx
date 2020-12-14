import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { Text } from "../../components"
import * as Exposure from "../../exposure"

import { Spacing, Typography } from "../../styles"
interface ExposureListItemProps {
  exposureDatum: Exposure.ExposureDatum
}

const ExposureListItem: FunctionComponent<ExposureListItemProps> = ({
  exposureDatum,
}) => {
  const { t } = useTranslation()

  return (
    <View style={style.container}>
      <View>
        <Text style={style.primaryText}>
          {t("exposure_history.possible_exposure")}
        </Text>
        <Text style={style.secondaryText}>
          {Exposure.toDateRangeString(exposureDatum)}
        </Text>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    marginBottom: Spacing.medium,
    marginHorizontal: Spacing.medium,
  },
  primaryText: {
    ...Typography.header.x10,
  },
  secondaryText: {
    ...Typography.body.x10,
    marginTop: Spacing.xxSmall,
    letterSpacing: Typography.letterSpacing.x20,
  },
})

export default ExposureListItem
