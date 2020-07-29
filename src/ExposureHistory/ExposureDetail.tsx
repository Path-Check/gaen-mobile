import React, { FunctionComponent } from "react"
import env from "react-native-config"
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native"
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ExposureHistoryStackParamList, Screens } from "../navigation"
import { RTLEnabledText } from "../components/RTLEnabledText"
import { useStatusBarEffect } from "../navigation"
import { Possible, ExposureDatum, exposureWindowBucket } from "../exposure"

import {
  Colors,
  Iconography,
  Outlines,
  Spacing,
  Typography,
  Buttons,
} from "../styles"
import { Icons } from "../assets"

const ExposureDetail: FunctionComponent = () => {
  const navigation = useNavigation()
  const route = useRoute<
    RouteProp<ExposureHistoryStackParamList, "ExposureDetail">
  >()
  useStatusBarEffect("light-content")
  const { t } = useTranslation()

  const {
    GAEN_AUTHORITY_NAME: healthAuthorityName,
    AUTHORITY_ADVICE_URL: healthAuthorityLink,
  } = env
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

  const handleOnPressNextStep = () => {
    healthAuthorityLink
      ? Linking.openURL(healthAuthorityLink)
      : navigation.navigate(Screens.SelfAssessment)
  }

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <View style={style.exposureWindowContainer}>
          <View style={style.iconContainerCircle}>
            <SvgXml
              xml={Icons.ExposureIcon}
              fill={Colors.primaryViolet}
              width={Iconography.small}
              height={Iconography.small}
            />
          </View>
          <RTLEnabledText style={style.exposureWindow}>
            {exposureWindowBucketInWords(exposureDatum)}
          </RTLEnabledText>
        </View>
        <RTLEnabledText style={style.headerText}>{headerText}</RTLEnabledText>
        <RTLEnabledText style={style.contentText}>{contentText}</RTLEnabledText>
      </View>
      <View style={style.bottomContainer}>
        <RTLEnabledText style={style.bottomHeaderText}>
          {t("exposure_history.exposure_detail.ha_guidance_header")}
        </RTLEnabledText>
        <RTLEnabledText style={style.bottomSubheaderText}>
          {t("exposure_history.exposure_detail.ha_guidance_subheader", {
            healthAuthorityName,
          })}
        </RTLEnabledText>
        <View style={style.recommendations}>
          <RecommendationBubble
            icon={Icons.IsolateBubbles}
            text={t("exposure_history.exposure_detail.isolate")}
          />
          <RecommendationBubble
            icon={Icons.Mask}
            text={t("exposure_history.exposure_detail.wear_a_mask")}
          />
          <RecommendationBubble
            icon={Icons.SixFeet}
            text={t("exposure_history.exposure_detail.6ft_apart")}
          />
          <RecommendationBubble
            icon={Icons.WashHands}
            text={t("exposure_history.exposure_detail.wash_your_hands")}
          />
        </View>
        <TouchableOpacity
          onPress={handleOnPressNextStep}
          style={style.nextStepsButton}
        >
          <RTLEnabledText style={style.nextStepsButtonText}>
            {t("exposure_history.exposure_detail.next_steps")}
          </RTLEnabledText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

type RecommendationBubbleProps = {
  text: string
  icon: string
}
const RecommendationBubble: FunctionComponent<RecommendationBubbleProps> = ({
  text,
  icon,
}) => {
  return (
    <View style={style.recommendation}>
      <View style={style.recommendationBubbleCircle}>
        <SvgXml
          xml={icon}
          width={Iconography.small}
          height={Iconography.small}
        />
      </View>
      <RTLEnabledText style={style.recommendationText}>{text}</RTLEnabledText>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  headerContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.large,
  },
  exposureWindow: {
    ...Typography.base,
    color: Colors.darkGray,
    textTransform: "uppercase",
    letterSpacing: Typography.mediumLetterSpacing,
  },
  headerText: {
    ...Typography.header6,
  },
  contentText: {
    ...Typography.tertiaryContent,
    marginTop: Spacing.xxSmall,
    color: Colors.darkGray,
  },
  exposureWindowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.small,
  },
  iconContainerCircle: {
    ...Iconography.xSmallIcon,
    ...Outlines.glowShadow,
    alignSelf: "center",
    marginRight: Spacing.xSmall,
  },
  bottomContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: Spacing.medium,
    marginTop: Spacing.xxSmall,
  },
  bottomHeaderText: {
    ...Typography.header6,
    fontSize: Typography.large,
    paddingBottom: Spacing.small,
  },
  bottomSubheaderText: {
    ...Typography.tertiaryContent,
    color: Colors.darkGray,
    marginBottom: Spacing.medium,
  },
  recommendations: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xxxLarge,
  },
  recommendation: {
    display: "flex",
    alignItems: "center",
  },
  recommendationBubbleCircle: {
    ...Iconography.smallIcon,
    borderRadius: 50,
    backgroundColor: Colors.primaryBackground,
    padding: Spacing.xLarge,
    marginBottom: Spacing.xSmall,
  },
  recommendationText: {
    ...Typography.tinyFont,
    color: Colors.primaryText,
  },
  nextStepsButton: {
    ...Buttons.largeBlue,
    ...Buttons.largeBlue,
  },
  nextStepsButtonText: {
    ...Typography.buttonTextLight,
  },
})

export default ExposureDetail
