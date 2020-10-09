import React, { FunctionComponent } from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import { getLocalNames } from "../locales/languages"
import {
  useStatusBarEffect,
  ModalStackScreens,
  SettingsStackScreens,
} from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"
import { ListItem, ListItemSeparator } from "../components"

import { Icons } from "../assets"
import { Colors, Spacing } from "../styles"
import ShareAnonymizedDataListItem from "./ShareAnonymizedDataListItem"

type SettingsListItem = {
  label: string
  onPress: () => void
  icon: string
}

const Settings: FunctionComponent = () => {
  useStatusBarEffect("light-content", Colors.headerBackground)
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  const showDebugMenu = env.STAGING === "true" || __DEV__
  const { healthAuthoritySupportsAnalytics } = useConfigurationContext()

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(ModalStackScreens.LanguageSelection)
  }

  const handleOnPressHowTheAppWorks = () => {
    navigation.navigate(ModalStackScreens.HowItWorksReviewFromSettings)
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
  const debugMenu: SettingsListItem = {
    label: "EN Debug Menu",
    onPress: () => navigation.navigate(SettingsStackScreens.ENDebugMenu),
    icon: Icons.Document,
  }

  const middleListItems: SettingsListItem[] = [legal, howTheAppWorks]

  return (
    <ScrollView style={style.container}>
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
      {showDebugMenu && (
        <View style={style.section}>
          <ListItem
            label={debugMenu.label}
            onPress={debugMenu.onPress}
            icon={debugMenu.icon}
          />
        </View>
      )}
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary10,
    paddingTop: Spacing.xxLarge,
  },
  section: {
    backgroundColor: Colors.primaryLightBackground,
    marginBottom: Spacing.xxLarge,
  },
})

export default Settings
