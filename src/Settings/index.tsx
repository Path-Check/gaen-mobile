import React, { FunctionComponent } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import { getLocalNames } from "../locales/languages"
import { GlobalText } from "../components"
import { Stacks, ModalScreens, SettingsScreens } from "../navigation"
import { useStatusBarEffect } from "../navigation/index"

import { Icons } from "../assets"
import { Iconography, Colors, Spacing, Typography, Outlines } from "../styles"
import { useConfigurationContext } from "../ConfigurationContext"

const Settings: FunctionComponent = () => {
  useStatusBarEffect("light-content", Colors.headerBackground)
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  const { displayCallbackForm } = useConfigurationContext()
  const showDebugMenu = env.STAGING === "true" || __DEV__

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalScreens.LanguageSelection,
    })
  }

  return (
    <ScrollView style={style.container}>
      <View style={style.section}>
        <TouchableOpacity
          onPress={handleOnPressSelectLanguage}
          accessible
          accessibilityLabel={t("more.select_language")}
        >
          <View style={[style.listItem, style.languageButtonContainer]}>
            <SvgXml
              xml={Icons.LanguagesIcon}
              width={Iconography.small}
              height={Iconography.small}
              style={style.icon}
              accessible
              accessibilityLabel={t("label.language_icon")}
            />
            <GlobalText style={style.languageButtonText}>
              {languageName}
            </GlobalText>
          </View>
        </TouchableOpacity>
      </View>
      <View style={style.section}>
        <SettingsListItem
          label={t("screen_titles.about")}
          onPress={() => navigation.navigate(SettingsScreens.About)}
        />
        <SettingsListItem
          label={t("screen_titles.legal")}
          onPress={() => navigation.navigate(SettingsScreens.Legal)}
        />
        {displayCallbackForm && (
          <SettingsListItem
            label={t("screen_titles.callback_form")}
            onPress={() => navigation.navigate(SettingsScreens.CallbackForm)}
            lastItem
          />
        )}
        <SettingsListItem
          label={t("screen_titles.report_issue")}
          onPress={() => navigation.navigate(SettingsScreens.ReportIssue)}
          lastItem
        />
      </View>
      {showDebugMenu && (
        <View style={style.section}>
          <SettingsListItem
            label="EN Debug Menu"
            onPress={() => navigation.navigate(SettingsScreens.ENDebugMenu)}
            lastItem
          />
        </View>
      )}
    </ScrollView>
  )
}

interface SettingsListItemProps {
  label: string
  onPress: () => void
  lastItem?: boolean
}

const SettingsListItem = ({
  label,
  onPress,
  lastItem,
}: SettingsListItemProps) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View style={style.listItem}>
          <GlobalText style={style.listItemText}>{label}</GlobalText>
        </View>
      </TouchableOpacity>
      {!lastItem && <View style={style.divider} />}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary10,
    paddingTop: Spacing.xxLarge,
  },
  section: {
    backgroundColor: Colors.primaryLightBackground,
    marginBottom: Spacing.xxLarge,
  },
  languageButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageButtonText: {
    ...Typography.tappableListItem,
  },
  icon: {
    marginRight: Spacing.small,
  },
  listItem: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.large,
  },
  listItemText: {
    ...Typography.tappableListItem,
  },
  divider: {
    height: Outlines.hairline,
    backgroundColor: Colors.neutral10,
    marginHorizontal: Spacing.medium,
  },
})

export default Settings
