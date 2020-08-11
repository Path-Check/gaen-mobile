import React, { FunctionComponent } from "react"
import {
  ViewStyle,
  View,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
} from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation"

import { getLocalNames } from "../locales/languages"
import { GlobalText } from "../components/GlobalText"
import { Screens, useStatusBarEffect } from "../navigation"

import { Icons } from "../assets"
import { Iconography, Colors, Spacing, Typography } from "../styles"

interface MenuScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

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
  <TouchableHighlight
    underlayColor={Colors.underlayPrimaryBackground}
    style={style.listItem}
    onPress={onPress}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <SvgXml
        xml={icon}
        accessible
        accessibilityLabel={iconLabel}
        style={[style.icon, { marginRight: Spacing.small }]}
      />
      <GlobalText style={{ ...Typography.mainContent }}>{label}</GlobalText>
    </View>
  </TouchableHighlight>
)

const MenuScreen: FunctionComponent<MenuScreenProps> = ({ navigation }) => {
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
    itemStyle?: ViewStyle
  }

  const SettingsListItem = ({
    label,
    onPress,
    description,
    itemStyle,
  }: SettingsListItemProps) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.underlayPrimaryBackground}
        style={[style.listItem, itemStyle]}
        onPress={onPress}
      >
        <View>
          <GlobalText style={style.listItemText}>{label}</GlobalText>
          {description ? (
            <GlobalText style={style.descriptionText}>{description}</GlobalText>
          ) : null}
        </View>
      </TouchableHighlight>
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
          onPress={() => navigation.navigate(Screens.About)}
          itemStyle={style.divider}
        />
        <SettingsListItem
          label={t("screen_titles.legal")}
          onPress={() => navigation.navigate(Screens.Licenses)}
          itemStyle={style.divider}
        />
        <SettingsListItem
          label={t("screen_titles.report_issue")}
          onPress={() => navigation.navigate(Screens.ReportIssueForm)}
          itemStyle={style.lastListItem}
        />
      </View>
      <View style={style.section}>
        <SettingsListItem
          label="EN Debug Menu"
          onPress={() => navigation.navigate(Screens.ENDebugMenu)}
          itemStyle={style.lastListItem}
        />
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground,
  },
  divider: {
    borderColor: Colors.tertiaryViolet,
    borderBottomWidth: 1,
  },
  section: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    marginBottom: Spacing.medium,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.tertiaryViolet,
  },
  icon: {
    maxWidth: Iconography.small,
    maxHeight: Iconography.small,
  },
  listItem: {
    flex: 1,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.medium,
  },
  listItemText: {
    ...Typography.tappableListItem,
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
  descriptionText: {
    ...Typography.description,
  },
})

export default MenuScreen
