import React, { FunctionComponent } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import { getLocalNames } from "../locales/languages"
import { GlobalText } from "../components/GlobalText"
import { Screens, MoreStackScreens, useStatusBarEffect } from "../navigation"

import { Icons } from "../assets"
import { Iconography, Colors, Spacing, Typography, Outlines } from "../styles"

const MenuScreen: FunctionComponent = () => {
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  useStatusBarEffect("light-content")
  const showDebugMenu = env.STAGING === "true" || __DEV__

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(Screens.LanguageSelection)
  }

  return (
    <ScrollView style={style.container}>
      <View style={[style.section, style.firstSection]}>
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
          onPress={() => navigation.navigate(MoreStackScreens.About)}
        />
        <SettingsListItem
          label={t("screen_titles.legal")}
          onPress={() => navigation.navigate(MoreStackScreens.Legal)}
          lastItem
        />
      </View>
      {showDebugMenu ? (
        <View style={style.section}>
          <SettingsListItem
            label="EN Debug Menu"
            onPress={() => navigation.navigate(MoreStackScreens.ENDebugMenu)}
            lastItem
          />
        </View>
      ) : null}
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
  },
  section: {
    backgroundColor: Colors.primaryLightBackground,
    marginBottom: Spacing.medium,
    borderBottomColor: Colors.secondary50,
    borderBottomWidth: Outlines.hairline,
    borderTopColor: Colors.secondary50,
    borderTopWidth: Outlines.hairline,
  },
  firstSection: {
    borderTopWidth: 0,
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
    paddingVertical: Spacing.medium,
    borderBottomWidth: 0,
  },
  listItemText: {
    ...Typography.tappableListItem,
  },
  divider: {
    height: Outlines.hairline,
    backgroundColor: Colors.secondary50,
    marginHorizontal: Spacing.medium,
  },
})

export default MenuScreen
