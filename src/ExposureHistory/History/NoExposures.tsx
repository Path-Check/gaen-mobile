import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { RTLEnabledText } from "../../components/RTLEnabledText"

import { Colors, Typography, Spacing, Outlines } from "../../styles"

const NoExposures: FunctionComponent = () => {
  const { t } = useTranslation()
  return (
    <View style={style.container}>
      <RTLEnabledText style={style.headerText}>
        {t("exposure_history.no_exposure_reports")}
      </RTLEnabledText>
      <RTLEnabledText style={style.subheaderText}>
        {t("exposure_history.no_exposure_reports_over_past")}
      </RTLEnabledText>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryViolet,
    ...Outlines.roundedBorder,
    padding: Spacing.large,
  },
  headerText: {
    ...Typography.mainContent,
    ...Typography.bold,
    paddingBottom: Spacing.xSmall,
    color: Colors.white,
  },
  subheaderText: {
    ...Typography.description,
    color: Colors.white,
  },
})

export default NoExposures
