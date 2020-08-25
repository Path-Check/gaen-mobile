import React, { FunctionComponent } from "react"
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useApplicationName } from "./useApplicationInfo"
import { GlobalText } from "../components/GlobalText"
import { Colors, Spacing, Typography } from "../styles"
import { Icons } from "../assets"
import { useConfigurationContext } from "../ConfigurationContext"

const Legal: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()
  const {
    healthAuthorityName,
    healthAuthorityPrivacyPolicyUrl,
  } = useConfigurationContext()

  const handleOnPressLink = () => {
    Linking.openURL(healthAuthorityPrivacyPolicyUrl)
  }

  return (
    <View style={style.container}>
      <GlobalText style={style.headerContent} testID={"licenses-legal-header"}>
        {applicationName}
      </GlobalText>
      <GlobalText style={style.contentText}>{healthAuthorityName}</GlobalText>
      <TouchableOpacity
        onPress={handleOnPressLink}
        accessibilityLabel={t("label.privacy_policy")}
      >
        <GlobalText style={style.privacyPolicyText}>
          {t("label.privacy_policy")}
        </GlobalText>
        <SvgXml xml={Icons.ChevronRight} fill={Colors.white} />
      </TouchableOpacity>
    </View>
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
