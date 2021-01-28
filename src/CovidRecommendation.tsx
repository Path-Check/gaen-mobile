import React, { FunctionComponent } from "react"
import {
  Linking,
  Pressable,
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

import { Buttons, Colors, Spacing, Typography } from "./styles"
import { Images, Icons } from "./assets"

const CovidRecommendation: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const { t } = useTranslation()
  const {
    findATestCenterUrl,
    cdcGuidanceUrl,
    cdcSymptomsUrl,
  } = useConfigurationContext()

  const RecommendationContent: FunctionComponent = () => {
    return (
      <View>
        <View>
          <Text style={style.contentText}>
            {t("covid_recommendation.to_prevent_the_spread")}
          </Text>
        </View>
        <View style={style.contentContainer}>
          <Text style={style.boldText}>
            {t("covid_recommendation.stay_home_except_to_get_medical_care")}
          </Text>
        </View>

        <View style={style.contentContainer}>
          <Text>
            <Text style={style.boldText}>
              {t("covid_recommendation.physically_separate")}
            </Text>
            <Text style={style.contentText}>
              {t("covid_recommendation.includeing_people")}
            </Text>
          </Text>
        </View>

        <View style={style.contentContainer}>
          <Text>
            <Text style={style.boldText}>
              {t("covid_recommendation.maintain_at_least")}
            </Text>
            <Text style={style.contentText}>
              {t("covid_recommendation.from_others_at")}
            </Text>
            <Text style={style.boldText}>
              {t("covid_recommendation.wear_a_face_covering")}
            </Text>
          </Text>
        </View>

        <View style={style.contentContainer}>
          <Text style={style.contentText}>
            {t("covid_recommendation.get_rest_and_stay")}
          </Text>
        </View>
      </View>
    )
  }

  const displayFindATestCenter = Boolean(findATestCenterUrl)

  const handleOnPressFindTestCenter = () => {
    if (findATestCenterUrl) {
      Linking.openURL(findATestCenterUrl)
    }
  }

  const handleOnPressCovidSymptoms = () => {
    if (cdcSymptomsUrl) {
      Linking.openURL(cdcSymptomsUrl)
    }
  }

  const handleOnPressCDCGuidanceUrl = () => {
    if (cdcGuidanceUrl) {
      Linking.openURL(cdcGuidanceUrl)
    }
  }

  return (
    <ScrollView style={style.container} alwaysBounceVertical={false}>
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
          <View style={style.ctaContainer}>
            <View style={style.contentContainer}>
              <Text style={style.boldText}>
                {t("covid_recommendation.get_a_covid_test")}
              </Text>
            </View>
            <TouchableOpacity
              style={style.button}
              onPress={handleOnPressFindTestCenter}
              accessibilityLabel={t("covid_recommendation.find_a_test_center")}
            >
              <Text style={style.buttonText}>
                {t("covid_recommendation.find_a_test_center")}
              </Text>
              <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
            </TouchableOpacity>
          </View>
        )}

        <View style={style.ctaContainer}>
          <View style={style.contentContainer}>
            <Text style={style.boldText}>
              {t("covid_recommendation.monitor_for_fever")}
            </Text>
          </View>
          <Pressable
            onPress={handleOnPressCovidSymptoms}
            style={style.doneButton}
          >
            <Text style={style.doneButtonText}>
              {t("covid_recommendation.review_symptoms")}
            </Text>
          </Pressable>
        </View>

        <View style={style.ctaContainer}>
          <View style={style.contentContainer}>
            <Text style={style.contentText}>
              {t("covid_recommendation.for_more_information")}
            </Text>
          </View>
          <Pressable
            onPress={handleOnPressCDCGuidanceUrl}
            style={style.doneButton}
          >
            <Text style={style.doneButtonText}>
              {t("covid_recommendation.review_cdc_guidance")}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingVertical: Spacing.xxSmall,
  },
  ctaContainer: {
    paddingBottom: Spacing.xSmall,
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
  contentText: {
    ...Typography.body.x30,
  },
  boldText: {
    ...Typography.body.x30,
    ...Typography.style.semibold,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.background.primaryLight,
    marginBottom: Spacing.xxLarge,
  },
  button: {
    ...Buttons.thin.base,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
  doneButton: {
    ...Buttons.outlined.thin,
  },
  doneButtonText: {
    ...Typography.button.secondary,
  },
})

export default CovidRecommendation
