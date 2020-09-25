import React, { FunctionComponent } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useConfigurationContext } from "../ConfigurationContext"
import { useAnalyticsContext } from "../AnalyticsContext"
import { Stacks, useStatusBarEffect } from "../navigation"

import { Button, GlobalText } from "../components"
import { Colors, Typography, Spacing, Iconography } from "../styles"
import { Icons } from "../assets"
import ExternalLink from "../Settings/ExternalLink"

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
    navigation.navigate(Stacks.Settings)
  }

  const handleOnPressClose = () => {
    navigation.goBack()
  }

  const headerText = userConsentedToAnalytics
    ? t("settings.you_are_sharing_data")
    : t("settings.share_anonymized_data")

  const buttonText = userConsentedToAnalytics
    ? t("settings.stop_sharing_data")
    : t("settings.i_understand_and_consent")

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <GlobalText style={style.headerText}>{headerText}</GlobalText>
        <TouchableOpacity
          style={style.closeIconContainer}
          onPress={handleOnPressClose}
        >
          <SvgXml
            xml={Icons.XInCircle}
            fill={Colors.neutral30}
            width={Iconography.small}
            height={Iconography.small}
            testID="close-consent-screen"
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={style.mainContentContainer}>
        <GlobalText style={style.paragraph}>
          {t("settings.share_anonymized_data_para", { healthAuthorityName })}
        </GlobalText>
        <View style={style.privacyPolicyContainer}>
          <GlobalText style={style.privacyPolicy}>
            {t("settings.please_view_privacy_policy")}
          </GlobalText>
          <ExternalLink
            url={healthAuthorityPrivacyPolicyUrl}
            label={t("settings.here")}
          />
        </View>
        <Button onPress={handleOnPressButton} label={buttonText} />
        <GlobalText style={style.disclaimer}>
          {t("settings.share_anonymized_data_disclaimer", {
            healthAuthorityName,
          })}
        </GlobalText>
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xSmall,
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.secondary10,
  },
  headerText: {
    flex: 4,
    ...Typography.header2,
    color: Colors.primary125,
  },
  closeIconContainer: {
    flex: 1,
    alignItems: "flex-end",
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
})

export default AnonymizedDataConsentScreen
