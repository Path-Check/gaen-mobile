import React, { FunctionComponent } from "react"
import { Platform, ScrollView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import { getLocalNames } from "../locales/languages"
import {
  useStatusBarEffect,
  ModalStackScreens,
  SettingsStackScreens,
  HowItWorksStackScreens,
} from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"
import { Text, ListItem, ListItemSeparator, StatusBar } from "../components"
import { useApplicationInfo } from "../hooks/useApplicationInfo"
import {
  loadAuthorityCopy,
  authorityCopyTranslation,
} from "../configuration/authorityCopy"
import ExternalLink from "../Settings/ExternalLink"
import {
  loadAuthorityLinks,
  applyTranslations,
} from "../configuration/authorityLinks"

import { Icons } from "../assets"
import { Colors, Spacing, Typography } from "../styles"
import ShareAnonymizedDataListItem from "./ShareAnonymizedDataListItem"

type SettingsListItem = {
  label: string
  onPress: () => void
  icon: string
}

const Settings: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const navigation = useNavigation()
  const { applicationName, versionInfo } = useApplicationInfo()
  const {
    healthAuthorityName,
    healthAuthoritySupportsAnalytics,
  } = useConfigurationContext()

  const languageName = getLocalNames()[localeCode]
  const showDebugMenu = env.STAGING === "true" || __DEV__

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(ModalStackScreens.LanguageSelection)
  }

  const handleOnPressHowTheAppWorks = () => {
    navigation.navigate(ModalStackScreens.HowItWorksReviewFromSettings, {
      screen: HowItWorksStackScreens.Introduction,
    })
  }

  const handleOnPressDeleteMyData = () => {
    navigation.navigate(SettingsStackScreens.DeleteConfirmation)
  }

  const selectLanguage: SettingsListItem = {
    label: languageName,
    onPress: handleOnPressSelectLanguage,
    icon: Icons.LanguagesIcon,
  }
  const legal: SettingsListItem = {
    label: t("screen_titles.legal"),
    onPress: () => navigation.navigate(SettingsStackScreens.Legal),
    icon: Icons.Document,
  }
  const howTheAppWorks: SettingsListItem = {
    label: t("screen_titles.how_the_app_works"),
    onPress: handleOnPressHowTheAppWorks,
    icon: Icons.RestartWithCheck,
  }
  const deleteMyData: SettingsListItem = {
    label: t("settings.delete_my_data"),
    onPress: handleOnPressDeleteMyData,
    icon: Icons.Trash,
  }
  const debugMenu: SettingsListItem = {
    label: "EN Debug Menu",
    onPress: () => navigation.navigate(SettingsStackScreens.ENDebugMenu),
    icon: Icons.Document,
  }

  const middleListItems: SettingsListItem[] = [legal, howTheAppWorks]

  const authorityLinks = applyTranslations(
    loadAuthorityLinks("about"),
    localeCode,
  )
  const aboutContent = authorityCopyTranslation(
    loadAuthorityCopy("about"),
    localeCode,
    t("about.description", {
      applicationName,
      healthAuthorityName,
    }),
  )
  const osInfo = `${Platform.OS} v${Platform.Version}`

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary.shade10} />
      <ScrollView style={style.container} alwaysBounceVertical={false}>
        <View style={style.section}>
          <ListItem
            label={selectLanguage.label}
            onPress={selectLanguage.onPress}
            icon={selectLanguage.icon}
          />
          {healthAuthoritySupportsAnalytics && (
            <>
              <ListItemSeparator />
              <ShareAnonymizedDataListItem />
            </>
          )}
        </View>
        <View style={style.section}>
          {middleListItems.map((params, idx) => {
            const isLastItem = idx === middleListItems.length - 1
            return (
              <View key={params.label}>
                <ListItem {...params} />
                {!isLastItem && <ListItemSeparator />}
              </View>
            )
          })}
        </View>
        <View style={style.section}>
          <ListItem
            label={deleteMyData.label}
            onPress={deleteMyData.onPress}
            icon={deleteMyData.icon}
          />
        </View>
        {showDebugMenu && (
          <View style={style.section}>
            <ListItem
              label={debugMenu.label}
              onPress={debugMenu.onPress}
              icon={debugMenu.icon}
            />
          </View>
        )}
        <View style={style.bottomContainer}>
          <Text style={style.aboutContent}>{aboutContent}</Text>
          {authorityLinks?.map(({ url, label }) => {
            return <ExternalLink key={label} url={url} label={label} />
          })}
          <View style={style.infoRowContainer}>
            <View style={style.infoRow}>
              <Text style={style.infoRowLabel}>{t("about.version")}</Text>
              <Text style={style.infoRowValue}>{versionInfo}</Text>
            </View>
            <View style={style.infoRow}>
              <Text style={style.infoRowLabel}>
                {t("about.operating_system_abbr")}
              </Text>
              <Text style={style.infoRowValue}>{osInfo}</Text>
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
    backgroundColor: Colors.secondary.shade10,
  },
  section: {
    backgroundColor: Colors.background.primaryLight,
    marginBottom: Spacing.xxLarge,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.medium,
  },
  aboutContent: {
    ...Typography.body1,
    fontSize: Typography.large,
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
    color: Colors.primary.shade150,
    width: 100,
    marginTop: Spacing.small,
  },
  infoRowValue: {
    ...Typography.body1,
    marginTop: Spacing.small,
  },
})

export default Settings
