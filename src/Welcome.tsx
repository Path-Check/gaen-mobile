import React, { FunctionComponent } from "react"
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import LinearGradient from "react-native-linear-gradient"

import { StatusBar, Text, Button } from "./components"
import { getLocalNames } from "./locales/languages"
import { useApplicationName } from "./hooks/useApplicationInfo"
import { ModalStackScreens, useStatusBarEffect, Stacks } from "./navigation"
import {
  loadAuthorityCopy,
  authorityCopyTranslation,
} from "./configuration/authorityCopy"

import { Images } from "./assets"
import { Spacing, Colors, Typography, Outlines, Layout } from "./styles"

const Welcome: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  const { applicationName } = useApplicationName()

  const welcomeMessage = authorityCopyTranslation(
    loadAuthorityCopy("welcome_message"),
    localeCode,
    t("label.launch_screen1_header"),
  )

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(ModalStackScreens.LanguageSelection)
  }

  const handleOnPressGetStarted = () => {
    navigation.navigate(Stacks.HowItWorks)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.mainContentContainer}>
          <TouchableOpacity
            onPress={handleOnPressSelectLanguage}
            style={style.languageButtonContainer}
          >
            <LinearGradient
              colors={Colors.gradient10}
              useAngle
              angle={0}
              angleCenter={{ x: 0.5, y: 0.5 }}
              style={style.languageButtonContainer}
            >
              <Text style={style.languageButtonText}>{languageName}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={style.imageAndText}>
            <Image
              source={Images.WelcomeImage}
              style={style.image}
              accessible
              accessibilityLabel={t("onboarding.welcome_image_label")}
            />
            <Text style={style.welcomeToText}>{welcomeMessage}</Text>
            <Text style={style.nameText}>{applicationName}</Text>
          </View>
          <Button
            label={t("label.launch_get_started")}
            onPress={handleOnPressGetStarted}
            hasRightArrow
          />
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  mainContentContainer: {
    flex: 1,
    paddingBottom: Spacing.xxHuge,
    paddingHorizontal: Spacing.large,
    alignItems: "center",
    justifyContent: "space-between",
  },
  languageButtonContainer: {
    borderRadius: Outlines.borderRadiusMax,
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.xLarge,
    marginBottom: Spacing.xSmall,
  },
  languageButtonText: {
    ...Typography.body3,
    letterSpacing: Typography.largeLetterSpacing,
    color: Colors.primary125,
    textAlign: "center",
    textTransform: "uppercase",
  },
  imageAndText: {
    alignItems: "center",
  },
  image: {
    height: 280,
    width: Layout.screenWidth * 0.8,
    resizeMode: "contain",
    marginBottom: Spacing.huge,
  },
  welcomeToText: {
    ...Typography.header1,
    color: Colors.primaryText,
    textAlign: "center",
  },
  nameText: {
    ...Typography.header1,
    color: Colors.primaryText,
    textAlign: "center",
    marginBottom: Spacing.huge,
  },
})

export default Welcome
