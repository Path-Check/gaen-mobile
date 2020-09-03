import React, { FunctionComponent } from "react"
import { Linking, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useApplicationName } from "../hooks/useApplicationInfo"
import { GlobalText } from "../components"
import { Colors, Spacing, Typography } from "../styles"
import { Icons } from "../assets"
import { useConfigurationContext } from "../ConfigurationContext"
import useAuthorityCopy from "../configuration/useAuthorityCopy"

const Legal: FunctionComponent = () => {
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const { applicationName } = useApplicationName()
  const {
    healthAuthorityName,
    healthAuthorityPrivacyPolicyUrl,
  } = useConfigurationContext()

  const handleOnPressLink = () => {
    Linking.openURL(healthAuthorityPrivacyPolicyUrl)
  }

  const legalContent = useAuthorityCopy(
    "legal",
    localeCode,
    healthAuthorityName,
  )

  return (
    <ScrollView style={style.container} alwaysBounceVertical={false}>
      <GlobalText style={style.headerContent} testID={"licenses-legal-header"}>
        {applicationName}
      </GlobalText>
      <TouchableOpacity
        onPress={handleOnPressLink}
        accessibilityLabel={t("label.privacy_policy")}
      >
        <GlobalText style={style.privacyPolicyText}>
          {t("label.privacy_policy")}
        </GlobalText>
        <SvgXml xml={Icons.ChevronRight} fill={Colors.white} />
      </TouchableOpacity>
      <GlobalText style={style.contentText}>{legalContent}</GlobalText>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
  headerContent: {
    ...Typography.header2,
    marginBottom: Spacing.small,
    color: Colors.primary150,
  },
  contentText: {
    ...Typography.body1,
    marginBottom: Spacing.medium,
  },
  privacyPolicyText: {
    ...Typography.anchorLink,
  },
})

export default Legal
