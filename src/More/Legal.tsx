import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { useApplicationName } from "../hooks/useApplicationInfo"
import { GlobalText } from "../components"
import { Colors, Spacing, Typography } from "../styles"
import { useConfigurationContext } from "../ConfigurationContext"
import useAuthorityCopy from "../configuration/useAuthorityCopy"
import useAuthorityLinks from "../configuration/useAuthorityLinks"
import ExternalLink from "./ExternalLink"

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

  const legalContent = useAuthorityCopy(
    "legal",
    localeCode,
    healthAuthorityName,
  )

  const authorityLinks = useAuthorityLinks("legal", localeCode)

  return (
    <ScrollView style={style.container} alwaysBounceVertical={false}>
      <GlobalText style={style.headerContent} testID={"licenses-legal-header"}>
        {applicationName}
      </GlobalText>
      <GlobalText style={style.contentText}>{legalContent}</GlobalText>
      <ExternalLink
        url={healthAuthorityPrivacyPolicyUrl}
        label={t("label.privacy_policy")}
      />
      {authorityLinks?.map(({ url, label }) => {
        return <ExternalLink key={label} url={url} label={label} />
      })}
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
})

export default Legal
