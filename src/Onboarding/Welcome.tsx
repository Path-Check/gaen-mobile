import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import {
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native"
import env from "react-native-config"

import { GlobalText } from "../components/GlobalText"
import { getLocalNames } from "../locales/languages"
import { Button } from "../components"

import { Images } from "../assets"
import { Spacing, Colors, Typography, Outlines } from "../styles"
import { Screens, OnboardingScreens, useStatusBarEffect } from "../navigation"

const Welcome: FunctionComponent = () => {
  useStatusBarEffect("light-content")
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  const appName = env.IN_APP_NAME || "PathCheck"

  return (
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={style.backgroundImage}
    >
      <View style={style.container}>
        <View style={style.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate(Screens.LanguageSelection)}
            style={style.languageSelector}
          >
            <GlobalText style={style.languageSelectorText}>
              {languageName}
            </GlobalText>
          </TouchableOpacity>
        </View>
        <View>
          <GlobalText style={style.mainText}>
            {t("label.launch_screen1_header")}
          </GlobalText>
          <GlobalText style={style.mainText}>{appName}</GlobalText>
        </View>
        <View style={style.footerContainer}>
          <Button
            invert
            label={t("label.launch_get_started")}
            onPress={() => navigation.navigate(OnboardingScreens.EulaModal)}
          />
        </View>
      </View>
    </ImageBackground>
  )
}

const style = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    paddingVertical: Spacing.xxxHuge,
    paddingHorizontal: Spacing.large,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  mainText: {
    ...Typography.header2,
    color: Colors.white,
  },
  languageSelector: {
    ...Outlines.ovalBorder,
    borderColor: Colors.white,
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.large,
  },
  languageSelectorText: {
    ...Typography.base,
    letterSpacing: Typography.mediumLetterSpacing,
    color: Colors.white,
    textAlign: "center",
    textTransform: "uppercase",
  },
  headerContainer: {
    height: 150,
  },
  footerContainer: {
    width: "100%",
    height: 150,
    justifyContent: "flex-end",
  },
})

export default Welcome
