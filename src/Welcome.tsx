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

import { StatusBar, GlobalText, Button, GradientBackground } from "./components"
import { getLocalNames } from "./locales/languages"
import { useApplicationName } from "./hooks/useApplicationInfo"
import { ModalStackScreens, useStatusBarEffect, Stacks } from "./navigation"
import {
  loadAuthorityCopy,
  authorityCopyTranslation,
} from "./configuration/authorityCopy"

import { Images } from "./assets"
import { Spacing, Colors, Typography, Outlines } from "./styles"

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
    navigation.navigate(Stacks.Modal, {
      screen: ModalStackScreens.LanguageSelection,
    })
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={style.contentContainer}
      >
        <GradientBackground gradient={Colors.gradient10} angleCenterY={0.75}>
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
                <GlobalText style={style.languageButtonText}>
                  {languageName}
                </GlobalText>
              </LinearGradient>
            </TouchableOpacity>
            <View>
              <Image
                source={Images.WelcomeImage}
                style={style.image}
                accessible
                accessibilityLabel={t("onboarding.welcome_image_label")}
              />
              <GlobalText style={style.mainText}>{welcomeMessage}</GlobalText>
              <GlobalText style={style.mainText}>{applicationName}</GlobalText>
            </View>
            <Button
              label={t("label.launch_get_started")}
              onPress={() => navigation.navigate(Stacks.HowItWorks)}
              hasRightArrow
            />
          </View>
        </GradientBackground>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
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
  image: {
    resizeMode: "contain",
    height: 280,
    marginBottom: Spacing.huge,
  },
  mainText: {
    ...Typography.header1,
    color: Colors.primaryText,
    textAlign: "center",
  },
})

export default Welcome
