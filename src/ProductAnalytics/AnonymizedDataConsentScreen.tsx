import React, { FunctionComponent, useEffect } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useConfigurationContext } from "../ConfigurationContext"
import { useAnalyticsContext } from "./Context"
import { useOnboardingContext } from "../OnboardingContext"
import { ActivationStackScreens, useStatusBarEffect } from "../navigation"
import ExternalLink from "../Settings/ExternalLink"
import { applyModalHeader } from "../navigation/ModalHeader"

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
  const { userConsentedToAnalytics, updateUserConsent } = useAnalyticsContext()
  const { isOnboardingComplete } = useOnboardingContext()
  const inOnboardingFlow = !isOnboardingComplete

  const handleOnPressButton = async () => {
    const nextConsentState = !userConsentedToAnalytics
    updateUserConsent(nextConsentState)
    if (inOnboardingFlow) {
      navigation.navigate(ActivationStackScreens.ActivationSummary)
    } else {
      navigation.goBack()
    }
  }

  const handleOnPressMaybeLater = () => {
    navigation.navigate(ActivationStackScreens.ActivationSummary)
  }

  const buttonText = userConsentedToAnalytics
    ? t("settings.stop_sharing_data")
    : t("settings.i_understand_and_consent")

  const headerText = userConsentedToAnalytics
    ? t("settings.you_are_sharing_data")
    : t("settings.share_anonymized_data")

  useEffect(() => {
    if (!inOnboardingFlow) {
      navigation.setOptions({
        header: applyModalHeader(headerText),
      })
    }
  }, [headerText, navigation, inOnboardingFlow])

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      {inOnboardingFlow && (
        <Text style={style.headerText}>
          {t("settings.share_anonymized_data")}
        </Text>
      )}
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
      {inOnboardingFlow && (
        <TouchableOpacity
          onPress={handleOnPressMaybeLater}
          style={style.secondaryButton}
          accessibilityLabel={t("common.maybe_later")}
        >
          <Text style={style.secondaryButtonText}>
            {t("common.maybe_later")}
          </Text>
        </TouchableOpacity>
      )}
      <Text style={style.disclaimer}>
        {t("settings.share_anonymized_data_disclaimer", {
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
  paragraph: {
    ...Typography.body.x30,
  },
  privacyPolicyContainer: {
    flexDirection: "row",
    marginVertical: Spacing.small,
  },
  privacyPolicy: {
    ...Typography.body.x30,
    ...Typography.style.medium,
    marginRight: Spacing.xxxSmall,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
  },
  secondaryButton: {
    ...Buttons.secondary.base,
  },
  secondaryButtonText: {
    ...Typography.button.secondary,
  },
  disclaimer: {
    marginTop: Spacing.huge,
    ...Typography.body.x20,
  },
})

export default AnonymizedDataConsentScreen
