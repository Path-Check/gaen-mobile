import React, { FunctionComponent } from "react"
import { Linking, Platform, ScrollView, StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import {
  loadAuthorityCopy,
  authorityCopyTranslation,
} from "../configuration/authorityCopy"
import {
  loadAuthorityLinks,
  applyTranslations,
} from "../configuration/authorityLinks"
import { Stacks, ModalStackScreens, useStatusBarEffect } from "../navigation"
import { ListItem, ListItemSeparator, StatusBar, Text } from "../components"
import { useApplicationInfo } from "../hooks/useApplicationInfo"
import { useConfigurationContext } from "../ConfigurationContext"
import ExternalLink from "../Settings/ExternalLink"

import { Colors, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

type ConnectListItem = {
  label: string
  onPress: () => void
  icon: string
}

const ConnectScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const osInfo = `${Platform.OS} v${Platform.Version}`
  const { applicationName, versionInfo } = useApplicationInfo()
  const {
    healthAuthorityName,
    displayCallbackForm,
    emergencyPhoneNumber,
  } = useConfigurationContext()

  const aboutContent = authorityCopyTranslation(
    loadAuthorityCopy("about"),
    localeCode,
    t("about.description", {
      applicationName,
      healthAuthorityName,
    }),
  )

  const authorityLinks = applyTranslations(
    loadAuthorityLinks("about"),
    localeCode,
  )

  const handleOnPressHowTheAppWorks = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalStackScreens.HowItWorksReviewFromConnect,
    })
  }

  const listItems: ConnectListItem[] = []

  if (emergencyPhoneNumber) {
    const handleOnPressEmergencyContact = () => {
      Linking.openURL(`tel:${emergencyPhoneNumber}`)
    }

    const emergencyContact: ConnectListItem = {
      label: t("about.emergency_contact"),
      onPress: handleOnPressEmergencyContact,
      icon: Icons.ChatBubble,
    }
    listItems.push(emergencyContact)
  }

  const howTheAppWorks: ConnectListItem = {
    label: t("screen_titles.how_the_app_works"),
    onPress: handleOnPressHowTheAppWorks,
    icon: Icons.RestartWithCheck,
  }

  listItems.push(howTheAppWorks)

  if (displayCallbackForm) {
    const callbackForm: ConnectListItem = {
      label: t("screen_titles.callback"),
      onPress: () => navigation.navigate(ModalStackScreens.CallbackStack),
      icon: Icons.Headset,
    }
    listItems.push(callbackForm)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary10} />
      <ScrollView style={style.container} alwaysBounceVertical={false}>
        <View style={style.topContainer}>
          <Text style={style.headerText}>{applicationName}</Text>
          <Text style={style.aboutContent}>{aboutContent}</Text>
          {authorityLinks?.map(({ url, label }) => {
            return <ExternalLink key={label} url={url} label={label} />
          })}
        </View>
        <View style={style.listItemContainer}>
          {listItems.map((params, idx) => {
            const isLastItem = idx === listItems.length - 1
            return (
              <View key={params.label}>
                <ListItem {...params} />
                {!isLastItem && <ListItemSeparator />}
              </View>
            )
          })}
        </View>
        <View style={style.bottomContainer}>
          <View style={style.infoRowContainer}>
            <View style={style.infoRow}>
              <Text style={style.infoRowLabel}>{t("about.version")}</Text>
              <Text style={style.infoRowValue}>{versionInfo}</Text>
            </View>
            <View style={style.infoRow}>
              <Text style={style.infoRowLabel}>
                {t("about.operating_system_abbr")}
              </Text>
              <Text style={style.infoRowValue}>{osInfo}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary10,
    paddingTop: Spacing.large,
  },
  topContainer: {
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.large,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.small,
  },
  aboutContent: {
    ...Typography.body1,
    fontSize: Typography.large,
    marginBottom: Spacing.medium,
  },
  listItemContainer: {
    backgroundColor: Colors.primaryLightBackground,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.medium,
  },
  infoRowContainer: {
    marginTop: Spacing.small,
    marginBottom: Spacing.medium,
  },
  infoRow: {
    flexDirection: "row",
  },
  infoRowLabel: {
    ...Typography.header5,
    color: Colors.primary150,
    width: 100,
    marginTop: Spacing.small,
  },
  infoRowValue: {
    ...Typography.body1,
    marginTop: Spacing.small,
  },
})

export default ConnectScreen
