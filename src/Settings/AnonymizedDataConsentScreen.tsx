import React, { FunctionComponent } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useConfigurationContext } from "../ConfigurationContext"
import { useAnalyticsContext } from "../AnalyticsContext"
import { Stacks } from "../navigation"

import { Button, GlobalText } from "../components"
import { Colors, Typography, Spacing, Iconography } from "../styles"
import { Icons } from "../assets"
import ExternalLink from "./ExternalLink"

const AnonymizedDataConsentScreen: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    healthAuthorityName,
    healthAuthorityPrivacyPolicyUrl,
  } = useConfigurationContext()
  const { updateUserConsent } = useAnalyticsContext()

  const handleOnPressConsent = async () => {
    await updateUserConsent(true)
    navigation.navigate(Stacks.Settings)
  }

  const handleOnPressClose = () => {
    navigation.navigate(Stacks.Settings)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.mainContentContainer}
      >
        <TouchableOpacity
          onPress={handleOnPressClose}
          style={style.closeButton}
          testID="close-consent-screen"
        >
          <SvgXml
            xml={Icons.Close}
            height={Iconography.xxSmall}
            width={Iconography.xxSmall}
            fill={Colors.secondary100}
          />
        </TouchableOpacity>
        <GlobalText style={style.headerText}>
          {t("settings.share_anonymized_data")}
        </GlobalText>
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
        <Button
          onPress={handleOnPressConsent}
          label={t("settings.i_understand_and_consent")}
        />
        <GlobalText style={style.disclaimer}>
          {t("settings.share_anonymized_data_disclaimer", {
            healthAuthorityName,
          })}
        </GlobalText>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    marginTop: Spacing.xxLarge,
    marginHorizontal: Spacing.large,
  },
  mainContentContainer: {
    paddingBottom: Spacing.large,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  headerText: {
    ...Typography.header1,
    paddingBottom: Spacing.xSmall,
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
