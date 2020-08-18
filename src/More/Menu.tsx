import React, { FunctionComponent } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"

import { getLocalNames } from "../locales/languages"
import { GlobalText } from "../components/GlobalText"
import { Screens, MoreStackScreens, useStatusBarEffect } from "../navigation"

import { Icons } from "../assets"
import { Iconography, Colors, Spacing, Typography, Outlines } from "../styles"

interface LanguageSelectionListItemProps {
  icon: string
  iconLabel: string
  label: string
  onPress: () => void
}
const LanguageSelectionListItem = ({
  icon,
  iconLabel,
  label,
  onPress,
}: LanguageSelectionListItemProps) => (
  <TouchableOpacity style={style.listItem} onPress={onPress}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <SvgXml
        xml={icon}
        accessible
        accessibilityLabel={iconLabel}
        style={[style.icon, { marginRight: Spacing.small }]}
      />
      <GlobalText style={{ ...Typography.mainContent }}>{label}</GlobalText>
    </View>
  </TouchableOpacity>
)

const MenuScreen: FunctionComponent = () => {
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  useStatusBarEffect("light-content")

  interface SettingsListItemProps {
    label: string
    onPress: () => void
    description?: string
  }

  const SettingsListItem = ({
    label,
    onPress,
    description,
  }: SettingsListItemProps) => {
    return (
      <TouchableOpacity style={style.listItem} onPress={onPress}>
        <View>
          <GlobalText style={style.listItemText}>{label}</GlobalText>
          {description ? (
            <GlobalText style={style.descriptionText}>{description}</GlobalText>
          ) : null}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView style={style.container}>
      <View style={style.section}>
        <LanguageSelectionListItem
          label={languageName || t("label.unknown")}
          icon={Icons.LanguagesIcon}
          iconLabel={t("label.language_icon")}
          onPress={() => navigation.navigate(Screens.LanguageSelection)}
        />
      </View>

      <View style={style.section}>
        <SettingsListItem
          label={t("screen_titles.about")}
          onPress={() => navigation.navigate(MoreStackScreens.About)}
        />
        <SettingsListItem
          label={t("screen_titles.legal")}
          onPress={() => navigation.navigate(MoreStackScreens.Licenses)}
        />
      </View>
      <View style={style.section}>
        <SettingsListItem
          label="EN Debug Menu"
          onPress={() => navigation.navigate(MoreStackScreens.ENDebugMenu)}
        />
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  section: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
    marginBottom: Spacing.medium,
  },
  icon: {
    maxWidth: Iconography.small,
    maxHeight: Iconography.small,
  },
  listItem: {
    flex: 1,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.medium,
    borderBottomColor: Colors.secondary75,
    borderBottomWidth: Outlines.hairline,
  },
  listItemText: {
    ...Typography.tappableListItem,
  },
  descriptionText: {
    ...Typography.description,
  },
})

export default MenuScreen
