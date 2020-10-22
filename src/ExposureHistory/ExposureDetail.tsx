import React, { FunctionComponent } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ExposureHistoryStackParamList } from "../navigation"
import { Text } from "../components"
import { useStatusBarEffect } from "../navigation"
import { ExposureDatum, exposureWindowBucket } from "../exposure"

import { Colors, Iconography, Spacing, Typography } from "../styles"
import { Icons } from "../assets"
import ExposureActions from "./detail/ExposureActions"

const ExposureDetail: FunctionComponent = () => {
  const route = useRoute<
    RouteProp<ExposureHistoryStackParamList, "ExposureDetail">
  >()
  useStatusBarEffect("light-content", Colors.header.background)
  const { t } = useTranslation()

  const { exposureDatum } = route.params

  const exposureWindowBucketInWords = (
    exposureDatum: ExposureDatum,
  ): string => {
    const bucket = exposureWindowBucket(exposureDatum)
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
    <ScrollView style={style.container} alwaysBounceVertical={false}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>
          {t("exposure_history.exposure_detail.header")}
        </Text>
        <View style={style.exposureWindowContainer}>
          <SvgXml
            xml={Icons.ExposureIcon}
            accessible
            accessibilityLabel={t("exposure_history.possible_exposure")}
            fill={Colors.primary.shade125}
            width={Iconography.xxSmall}
            height={Iconography.xxSmall}
          />
          <Text style={style.exposureWindowText}>
            {exposureWindowBucketInWords(exposureDatum)}
          </Text>
        </View>
      </View>
      <View style={style.bottomContainer}>
        <ExposureActions />
      </View>
    </ScrollView>
  )
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.shade10,
  },
  headerContainer: {
    backgroundColor: Colors.secondary.shade10,
    paddingLeft: Spacing.medium,
    paddingRight: Spacing.massive,
    paddingTop: Spacing.large,
    paddingBottom: Spacing.small,
  },
  exposureWindowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  exposureWindowText: {
    ...Typography.header6,
    textTransform: "uppercase",
    color: Colors.neutral.shade110,
    marginLeft: Spacing.xSmall,
  },
  headerText: {
    ...Typography.header2,
    color: Colors.primary.shade125,
    marginBottom: Spacing.medium,
  },
  bottomContainer: {
    backgroundColor: Colors.background.primaryLight,
    flex: 1,
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xLarge,
    marginTop: Spacing.xxSmall,
  },
})

export default ExposureDetail
