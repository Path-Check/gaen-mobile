import React, { FunctionComponent } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native"
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

  const renderItem = ({ item }: { item: ListItemProps }) => {
    return (
      <View style={style.flatListItemContainer}>
        <ListItem label={item.label} onPress={item.onPress} />
      </View>
    )
  }

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

  const ListHeaderComponent = () => {
    return (
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
    )
  }

  const ListFooterComponent = () => {
    if (!showDebugMenu) {
      return null
    }
    return (
      <View style={style.section}>
        <ListItem
          label="EN Debug Menu"
          onPress={() => navigation.navigate(SettingsScreens.ENDebugMenu)}
        />
      </View>
    )
  }

  const ItemSeparatorComponent = () => {
    return <View style={style.divider} />
  }

  return (
    <View style={style.container}>
      <FlatList
        data={settingsListItemsToDisplay}
        renderItem={renderItem}
        keyExtractor={(item) => item.label}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary10,
  },
  section: {
    backgroundColor: Colors.primaryLightBackground,
    marginVertical: Spacing.xxLarge,
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
  flatListItemContainer: {
    backgroundColor: Colors.primaryLightBackground,
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
