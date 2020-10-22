import React, { FunctionComponent, useEffect } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useConfigurationContext } from "../ConfigurationContext"
import { useAnalyticsContext } from "../AnalyticsContext"
import { useStatusBarEffect } from "../navigation"
import ExternalLink from "../Settings/ExternalLink"
import { applyModalHeader } from "../navigation/ModalHeader"

import { Text } from "../components"
import { Colors, Typography, Spacing, Buttons } from "../styles"

const AnonymizedDataConsentScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    healthAuthorityName,
    healthAuthorityPrivacyPolicyUrl,
  } = useConfigurationContext()
  const { userConsentedToAnalytics, updateUserConsent } = useAnalyticsContext()

  const handleOnPressButton = async () => {
    const nextConsentState = !userConsentedToAnalytics
    updateUserConsent(nextConsentState)
    navigation.goBack()
  }

  const buttonText = userConsentedToAnalytics
    ? t("settings.stop_sharing_data")
    : t("settings.i_understand_and_consent")

  const headerText = userConsentedToAnalytics
    ? t("settings.you_are_sharing_data")
    : t("settings.share_anonymized_data")

  useEffect(() => {
    navigation.setOptions({
      header: applyModalHeader(headerText),
    })
  }, [headerText, navigation])

  return (
    <View style={style.container}>
      <ScrollView
        contentContainerStyle={style.mainContentContainer}
        alwaysBounceVertical={false}
      >
        <Text style={style.paragraph}>
          {t("settings.share_anonymized_data_para", { healthAuthorityName })}
        </Text>
        <View style={style.privacyPolicyContainer}>
          <Text style={style.privacyPolicy}>
            {t("settings.please_view_privacy_policy")}
          </Text>
          <ExternalLink
            url={healthAuthorityPrivacyPolicyUrl}
            label={t("settings.here")}
          />
        </View>
        <TouchableOpacity
          style={style.button}
          onPress={handleOnPressButton}
          accessibilityLabel={buttonText}
        >
          <Text style={style.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
        <Text style={style.disclaimer}>
          {t("settings.share_anonymized_data_disclaimer", {
            healthAuthorityName,
          })}
        </Text>
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  mainContentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.large,
  },
  paragraph: {
    ...Typography.body1,
  },
  privacyPolicyContainer: {
    flexDirection: "row",
    marginVertical: Spacing.small,
  },
  privacyPolicy: {
    ...Typography.body1,
    ...Typography.mediumBold,
    marginRight: Spacing.xxxSmall,
  },
  disclaimer: {
    marginTop: Spacing.small,
    ...Typography.body2,
  },
  button: {
    ...Buttons.primary,
    marginBottom: Spacing.huge,
  },
  buttonText: {
    ...Typography.buttonPrimary,
  },
})

export default AnonymizedDataConsentScreen
