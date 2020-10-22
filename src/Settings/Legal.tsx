import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { useApplicationName } from "../hooks/useApplicationInfo"
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
import { Text } from "../components"
import { useStatusBarEffect } from "../navigation"

import { Colors, Spacing, Typography } from "../styles"

const Legal: FunctionComponent = () => {
  useStatusBarEffect("light-content", Colors.header.background)
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const { applicationName } = useApplicationName()
  const {
    healthAuthorityName,
    healthAuthorityLegalPrivacyPolicyUrl,
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
      <Text style={style.headerContent} testID={"licenses-legal-header"}>
        {applicationName}
      </Text>
      <Text style={style.contentText}>{legalContent}</Text>
      {healthAuthorityLegalPrivacyPolicyUrl && (
        <ExternalLink
          url={healthAuthorityLegalPrivacyPolicyUrl}
          label={t("label.privacy_policy")}
        />
      )}
      {authorityLinks?.map(({ url, label }) => {
        return <ExternalLink key={label} url={url} label={label} />
      })}
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
  headerContent: {
    ...Typography.header2,
    marginBottom: Spacing.small,
    color: Colors.primary.shade150,
  },
  contentText: {
    ...Typography.body1,
    marginBottom: Spacing.medium,
  },
})

export default Legal
