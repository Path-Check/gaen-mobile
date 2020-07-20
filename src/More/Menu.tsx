import React, { FunctionComponent } from "react"
import {
  ViewStyle,
  View,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation"

import { getLocalNames } from "../locales/languages"
import { RTLEnabledText } from "../components/RTLEnabledText"
import { Stacks, Screens, useStatusBarEffect } from "../navigation"

import { Icons } from "../assets"
import { Buttons, Colors, Spacing, Typography } from "../styles"

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
    style={styles.listItem}
    onPress={onPress}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <SvgXml
        xml={icon}
        accessible
        accessibilityLabel={iconLabel}
        style={[styles.icon, { marginRight: Spacing.small }]}
      />
      <RTLEnabledText style={{ ...Typography.mainContent }}>
        {label}
      </RTLEnabledText>
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
    style?: ViewStyle
  }

  const SettingsListItem = ({
    label,
    onPress,
    description,
    style,
  }: SettingsListItemProps) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.underlayPrimaryBackground}
        style={[styles.listItem, style]}
        onPress={onPress}
      >
        <View>
          <RTLEnabledText style={styles.listItemText}>{label}</RTLEnabledText>
          {description ? (
            <RTLEnabledText style={styles.descriptionText}>
              {description}
            </RTLEnabledText>
          ) : null}
        </View>
      </TouchableHighlight>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionPrimary}>
        <RTLEnabledText>
          {t("settings.share_test_result_description")}
        </RTLEnabledText>
        <TouchableOpacity
          onPress={() => navigation.navigate(Stacks.AffectedUserStack)}
          style={styles.button}
        >
          <RTLEnabledText style={styles.buttonText}>
            {t("settings.share_test_result")}
          </RTLEnabledText>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <LanguageSelectionListItem
          label={languageName || t("label.unknown")}
          icon={Icons.LanguagesIcon}
          iconLabel={t("label.language_icon")}
          onPress={() => navigation.navigate(Screens.LanguageSelection)}
        />
      </View>

      <View style={styles.section}>
        <SettingsListItem
          label={t("screen_titles.about")}
          onPress={() => navigation.navigate(Screens.About)}
          style={styles.divider}
        />
        <SettingsListItem
          label={t("screen_titles.legal")}
          onPress={() => navigation.navigate(Screens.Licenses)}
          style={styles.lastListItem}
        />
      </View>
      <View style={styles.section}>
        <SettingsListItem
          label="EN Debug Menu"
          onPress={() => navigation.navigate(Screens.ENDebugMenu)}
          style={styles.lastListItem}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground,
  },
  divider: {
    borderColor: Colors.tertiaryViolet,
    borderBottomWidth: 1,
  },
  section: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: Spacing.medium,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.tertiaryViolet,
  },
  sectionPrimary: {
    flex: 1,
    margin: Spacing.medium,
  },
  button: {
    ...Buttons.largeSecondaryBlue,
    marginTop: Spacing.medium,
  },
  buttonText: {
    ...Typography.buttonTextLight,
  },
  icon: {
    maxWidth: Spacing.icon,
    maxHeight: Spacing.icon,
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
