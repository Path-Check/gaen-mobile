import React, { FunctionComponent } from "react"
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import { getLocalNames } from "../locales/languages"
import { GlobalText } from "../components"
import {
  useStatusBarEffect,
  Stacks,
  ModalScreens,
  SettingsScreens,
} from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"

import { Icons } from "../assets"
import { Iconography, Colors, Spacing, Typography, Outlines } from "../styles"

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

  type SettingsListItem = {
    label: string
    onPress: () => void
  }

  const About: SettingsListItem = {
    label: t("screen_titles.about"),
    onPress: () => navigation.navigate(SettingsScreens.About),
  }
  const Legal: SettingsListItem = {
    label: t("screen_titles.legal"),
    onPress: () => navigation.navigate(SettingsScreens.Legal),
  }
  const CallbackForm: SettingsListItem = {
    label: t("screen_titles.callback_form"),
    onPress: () => navigation.navigate(SettingsScreens.CallbackForm),
  }
  const ReportAnIssue: SettingsListItem = {
    label: t("screen_titles.report_issue"),
    onPress: () => navigation.navigate(SettingsScreens.ReportIssue),
  }

  const baseListItems: SettingsListItem[] = [About, Legal]

  const settingsListItems: (SettingsListItem | undefined)[] = [
    ...baseListItems,
    displayCallbackForm ? CallbackForm : undefined,
    displayReportAnIssue ? ReportAnIssue : undefined,
  ]

  const settingsListItemsToDisplay: SettingsListItem[] = settingsListItems.filter(
    (el): el is SettingsListItem => typeof el !== "undefined",
  )

  interface ListItemProps {
    label: string
    onPress: () => void
  }

  const ListItem = ({ label, onPress }: ListItemProps) => {
    return (
      <View>
        <TouchableOpacity onPress={onPress}>
          <View style={style.listItem}>
            <GlobalText style={style.listItemText}>{label}</GlobalText>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const ItemSeparator = () => {
    return <View style={style.divider} />
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
        {settingsListItemsToDisplay.map(({ label, onPress }, idx) => {
          const isLastItem = idx === settingsListItemsToDisplay.length - 1
          return (
            <>
              <View key={label}>
                <ListItem label={label} onPress={onPress} />
              </View>
              {!isLastItem && <ItemSeparator />}
            </>
          )
        })}
      </View>
      {showDebugMenu && (
        <View style={style.section}>
          <ListItem
            label="EN Debug Menu"
            onPress={() => navigation.navigate(SettingsScreens.ENDebugMenu)}
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
