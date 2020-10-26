import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { SelfAssessmentStackScreens, useStatusBarEffect } from "../navigation"
import { Text } from "../components"
import { useConfigurationContext } from "../ConfigurationContext"

import { Icons } from "../assets"
import { Buttons, Colors, Spacing, Typography } from "../styles"

const SelfAssessmentIntro: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    emergencyPhoneNumber,
    healthAuthorityName,
  } = useConfigurationContext()

  const handleOnPressStartAssessment = () => {
    navigation.navigate(SelfAssessmentStackScreens.HowAreYouFeeling)
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <Text style={style.headerText}>
        {t("self_assessment.intro.covid19_self_assessment")}
      </Text>
      <Text style={style.subheaderText}>
        {t("self_assessment.intro.find_out_how_to_care")}
      </Text>
      <View style={style.bulletListContainer}>
        <Text style={style.bulletText}>
          {t("self_assessment.intro.this_is_not_intended")}
        </Text>
        <Text style={style.bulletText}>
          {t("self_assessment.intro.you_are_a_resident", {
            healthAuthorityName,
          })}
        </Text>
        <Text style={style.bulletText}>
          {t("self_assessment.intro.this_is_based_on")}
        </Text>
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
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.xSmall,
  },
  subheaderText: {
    ...Typography.body1,
    color: Colors.text.primary,
    marginBottom: Spacing.xxxHuge,
  },
  bulletListContainer: {
    marginBottom: Spacing.large,
  },
  bulletText: {
    ...Typography.body2,
    marginBottom: Spacing.medium,
  },
  emergencyText: {
    ...Typography.error,
    ...Typography.mediumBold,
  },
  button: {
    ...Buttons.primary,
    alignSelf: "center",
    width: "100%",
  },
  buttonText: {
    ...Typography.buttonPrimary,
    marginRight: Spacing.small,
  },
})

export default SelfAssessmentIntro
