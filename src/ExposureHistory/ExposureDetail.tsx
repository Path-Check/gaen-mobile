import React, { FunctionComponent } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ExposureHistoryStackParamList } from "../navigation"
import { GlobalText } from "../components"
import { useStatusBarEffect } from "../navigation"
import { ExposureDatum, exposureWindowBucket } from "../exposure"

import { Colors, Iconography, Spacing, Typography } from "../styles"
import { Icons } from "../assets"
import ExposureActions from "./detail/ExposureActions"

const ExposureDetail: FunctionComponent = () => {
  const route = useRoute<
    RouteProp<ExposureHistoryStackParamList, "ExposureDetail">
  >()
  useStatusBarEffect("light-content", Colors.headerBackground)
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
    <ScrollView style={style.container}>
      <View style={style.headerContainer}>
        <GlobalText style={style.headerText}>
          {t("exposure_history.exposure_detail.header")}
        </GlobalText>
        <View style={style.exposureWindowContainer}>
          <SvgXml
            xml={Icons.ExposureIcon}
            accessible
            accessibilityLabel={t("exposure_history.possible_exposure")}
            fill={Colors.primary125}
            width={Iconography.xxSmall}
            height={Iconography.xxSmall}
          />
          <GlobalText style={style.exposureWindowText}>
            {exposureWindowBucketInWords(exposureDatum)}
          </GlobalText>
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
    backgroundColor: Colors.primaryLightBackground,
  },
  headerContainer: {
    backgroundColor: Colors.secondary10,
    paddingLeft: Spacing.medium,
    paddingRight: Spacing.massive,
    paddingTop: Spacing.large,
    paddingBottom: Spacing.medium,
  },
  exposureWindowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xSmall,
  },
  exposureWindowText: {
    ...Typography.header6,
    textTransform: "uppercase",
    color: Colors.neutral110,
    marginLeft: Spacing.xSmall,
  },
  headerText: {
    ...Typography.header2,
    color: Colors.primary125,
    marginBottom: Spacing.medium,
  },
  bottomContainer: {
    backgroundColor: Colors.primaryLightBackground,
    flex: 1,
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xLarge,
    marginTop: Spacing.xxSmall,
  },
})

export default ExposureDetail
