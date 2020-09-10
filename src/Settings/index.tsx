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
  Screens,
} from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"

import { Icons } from "../assets"
import { Iconography, Colors, Spacing, Typography, Outlines } from "../styles"
import { useOnboardingContext } from "../OnboardingContext"

type SettingsListItem = {
  label: string
  onPress: () => void
  icon: string
}

const Settings: FunctionComponent = () => {
  useStatusBarEffect("light-content", Colors.headerBackground)
  const navigation = useNavigation()
  const { updateDestinationAfterComplete } = useOnboardingContext()
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
    updateDestinationAfterComplete(Stacks.Settings)
    navigation.navigate(Stacks.Modal, { screen: ModalScreens.OnboardingReview })
  }

  const About: SettingsListItem = {
    label: t("screen_titles.about"),
    onPress: () => navigation.navigate(SettingsScreens.About),
    icon: Icons.Document,
  }
  const Legal: SettingsListItem = {
    label: t("screen_titles.legal"),
    onPress: () => navigation.navigate(SettingsScreens.Legal),
    icon: Icons.Document,
  }
  const CallbackForm: SettingsListItem = {
    label: t("screen_titles.callback_form"),
    onPress: () => navigation.navigate(SettingsScreens.CallbackForm),
    icon: Icons.Document,
  }
  const ReportAnIssue: SettingsListItem = {
    label: t("screen_titles.report_issue"),
    onPress: () => navigation.navigate(SettingsScreens.ReportIssue),
    icon: Icons.QuestionMark,
  }
  const HowTheAppWorks: SettingsListItem = {
    label: t("screen_titles.how_the_app_works"),
    onPress: handleOnPressHowTheAppWorks,
    icon: Icons.RestartWithCheck,
  }

  const listItems: SettingsListItem[] = [About, Legal, HowTheAppWorks]
  if (displayCallbackForm) {
    listItems.push(CallbackForm)
  }
  if (displayReportAnIssue) {
    listItems.push(ReportAnIssue)
  }

  const ListItem: FunctionComponent<SettingsListItem> = ({
    label,
    onPress,
    icon,
  }) => {
    return (
      <TouchableOpacity onPress={onPress} accessible accessibilityLabel={label}>
        <View style={[style.listItem, style.languageButtonContainer]}>
          <SvgXml
            fill={Colors.primary100}
            xml={icon}
            width={Iconography.small}
            height={Iconography.small}
            style={style.icon}
            accessible
            accessibilityLabel={label}
          />
          <GlobalText style={style.languageButtonText}>{label}</GlobalText>
        </View>
      </TouchableOpacity>
    )
  }

  const ItemSeparator = () => {
    return <View style={style.divider} />
  }

  return (
    <ScrollView style={style.container}>
      <View style={style.section}>
        <ListItem
          label={languageName}
          onPress={handleOnPressSelectLanguage}
          icon={Icons.LanguagesIcon}
        />
      </View>
      <View style={style.section}>
        {listItems.map(({ label, onPress, icon }, idx) => {
          const isLastItem = idx === listItems.length - 1
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
            icon={Icons.Document}
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
  divider: {
    height: Outlines.hairline,
    backgroundColor: Colors.neutral10,
    marginHorizontal: Spacing.medium,
  },
})

export default Settings
