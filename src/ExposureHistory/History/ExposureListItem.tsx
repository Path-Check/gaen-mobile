import React, { FunctionComponent } from "react"
import { TouchableHighlight, View, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { GlobalText } from "../../components"
import { ExposureDatum, exposureWindowBucket } from "../../exposure"

import { Icons } from "../../assets"
import { ExposureHistoryStackScreens } from "../../navigation"
import {
  Iconography,
  Colors,
  Spacing,
  Typography,
  Outlines,
} from "../../styles"

interface ExposureListItemProps {
  exposureDatum: ExposureDatum
}

const ExposureListItem: FunctionComponent<ExposureListItemProps> = ({
  exposureDatum,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

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
    <TouchableHighlight
      underlayColor={Colors.secondary50}
      style={style.container}
      onPress={() =>
        navigation.navigate(ExposureHistoryStackScreens.ExposureDetail, {
          exposureDatum,
        })
      }
    >
      <View style={style.innerContainer}>
        <View>
          <GlobalText style={style.primaryText}>
            {t("exposure_history.possible_exposure")}
          </GlobalText>
          <GlobalText style={style.secondaryText}>
            {exposureWindowBucketInWords(exposureDatum)}
          </GlobalText>
        </View>
        <SvgXml
          xml={Icons.ChevronRight}
          accessible
          accessibilityLabel={t("label.check")}
          width={Iconography.xxSmall}
          height={Iconography.xxSmall}
          fill={Colors.primary100}
        />
      </View>
    </TouchableHighlight>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
    marginBottom: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.xSmall,
    borderRadius: Outlines.borderRadiusLarge,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryText: {
    ...Typography.header6,
  },
  secondaryText: {
    ...Typography.body3,
    textTransform: "uppercase",
    marginTop: Spacing.xxSmall,
    letterSpacing: Typography.mediumLetterSpacing,
  },
})

export default ExposureListItem
