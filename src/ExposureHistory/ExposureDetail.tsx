import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ExposureHistoryStackParamList } from "../navigation"
import { RTLEnabledText } from "../components/RTLEnabledText"
import { useStatusBarEffect } from "../navigation"
import { Possible, ExposureDatum, exposureWindowBucket } from "../exposure"

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

  const exposureWindowBucketInWords = (
    exposureDatum: ExposureDatum,
  ): string => {
    const bucket = exposureWindowBucket(exposureDatum as Possible)
    switch (bucket) {
      case "TodayToThreeDaysAgo": {
        return t("exposure_history.exposure_window.today_to_three_days_ago")
      }
      case "FourToSixDaysAgo": {
        return t("exposure_history.exposure_window.four_to_six_days_ago")
      }
      case "SevenToFourteenDaysAgo": {
        return t("exposure_history.exposure_window.seven_to_fourteen_days_ago")
      }
    }
  }

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
          {exposureWindowBucketInWords(exposureDatum)}
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
