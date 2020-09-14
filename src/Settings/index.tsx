import React, { FunctionComponent } from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import { getLocalNames } from "../locales/languages"
import {
  useStatusBarEffect,
  Stacks,
  ModalScreens,
  SettingsScreens,
} from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"
import { ListItem } from "../components"

import { Icons } from "../assets"
import { Colors, Spacing, Outlines } from "../styles"

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
  const {
    displayCallbackForm,
    displayReportAnIssue,
  } = useConfigurationContext()
  const showDebugMenu = env.STAGING === "true" || __DEV__

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalScreens.LanguageSelection,
    })
  }

  const handleOnPressHowTheAppWorks = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalScreens.HowItWorksReviewFromSettings,
    })
  }

  const selectLanguage: SettingsListItem = {
    label: languageName,
    onPress: handleOnPressSelectLanguage,
    icon: Icons.LanguagesIcon,
  }
  const legal: SettingsListItem = {
    label: t("screen_titles.legal"),
    onPress: () => navigation.navigate(SettingsScreens.Legal),
    icon: Icons.Document,
  }
  const callbackForm: SettingsListItem = {
    label: t("screen_titles.callback_form"),
    onPress: () => navigation.navigate(SettingsScreens.CallbackForm),
    icon: Icons.Document,
  }
  const reportAnIssue: SettingsListItem = {
    label: t("screen_titles.report_issue"),
    onPress: () => navigation.navigate(SettingsScreens.ReportIssue),
    icon: Icons.QuestionMark,
  }
  const howTheAppWorks: SettingsListItem = {
    label: t("screen_titles.how_the_app_works"),
    onPress: handleOnPressHowTheAppWorks,
    icon: Icons.RestartWithCheck,
  }
  const debugMenu: SettingsListItem = {
    label: "EN Debug Menu",
    onPress: () => navigation.navigate(SettingsScreens.ENDebugMenu),
    icon: Icons.Document,
  }

  const middleListItems: SettingsListItem[] = [legal, howTheAppWorks]
  if (displayCallbackForm) {
    middleListItems.push(callbackForm)
  }
  if (displayReportAnIssue) {
    middleListItems.push(reportAnIssue)
  }

  const ItemSeparator = () => {
    return <View style={style.divider} />
  }

  return (
    <ScrollView style={style.container}>
      <View style={style.section}>
        <ListItem
          label={selectLanguage.label}
          onPress={selectLanguage.onPress}
          icon={selectLanguage.icon}
        />
      </View>
      <View style={style.section}>
        {middleListItems.map(({ label, onPress, icon }, idx) => {
          const isLastItem = idx === middleListItems.length - 1
          return (
            <View key={label}>
              <ListItem icon={icon} label={label} onPress={onPress} />
              {!isLastItem && <ItemSeparator />}
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
  divider: {
    ...Outlines.dividerLine,
  },
})

export default Settings
