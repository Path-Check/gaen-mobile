import React, { FunctionComponent } from "react"
import { Platform, ScrollView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import ShareAnonymizedDataListItem from "./ShareAnonymizedDataListItem"
import { enabledLocales, useLocaleInfo } from "../locales/languages"
import {
  useStatusBarEffect,
  ModalStackScreens,
  SettingsStackScreens,
  HowItWorksStackScreens,
} from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"
import { Text, ListItem, ListItemSeparator, StatusBar } from "../components"
import { useApplicationInfo } from "../Device/useApplicationInfo"
import ExternalLink from "../Settings/ExternalLink"
import { useCustomCopy } from "../configuration/useCustomCopy"
import {
  loadAuthorityLinks,
  applyTranslations,
} from "../configuration/authorityLinks"

import { Icons } from "../assets"
import { Colors, Spacing, Typography } from "../styles"

type SettingsListItem = {
  label: string
  accessibilityLabel: string
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
  const { enableProductAnalytics } = useConfigurationContext()
  const { healthAuthorityName, about: customAboutCopy } = useCustomCopy()

  const { languageName } = useLocaleInfo()
  const showDebugMenu = env.DISPLAY_DEBUG_MENU === "true" || __DEV__

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
    accessibilityLabel: t("common.select_language"),
    onPress: handleOnPressSelectLanguage,
    icon: Icons.LanguagesIcon,
  }
  const legal: SettingsListItem = {
    label: t("screen_titles.legal"),
    accessibilityLabel: t("screen_titles.legal"),
    onPress: () => navigation.navigate(SettingsStackScreens.Legal),
    icon: Icons.Document,
  }
  const howTheAppWorks: SettingsListItem = {
    label: t("screen_titles.how_the_app_works"),
    accessibilityLabel: t("screen_titles.how_the_app_works"),
    onPress: handleOnPressHowTheAppWorks,
    icon: Icons.RestartWithCheck,
  }
  const deleteMyData: SettingsListItem = {
    label: t("settings.delete_my_data"),
    accessibilityLabel: t("settings.delete_my_data"),
    onPress: handleOnPressDeleteMyData,
    icon: Icons.Trash,
  }
  const debugMenu: SettingsListItem = {
    label: "EN Debug Menu",
    accessibilityLabel: "EN Debug Menu",
    onPress: () => navigation.navigate(SettingsStackScreens.ENDebugMenu),
    icon: Icons.Document,
  }

  const middleListItems: SettingsListItem[] = [legal, howTheAppWorks]

  const authorityLinks = applyTranslations(
    loadAuthorityLinks("about"),
    localeCode,
  )

  const aboutContent =
    customAboutCopy ||
    t("about.description", {
      applicationName,
      healthAuthorityName,
    })

  const osInfo = `${Platform.OS} v${Platform.Version}`

  const showLanguagePicker = enabledLocales().length > 1

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary.shade10} />
      <ScrollView style={style.container} alwaysBounceVertical={false}>
        <Text style={style.headerText}>{t("screen_titles.settings")}</Text>
        {showLanguagePicker && (
          <View style={style.section} testID={"settings-language-picker"}>
            <ListItem
              label={selectLanguage.label}
              accessibilityLabel={selectLanguage.accessibilityLabel}
              onPress={selectLanguage.onPress}
              icon={selectLanguage.icon}
            />
          </View>
        )}
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
            accessibilityLabel={deleteMyData.label}
            onPress={deleteMyData.onPress}
            icon={deleteMyData.icon}
          />
          {enableProductAnalytics && (
            <>
              <ListItemSeparator />
              <ShareAnonymizedDataListItem />
            </>
          )}
        </View>
        {showDebugMenu && (
          <View style={style.section}>
            <ListItem
              label={debugMenu.label}
              accessibilityLabel={debugMenu.label}
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
  headerText: {
    ...Typography.header.x60,
    ...Typography.style.bold,
    marginVertical: Spacing.medium,
    marginHorizontal: Spacing.medium,
  },
  section: {
    backgroundColor: Colors.background.primaryLight,
    marginBottom: Spacing.xxLarge,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.medium,
  },
  aboutContent: {
    ...Typography.body.x30,
    fontSize: Typography.size.x50,
  },
  infoRowContainer: {
    marginTop: Spacing.small,
    marginBottom: Spacing.medium,
  },
  infoRow: {
    flexDirection: "row",
  },
  infoRowLabel: {
    ...Typography.header.x20,
    color: Colors.primary.shade150,
    width: 100,
    marginTop: Spacing.small,
  },
  infoRowValue: {
    ...Typography.body.x30,
    marginTop: Spacing.small,
  },
})

export default Settings
