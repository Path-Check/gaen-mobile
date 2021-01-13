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

interface CovidRecommendationProps {
  onDismiss: () => void
}

const CovidRecommendation: FunctionComponent<CovidRecommendationProps> = ({
  onDismiss,
}) => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const { t } = useTranslation()
  const { findATestCenterUrl, cdcGuidanceUrl } = useConfigurationContext()

  const handleOnPressDone = () => {
    onDismiss()
  }

  const RecommendationContent: FunctionComponent = () => {
    const handleOnPressCDCGuidanceUrl = () => {
      if (cdcGuidanceUrl) {
        Linking.openURL(cdcGuidanceUrl)
      }
    }

    const symptomQuarantineLength = 10

    return (
      <View>
        <View style={style.contentContainer}>
          <Text style={style.boldText}>
            {t("covid_recommendation.stay_home")}
          </Text>
          <Text style={style.contentText}>
            {t("covid_recommendation.at_least_x_days", {
              quarantineLength: symptomQuarantineLength,
            })}
          </Text>
          <Text style={style.contentText}>
            {t("covid_recommendation.you_have_not_had_a")}
          </Text>
          <Text style={style.contentText}>
            {t("covid_recommendation.and_other_covid")}
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
          <Text>
            <Text style={style.contentText}>
              {t("covid_recommendation.get_rest_and_stay")}
            </Text>
          </Text>
          <Pressable
            onPress={handleOnPressCDCGuidanceUrl}
            style={style.cdcGuidanceLinkContainer}
          >
            <Text style={style.cdcGuidanceLinkText}>
              {t("covid_recommendation.cdc_guidance")}
            </Text>
          </Pressable>
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

  return (
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
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingBottom: Spacing.medium,
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
    ...Typography.style.bold,
  },
  cdcGuidanceLinkContainer: {
    paddingVertical: Spacing.xxSmall,
  },
  cdcGuidanceLinkText: {
    ...Typography.button.anchorLink,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.background.primaryLight,
    marginBottom: Spacing.xxLarge,
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
