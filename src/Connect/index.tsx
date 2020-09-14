import React, { FunctionComponent } from "react"
import { Platform, ScrollView, StyleSheet, View, Linking } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import {
  loadAuthorityCopy,
  authorityCopyTranslation,
} from "../configuration/authorityCopy"
import {
  loadAuthorityLinks,
  applyTranslations,
} from "../configuration/authorityLinks"
import {
  Stacks,
  ReportIssueScreens,
  ModalScreens,
  useStatusBarEffect,
} from "../navigation"
import { ListItem, StatusBar, GlobalText } from "../components"
import { useApplicationInfo } from "../hooks/useApplicationInfo"
import { useConfigurationContext } from "../ConfigurationContext"
import ExternalLink from "../Settings/ExternalLink"

import { Colors, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

const ConnectScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const navigation = useNavigation()
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

  const handleOnPressHowTheAppWorks = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalScreens.HowItWorksReviewFromConnect,
    })
  }

  const handleOnPressReportIssue = () => {
    navigation.navigate(ReportIssueScreens.ReportIssue)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary10} />
      <ScrollView style={style.container} alwaysBounceVertical={false}>
        <View style={style.topContainer}>
          <GlobalText style={style.headerText}>{applicationName}</GlobalText>
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
        </View>
        <View style={style.listItemContainer}>
          <ListItem
            label={t("screen_titles.how_the_app_works")}
            onPress={handleOnPressHowTheAppWorks}
            icon={Icons.RestartWithCheck}
          />
          <ListItem
            label={t("screen_titles.report_issue")}
            onPress={handleOnPressReportIssue}
            icon={Icons.QuestionMark}
          />
        </View>
        <View style={style.bottomContainer}>
          <View style={style.infoRowContainer}>
            <View style={style.infoRow}>
              <GlobalText style={style.infoRowLabel}>
                {t("connect.version")}
              </GlobalText>
              <GlobalText style={style.infoRowValue}>{versionInfo}</GlobalText>
            </View>
            <View style={style.infoRow}>
              <GlobalText style={style.infoRowLabel}>
                {t("connect.operating_system_abbr")}
              </GlobalText>
              <GlobalText style={style.infoRowValue}>{osInfo}</GlobalText>
            </View>
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
  },
  topContainer: {
    paddingHorizontal: Spacing.large,
  },
  headerText: {
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
  listItemContainer: {
    backgroundColor: Colors.primaryLightBackground,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.large,
  },
  infoRowContainer: {
    marginTop: Spacing.small,
    marginBottom: Spacing.medium,
  },
  infoRow: {
    flexDirection: "row",
  },
  infoRowLabel: {
    ...Typography.header5,
    color: Colors.primary150,
    width: 100,
    marginTop: Spacing.small,
  },
  infoRowValue: {
    ...Typography.body1,
    marginTop: Spacing.small,
  },
})

export default ConnectScreen
