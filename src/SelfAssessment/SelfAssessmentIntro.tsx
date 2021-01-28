import React, { FunctionComponent } from "react"
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useCustomCopy } from "../configuration/useCustomCopy"
import { SelfAssessmentStackScreens, useStatusBarEffect } from "../navigation"
import { Text } from "../components"
import { useConfigurationContext } from "../ConfigurationContext"

import { Icons, Images } from "../assets"
import { Buttons, Colors, Outlines, Spacing, Typography } from "../styles"

const SelfAssessmentIntro: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { emergencyPhoneNumber } = useConfigurationContext()
  const { healthAuthorityName } = useCustomCopy()

  const handleOnPressStartAssessment = () => {
    navigation.navigate(SelfAssessmentStackScreens.HowAreYouFeeling)
  }

  const handleOnPressCDCLink = () => {
    const cdcSelfCheckerURL =
      "https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/coronavirus-self-checker.html"
    Linking.openURL(cdcSelfCheckerURL)
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <Image source={Images.SelfAssessment} style={style.image} />
      <Text style={style.headerText}>
        {t("self_assessment.intro.covid19_self_assessment")}
      </Text>
      <Text style={style.subheaderText}>
        {t("self_assessment.intro.find_out_how_to_care")}
      </Text>
      <View style={style.bulletListContainer}>
        <Text style={style.bulletText}>
          • {t("self_assessment.intro.this_is_not_intended")}
        </Text>
        <Text style={style.bulletText}>
          •{" "}
          {t("self_assessment.intro.you_are_a_resident", {
            healthAuthorityName,
          })}
        </Text>
        <Text style={style.bulletText}>
          • {t("self_assessment.intro.this_is_based_on")}
        </Text>
        <TouchableOpacity
          onPress={handleOnPressCDCLink}
          accessibilityRole="link"
        >
          <Text style={{ ...style.bulletText, ...style.linkText }}>
            • {t("self_assessment.intro.learn_more")}
          </Text>
        </TouchableOpacity>
        <Text style={{ ...style.bulletText, ...style.emergencyText }}>
          {t("self_assessment.intro.if_this_is", { emergencyPhoneNumber })}
        </Text>
      </View>
      <TouchableOpacity
        style={style.button}
        onPress={handleOnPressStartAssessment}
      >
        <Text style={style.buttonText}>
          {t("self_assessment.intro.agree_and_start_assessment")}
        </Text>
        <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
      </TouchableOpacity>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "flex-start",
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.large,
  },
  image: {
    resizeMode: "contain",
    width: Spacing.xxxMassive,
    height: Spacing.xxxMassive,
    marginBottom: Spacing.large,
  },
  headerText: {
    ...Typography.header.x60,
    ...Typography.style.bold,
    marginBottom: Spacing.xSmall,
  },
  subheaderText: {
    ...Typography.body.x30,
    color: Colors.text.primary,
    marginBottom: Spacing.large,
  },
  bulletListContainer: {
    paddingTop: Spacing.large,
    marginBottom: Spacing.small,
    borderTopColor: Colors.neutral.shade10,
    borderTopWidth: Outlines.hairline,
  },
  bulletText: {
    ...Typography.body.x20,
    marginBottom: Spacing.xxSmall,
  },
  linkText: {
    color: Colors.text.anchorLink,
    textDecorationLine: "underline",
  },
  emergencyText: {
    ...Typography.utility.error,
    ...Typography.style.medium,
    marginTop: Spacing.small,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
})

export default SelfAssessmentIntro
