import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { Platform, ScrollView, StyleSheet, View } from "react-native"

import { GlobalText } from "../components"
import { Colors, Spacing, Typography } from "../styles"
import { useApplicationInfo } from "../hooks/useApplicationInfo"
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

export const AboutScreen: FunctionComponent = () => {
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const osInfo = `${Platform.OS} v${Platform.Version}`
  const { applicationName, versionInfo } = useApplicationInfo()
  const { healthAuthorityName } = useConfigurationContext()

  const aboutContent = authorityCopyTranslation(
    loadAuthorityCopy("about"),
    localeCode,
    t("about.description", { applicationName, healthAuthorityName }),
  )

  const authorityLinks = applyTranslations(
    loadAuthorityLinks("about"),
    localeCode,
  )

  return (
    <ScrollView style={style.container} alwaysBounceVertical={false}>
      <View>
        <GlobalText style={style.headerContent}>{applicationName}</GlobalText>
      </View>
      <GlobalText style={style.aboutContent}>{aboutContent}</GlobalText>
      {authorityLinks?.map(({ url, label }) => {
        return <ExternalLink key={label} url={url} label={label} />
      })}
      <View style={style.infoRowContainer}>
        <View style={style.infoRow}>
          <GlobalText style={style.aboutSectionParaLabel}>
            {t("about.version")}
          </GlobalText>
          <GlobalText style={style.aboutSectionParaContent}>
            {versionInfo}
          </GlobalText>
        </View>
        <View style={style.infoRow}>
          <GlobalText style={style.aboutSectionParaLabel}>
            {t("about.operating_system_abbr")}
          </GlobalText>
          <GlobalText style={style.aboutSectionParaContent}>
            {osInfo}
          </GlobalText>
        </View>
      </View>
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
  aboutContent: {
    ...Typography.body1,
    marginBottom: Spacing.medium,
  },
  aboutSectionParaLabel: {
    ...Typography.header5,
    color: Colors.primary150,
    width: 100,
    marginTop: Spacing.small,
  },
  aboutSectionParaContent: {
    ...Typography.body1,
    marginTop: Spacing.small,
  },
  infoRowContainer: {
    marginTop: Spacing.small,
    marginBottom: Spacing.medium,
  },
  infoRow: {
    flexDirection: "row",
  },
})

export default AboutScreen
