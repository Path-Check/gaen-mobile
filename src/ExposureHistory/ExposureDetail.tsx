import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ExposureHistoryStackParamList } from "../navigation"
import { RTLEnabledText } from "../components/RTLEnabledText"
import { useStatusBarEffect } from "../navigation"
import { DateTimeUtils } from "../utils"

import { Colors, Iconography, Outlines, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

const ExposureDetail: FunctionComponent = () => {
  const route = useRoute<
    RouteProp<ExposureHistoryStackParamList, "ExposureDetail">
  >()
  useStatusBarEffect("light-content")
  const { t } = useTranslation()

  const { exposureDatum } = route.params

  const headerText = t("exposure_history.exposure_detail.header")
  const contentText = t("exposure_history.exposure_detail.content")

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainerCircle}>
          <SvgXml
            xml={Icons.ExposureIcon}
            width={Iconography.extraLarge}
            height={Iconography.extraLarge}
          />
        </View>
        <RTLEnabledText>
          {DateTimeUtils.timeAgoInWords(exposureDatum.date)}
        </RTLEnabledText>
        <RTLEnabledText style={styles.headerText}>{headerText}</RTLEnabledText>
        <RTLEnabledText style={styles.contentText}>
          {contentText}
        </RTLEnabledText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: Colors.white,
  },
  headerText: {
    ...Typography.header3,
  },
  contentText: {
    ...Typography.mainContent,
    paddingTop: Spacing.small,
  },
  iconContainerCircle: {
    ...Iconography.extraLargeIcon,
    ...Outlines.glowShadow,
    alignSelf: "center",
  },
})

export default ExposureDetail
