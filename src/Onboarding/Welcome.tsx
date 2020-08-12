import React, { FunctionComponent } from "react"
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import { GlobalText } from "../components/GlobalText"
import { getLocalNames } from "../locales/languages"
import { Button } from "../components"

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
  const appName = env.IN_APP_NAME || "PathCheck"
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
        <GlobalText style={style.mainText}>{appName}</GlobalText>
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
    paddingVertical: Spacing.xxxHuge,
    paddingHorizontal: Spacing.large,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primaryBackground,
  },
  languageButtonContainer: {
    ...Outlines.ovalBorder,
    borderColor: Colors.primaryViolet,
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.large,
  },
  languageButtonText: {
    ...Typography.base,
    letterSpacing: Typography.mediumLetterSpacing,
    color: Colors.primaryViolet,
    textAlign: "center",
    textTransform: "uppercase",
  },
  image: {
    resizeMode: "contain",
    height: 280,
    marginBottom: Spacing.huge,
  },
  mainText: {
    ...Typography.header2,
    color: Colors.primaryText,
    textAlign: "center",
  },
})

export default Welcome
