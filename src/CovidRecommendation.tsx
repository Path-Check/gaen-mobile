import React, { FunctionComponent } from "react"
import {
  Linking,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useStatusBarEffect } from "./navigation"
import { Text } from "./components"
import { useConfigurationContext } from "./ConfigurationContext"

import { Buttons, Outlines, Colors, Spacing, Typography } from "./styles"
import { Images, Icons } from "./assets"

interface CovidRecommendationProps {
  onDismiss: () => void
}

const CovidRecommendation: FunctionComponent<CovidRecommendationProps> = ({
  onDismiss,
}) => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const { t } = useTranslation()
  const { findATestCenterUrl } = useConfigurationContext()

  const handleOnPressDone = () => {
    onDismiss()
  }

  const RecommendationContent: FunctionComponent = () => {
    const { t } = useTranslation()

    return (
      <>
        <Text style={style.bullet1}>
          {t("self_assessment.guidance.stay_home_14_days")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_assessment.guidance.take_temperature")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_assessment.guidance.practice_social_distancing")}
        </Text>
        <View style={style.bullet3Container}>
          <Text style={style.bullet3}>
            {t("self_assessment.guidance.stay_6_feet_away")}
          </Text>
          <Text style={style.bullet3}>
            {t("self_assessment.guidance.stay_away_from_higher_risk_people")}
          </Text>
        </View>
        <Text style={style.bullet2}>
          {t("self_assessment.guidance.follow_cdc_guidance")}
        </Text>
      </>
    )
  }

  const displayFindATestCenter = Boolean(findATestCenterUrl)

  const handleOnPressFindTestCenter = () => {
    if (findATestCenterUrl) {
      Linking.openURL(findATestCenterUrl)
    }
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.topScrollViewBackground} />
        <View style={style.headerContainer}>
          <Image source={Images.SelfAssessment} style={style.image} />
          <Text style={style.headerText}>
            {t("self_assessment.guidance.guidance")}
          </Text>
          <Text style={style.subheaderText}>
            {t("self_assessment.guidance.your_symptoms_might_be_related")}
          </Text>
        </View>
        <View style={style.bottomContainer}>
          <RecommendationContent />
          {displayFindATestCenter && (
            <TouchableOpacity
              style={style.button}
              onPress={handleOnPressFindTestCenter}
              accessibilityLabel={t(
                "self_assessment.guidance.find_a_test_center_nearby",
              )}
            >
              <Text style={style.buttonText}>
                {t("self_assessment.guidance.find_a_test_center_nearby")}
              </Text>
              <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={style.doneButton}
            onPress={handleOnPressDone}
            accessibilityLabel={t("common.done")}
          >
            <Text style={style.doneButtonText}>{t("common.done")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingBottom: Spacing.xxxHuge,
  },
  topScrollViewBackground: {
    position: "absolute",
    top: "-100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.secondary.shade10,
    height: "100%",
  },
  headerContainer: {
    paddingVertical: Spacing.huge,
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.large,
    backgroundColor: Colors.secondary.shade10,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: Spacing.xLarge,
  },
  headerText: {
    ...Typography.header.x60,
    marginBottom: Spacing.xxSmall,
  },
  subheaderText: {
    ...Typography.header.x30,
    ...Typography.style.normal,
    color: Colors.neutral.black,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.background.primaryLight,
    marginBottom: Spacing.xxLarge,
  },
  bullet1: {
    ...Typography.header.x30,
    color: Colors.primary.shade100,
    marginBottom: Spacing.medium,
  },
  bullet2: {
    ...Typography.body.x30,
    ...Typography.style.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.small,
  },
  bullet3Container: {
    paddingLeft: Spacing.medium,
    paddingTop: Spacing.xxSmall,
    marginBottom: Spacing.small,
    borderLeftWidth: Outlines.hairline,
    borderLeftColor: Colors.neutral.shade25,
  },
  bullet3: {
    ...Typography.body.x30,
    marginBottom: Spacing.xxSmall,
  },
  button: {
    ...Buttons.thin.base,
    marginTop: Spacing.medium,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
  doneButton: {
    ...Buttons.outlined.thin,
    marginTop: Spacing.small,
  },
  doneButtonText: {
    ...Typography.button.secondary,
  },
})

export default CovidRecommendation
