import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { useApplicationName } from "../hooks/useApplicationInfo"
import { GlobalText } from "../components"
import { Colors, Spacing, Typography } from "../styles"
import { useConfigurationContext } from "../ConfigurationContext"
import ExternalLink from "./ExternalLink"
import {
  loadAuthorityCopy,
  authorityCopyTranslation,
} from "../configuration/authorityCopy"
import {
  loadAuthorityLinks,
  applyTranslations,
} from "../configuration/authorityLinks"

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

  const legalContent = authorityCopyTranslation(
    loadAuthorityCopy("legal"),
    localeCode,
    healthAuthorityName,
  )

  const authorityLinks = applyTranslations(
    loadAuthorityLinks("legal"),
    localeCode,
  )

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
