import React, { FunctionComponent } from "react"
import { Platform, ScrollView, StyleSheet, View, Linking } from "react-native"
import { useTranslation } from "react-i18next"

import {
  loadAuthorityCopy,
  authorityCopyTranslation,
} from "../configuration/authorityCopy"
import {
  loadAuthorityLinks,
  applyTranslations,
} from "../configuration/authorityLinks"
import { useStatusBarEffect } from "../navigation"
import { StatusBar, GlobalText } from "../components"
import { useApplicationInfo } from "../hooks/useApplicationInfo"
import { useConfigurationContext } from "../ConfigurationContext"
import ExternalLink from "../Settings/ExternalLink"

import { Colors, Spacing, Typography } from "../styles"

const ConnectScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const osInfo = `${Platform.OS} v${Platform.Version}`
  const { applicationName, versionInfo } = useApplicationInfo()
  const {
    healthAuthorityName,
    healthAuthorityAdviceUrl,
  } = useConfigurationContext()

  const aboutContent = authorityCopyTranslation(
    loadAuthorityCopy("about"),
    localeCode,
    t("connect.description", {
      applicationName,
      healthAuthorityName,
    }),
  )

  const authorityLinks = applyTranslations(
    loadAuthorityLinks("about"),
    localeCode,
  )

  const handleOnPressLink = () => {
    Linking.openURL(healthAuthorityAdviceUrl)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary10} />
      <ScrollView style={style.container} alwaysBounceVertical={false}>
        <View>
          <GlobalText style={style.headerContent}>{applicationName}</GlobalText>
        </View>
        <GlobalText style={style.aboutContent}>
          <>
            {aboutContent}
            <GlobalText
              onPress={handleOnPressLink}
              style={style.healthAuthorityLink}
            >
              {t("connect.ha_link", { healthAuthorityName })}
            </GlobalText>
          </>
        </GlobalText>
        {authorityLinks?.map(({ url, label }) => {
          return <ExternalLink key={label} url={url} label={label} />
        })}
        <View style={style.infoRowContainer}>
          <View style={style.infoRow}>
            <GlobalText style={style.aboutSectionParaLabel}>
              {t("connect.version")}
            </GlobalText>
            <GlobalText style={style.aboutSectionParaContent}>
              {versionInfo}
            </GlobalText>
          </View>
          <View style={style.infoRow}>
            <GlobalText style={style.aboutSectionParaLabel}>
              {t("connect.operating_system_abbr")}
            </GlobalText>
            <GlobalText style={style.aboutSectionParaContent}>
              {osInfo}
            </GlobalText>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary10,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
  headerContent: {
    ...Typography.header2,
    marginBottom: Spacing.small,
  },
  aboutContent: {
    ...Typography.body1,
    fontSize: Typography.large,
    marginBottom: Spacing.medium,
  },
  healthAuthorityLink: {
    ...Typography.anchorLink,
    fontSize: Typography.large,
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

export default ConnectScreen
