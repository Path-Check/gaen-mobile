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
import { Stacks, ModalScreens, useStatusBarEffect } from "../navigation"
import {
  ListItem,
  ListItemSeparator,
  StatusBar,
  GlobalText,
} from "../components"
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
  const { healthAuthorityName, displayCallbackForm } = useConfigurationContext()

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
      screen: ModalScreens.HowItWorksReviewFromConnect,
    })
  }

  const handleOnPressEmergencyContact = () => {
    Linking.openURL("tel:911")
  }

  const howTheAppWorks: ConnectListItem = {
    label: t("screen_titles.how_the_app_works"),
    onPress: handleOnPressHowTheAppWorks,
    icon: Icons.RestartWithCheck,
  }
  const emergencyContact: ConnectListItem = {
    label: t("about.emergency_contact"),
    onPress: handleOnPressEmergencyContact,
    icon: Icons.ChatBubble,
  }

  const listItems: ConnectListItem[] = [emergencyContact, howTheAppWorks]

  if (displayCallbackForm) {
    const callbackForm: ConnectListItem = {
      label: t("screen_titles.callback"),
      onPress: () => navigation.navigate(Stacks.Callback),
      icon: Icons.Headset,
    }
    listItems.push(callbackForm)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary10} />
      <ScrollView style={style.container} alwaysBounceVertical={false}>
        <View style={style.topContainer}>
          <GlobalText style={style.headerText}>{applicationName}</GlobalText>
          <GlobalText style={style.aboutContent}>{aboutContent}</GlobalText>
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
              <GlobalText style={style.infoRowLabel}>
                {t("about.version")}
              </GlobalText>
              <GlobalText style={style.infoRowValue}>{versionInfo}</GlobalText>
            </View>
            <View style={style.infoRow}>
              <GlobalText style={style.infoRowLabel}>
                {t("about.operating_system_abbr")}
              </GlobalText>
              <GlobalText style={style.infoRowValue}>{osInfo}</GlobalText>
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
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.large,
  },
  headerText: {
    ...Typography.header2,
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
    paddingHorizontal: Spacing.large,
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
