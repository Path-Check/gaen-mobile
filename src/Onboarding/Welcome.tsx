import React, { FunctionComponent } from "react"
import { Image, StyleSheet, View, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import LinearGradient from "react-native-linear-gradient"

import { GlobalText, Button, GradientBackground } from "../components"
import { getLocalNames } from "../locales/languages"
import { useApplicationName } from "../hooks/useApplicationInfo"
import { Screens, OnboardingScreens, useStatusBarEffect } from "../navigation"

import { Images } from "../assets"
import { Spacing, Colors, Typography, Outlines } from "../styles"

const Welcome: FunctionComponent = () => {
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  const { applicationName } = useApplicationName()
  useStatusBarEffect("dark-content")

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(Screens.LanguageSelection)
  }

  return (
    <GradientBackground gradient={Colors.gradientPrimary10} angleCenterY={0.25}>
      <View style={style.container}>
        <TouchableOpacity
          onPress={handleOnPressSelectLanguage}
          style={style.languageButtonContainer}
        >
          <LinearGradient
            colors={Colors.gradientPrimary10}
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
            source={Images.PeopleOnNetworkNodes}
            style={style.image}
            accessible
            accessibilityLabel={t("onboarding.welcome_image_label")}
          />
          <GlobalText style={style.mainText}>
            {t("label.launch_screen1_header")}
          </GlobalText>
          <GlobalText style={style.mainText}>{applicationName}</GlobalText>
        </View>
        <Button
          label={t("label.launch_get_started")}
          onPress={() => navigation.navigate(OnboardingScreens.Introduction)}
          hasRightArrow
        />
      </View>
    </GradientBackground>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Spacing.xxHuge,
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
