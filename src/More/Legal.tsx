import React, { FunctionComponent } from "react"
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import env from "react-native-config"
import { useApplicationName } from "./useApplicationInfo"

import { GlobalText } from "../components/GlobalText"

import { Colors, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

const Licenses: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()

  const {
    PRIVACY_POLICY_URL: privacyPolicyUrl,
    GAEN_AUTHORITY_NAME: healthAuthorityName,
  } = env

  const handleOnPressLink = () => {
    Linking.openURL(privacyPolicyUrl)
  }

  return (
    <View style={style.container}>
      <GlobalText style={style.headerContent} testID={"licenses-legal-header"}>
        {applicationName}
      </GlobalText>
      <GlobalText style={style.contentText}>{healthAuthorityName}</GlobalText>
      <TouchableOpacity onPress={handleOnPressLink}>
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
    ...Typography.secondaryContent,
    ...Typography.mediumBold,
    marginBottom: Spacing.medium,
    color: Colors.primary110,
  },
  privacyPolicyText: {
    ...Typography.link,
  },
})

export default Licenses
