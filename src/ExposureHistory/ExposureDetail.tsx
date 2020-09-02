import React, { FunctionComponent, useState, useEffect } from "react"
import { View, ScrollView, StyleSheet, Linking } from "react-native"
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import NetInfo from "@react-native-community/netinfo"

import { ExposureHistoryStackParamList, Screens } from "../navigation"
import { GlobalText, Button } from "../components"
import { useStatusBarEffect } from "../navigation"
import { ExposureDatum, exposureWindowBucket } from "../exposure"

import { Colors, Iconography, Spacing, Typography } from "../styles"
import { Icons } from "../assets"
import { useConfigurationContext } from "../ConfigurationContext"

const ExposureDetail: FunctionComponent = () => {
  const navigation = useNavigation()
  const route = useRoute<
    RouteProp<ExposureHistoryStackParamList, "ExposureDetail">
  >()
  useStatusBarEffect("light-content", Colors.headerBackground)
  const { t } = useTranslation()
  const {
    healthAuthorityName,
    healthAuthorityAdviceUrl,
  } = useConfigurationContext()

  const [isConnected, setIsConnected] = useState<boolean | null | undefined>(
    true,
  )

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // netInfo state comes as null while unresolved so to avoid flicker we only set component state
      // if the netInfo state is resolved to boolean
      if (state.isInternetReachable !== null) {
        setIsConnected(state.isInternetReachable)
      }
    })
    return unsubscribe
  }, [])

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

  const handleOnPressNextStep = () => {
    healthAuthorityAdviceUrl
      ? Linking.openURL(healthAuthorityAdviceUrl)
      : navigation.navigate(Screens.SelfAssessment)
  }

  return (
    <ScrollView style={style.container}>
      <View style={style.headerContainer}>
        <View style={style.exposureWindowContainer}>
          <SvgXml
            xml={Icons.ExposureIcon}
            accessible
            accessibilityLabel={t("exposure_history.possible_exposure")}
            fill={Colors.primary125}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
          />
          <GlobalText style={style.exposureWindowText}>
            {exposureWindowBucketInWords(exposureDatum)}
          </GlobalText>
        </View>
        <GlobalText style={style.headerText}>
          {t("exposure_history.exposure_detail.header")}
        </GlobalText>
        <GlobalText style={style.contentText}>
          {t("exposure_history.exposure_detail.content")}
        </GlobalText>
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
        <View style={style.buttonContainer}>
          <Button
            onPress={handleOnPressNextStep}
            label={t("exposure_history.exposure_detail.next_steps")}
            disabled={!isConnected}
            hasRightArrow
          />
        </View>
        {!isConnected && (
          <GlobalText style={style.connectivityWarningText}>
            {t("exposure_history.no_connectivity_message")}
          </GlobalText>
        )}
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
    backgroundColor: Colors.secondary10,
  },
  headerContainer: {
    backgroundColor: Colors.primaryLightBackground,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.large,
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
    ...Typography.header3,
    marginBottom: Spacing.xxSmall,
  },
  contentText: {
    ...Typography.body2,
  },
  bottomContainer: {
    backgroundColor: Colors.primaryLightBackground,
    flex: 1,
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xLarge,
    marginTop: Spacing.xxSmall,
  },
  bottomHeaderText: {
    ...Typography.header5,
    marginBottom: Spacing.xxSmall,
  },
  bottomSubheaderText: {
    ...Typography.body2,
    color: Colors.neutral100,
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
    backgroundColor: Colors.primaryLightBackground,
    padding: Spacing.xLarge,
    marginBottom: Spacing.xSmall,
  },
  recommendationText: {
    ...Typography.body3,
  },
  buttonContainer: {
    alignSelf: "flex-start",
  },
  connectivityWarningText: {
    ...Typography.error,
    marginTop: Spacing.small,
  },
})

export default ExposureDetail
