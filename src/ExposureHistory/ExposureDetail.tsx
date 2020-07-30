import React, { FunctionComponent } from "react"
import env from "react-native-config"
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native"
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ExposureHistoryStackParamList, Screens } from "../navigation"
import { GlobalText } from "../components/GlobalText"
import { useStatusBarEffect } from "../navigation"
import { Possible, ExposureDatum, exposureWindowBucket } from "../exposure"

import { Colors, Iconography, Spacing, Typography, Buttons } from "../styles"
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
    <ScrollView style={style.container}>
      <View style={style.headerContainer}>
        <View style={style.exposureWindowContainer}>
          <SvgXml
            xml={Icons.ExposureIcon}
            fill={Colors.primaryViolet}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
          />
          <GlobalText style={style.exposureWindow}>
            {exposureWindowBucketInWords(exposureDatum)}
          </GlobalText>
        </View>
        <GlobalText style={style.headerText}>{headerText}</GlobalText>
        <GlobalText style={style.contentText}>{contentText}</GlobalText>
      </View>
      <View style={style.bottomContainer}>
        <GlobalText style={style.bottomHeaderText}>
          {t("exposure_history.exposure_detail.ha_guidance_header")}
        </GlobalText>
        <GlobalText style={style.bottomSubheaderText}>
          {t("exposure_history.exposure_detail.ha_guidance_subheader", {
            healthAuthorityName,
          })}
        </GlobalText>
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
          <GlobalText style={style.nextStepsButtonText}>
            {t("exposure_history.exposure_detail.next_steps")}
          </GlobalText>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
      <GlobalText style={style.recommendationText}>{text}</GlobalText>
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
    paddingVertical: Spacing.xLarge,
  },
  exposureWindow: {
    ...Typography.base,
    color: Colors.darkGray,
    textTransform: "uppercase",
    letterSpacing: Typography.mediumLetterSpacing,
    marginLeft: Spacing.xSmall,
  },
  headerText: {
    ...Typography.header6,
    marginBottom: Spacing.xxSmall,
  },
  contentText: {
    ...Typography.tertiaryContent,
    color: Colors.darkGray,
  },
  exposureWindowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xSmall,
  },
  bottomContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xLarge,
    marginTop: Spacing.xxSmall,
  },
  bottomHeaderText: {
    ...Typography.header6,
    fontSize: Typography.large,
    marginBottom: Spacing.xxSmall,
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
  },
  nextStepsButtonText: {
    ...Typography.buttonTextLight,
  },
})

export default ExposureDetail
