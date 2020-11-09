import React, { FunctionComponent } from "react"
import {
  Linking,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useConfigurationContext } from "../ConfigurationContext"
import { useProductAnalyticsContext } from "../ProductAnalytics/Context"
import { useStatusBarEffect } from "../navigation"

import { Text } from "../components"
import { Colors, Typography, Spacing, Buttons } from "../styles"

const AnonymizedDataConsentScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    healthAuthorityName,
    healthAuthorityPrivacyPolicyUrl,
  } = useConfigurationContext()
  const {
    userConsentedToAnalytics,
    updateUserConsent,
  } = useProductAnalyticsContext()

  const handleOnPressButton = async () => {
    const nextConsentState = !userConsentedToAnalytics
    updateUserConsent(nextConsentState)
    navigation.goBack()
  }

  const handleOnPressPrivacyPolicy = () => {
    Linking.openURL(healthAuthorityPrivacyPolicyUrl)
  }
  const privacyPolicyLinkText = t("product_analytics.privacy_policy")

  const buttonText = userConsentedToAnalytics
    ? t("product_analytics.stop_sharing_data")
    : t("product_analytics.i_understand_and_consent")

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <Text style={style.headerText}>
        {t("product_analytics.share_anonymized_data")}
      </Text>
      <View style={style.paragraphContainer}>
        <Text style={style.paragraph}>
          {t("product_analytics.share_data_para_1", {
            healthAuthorityName,
          })}
        </Text>
      </View>
      <View style={style.paragraphContainer}>
        <Text style={style.paragraphBold}>
          {t("product_analytics.share_data_para_2", {
            healthAuthorityName,
          })}
        </Text>
      </View>
      <View style={style.privacyPolicyLinkContainer}>
        <TouchableOpacity
          onPress={handleOnPressPrivacyPolicy}
          accessibilityLabel={privacyPolicyLinkText}
        >
          <Text style={style.privacyPolicyLinkText}>
            {privacyPolicyLinkText}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={style.buttonsContainer}>
        <TouchableOpacity
          style={style.button}
          onPress={handleOnPressButton}
          accessibilityLabel={buttonText}
        >
          <Text style={style.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
      <Text style={style.disclaimer}>
        {t("product_analytics.share_anonymized_data_disclaimer", {
          healthAuthorityName,
        })}
      </Text>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.large,
  },
  headerText: {
    ...Typography.header.x60,
    marginBottom: Spacing.large,
  },
  paragraphContainer: {
    marginBottom: Spacing.medium,
  },
  paragraph: {
    ...Typography.body.x30,
  },
  paragraphBold: {
    ...Typography.body.x30,
    ...Typography.style.bold,
  },
  privacyPolicyLinkContainer: {
    marginBottom: Spacing.huge,
  },
  privacyPolicyLinkText: {
    ...Typography.button.anchorLink,
  },
  buttonsContainer: {
    marginBottom: Spacing.huge,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
  },
  disclaimer: {
    ...Typography.body.x20,
  },
})

export default AnonymizedDataConsentScreen
