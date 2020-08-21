import React, { FunctionComponent } from "react"
import { Image, StyleSheet, View, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { GlobalText } from "../components/GlobalText"
import { getLocalNames } from "../locales/languages"
import { Button } from "../components"
import { useApplicationName } from "../More/useApplicationInfo"

import { Images } from "../assets"
import { Spacing, Colors, Typography, Outlines } from "../styles"
import { Screens, OnboardingScreens, useStatusBarEffect } from "../navigation"

const Welcome: FunctionComponent = () => {
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  const { applicationName } = useApplicationName()
  useStatusBarEffect("dark-content")

  return (
    <View style={style.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate(Screens.LanguageSelection)}
        style={style.languageButtonContainer}
      >
        <GlobalText style={style.languageButtonText}>{languageName}</GlobalText>
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
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Spacing.xxHuge,
    paddingHorizontal: Spacing.large,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primaryLightBackground,
  },
  languageButtonContainer: {
    ...Outlines.ovalBorder,
    borderColor: Colors.primary125,
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.large,
  },
  languageButtonText: {
    ...Typography.body2,
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
