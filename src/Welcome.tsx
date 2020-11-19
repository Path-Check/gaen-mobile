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
import { SvgXml } from "react-native-svg"

import { StatusBar, Text } from "./components"
import { useLocaleInfo } from "./locales/languages"
import { useApplicationName } from "./Device/useApplicationInfo"
import { useConfigurationContext } from "./ConfigurationContext"
import { ModalStackScreens, useStatusBarEffect, Stacks } from "./navigation"
import { useCustomCopy } from "./configuration/useCustomCopy"

import { Images, Icons } from "./assets"
import {
  Spacing,
  Colors,
  Typography,
  Outlines,
  Layout,
  Buttons,
} from "./styles"

const Welcome: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { languageName } = useLocaleInfo()
  const { applicationName } = useApplicationName()
  const { displayAgeVerification } = useConfigurationContext()

  const { welcomeMessage: customWelcomeMessage } = useCustomCopy()
  const welcomeMessage =
    customWelcomeMessage || t("label.launch_screen1_header")

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(ModalStackScreens.LanguageSelection)
  }

  const handleOnPressGetStarted = () => {
    if (displayAgeVerification) {
      navigation.navigate(ModalStackScreens.AgeVerification)
    } else {
      navigation.navigate(Stacks.HowItWorks)
    }
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.mainContentContainer}>
          <TouchableOpacity
            onPress={handleOnPressSelectLanguage}
            accessibilityLabel={t("common.select_language")}
            accessibilityRole="button"
          >
            <View style={style.languageButtonContainer}>
              <Text style={style.languageButtonText}>{languageName}</Text>
            </View>
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
          <TouchableOpacity
            style={style.button}
            onPress={handleOnPressGetStarted}
            accessibilityLabel={t("label.launch_get_started")}
          >
            <Text style={style.buttonText}>
              {t("label.launch_get_started")}
            </Text>
            <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  mainContentContainer: {
    flex: 1,
    paddingBottom: Spacing.xxHuge,
    paddingHorizontal: Spacing.large,
    alignItems: "center",
    justifyContent: "space-between",
  },
  languageButtonContainer: {
    marginTop: Spacing.medium,
    backgroundColor: Colors.secondary.shade50,
    borderRadius: Outlines.borderRadiusMax,
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.xLarge,
    marginBottom: Spacing.xSmall,
  },
  languageButtonText: {
    ...Typography.body.x10,
    letterSpacing: Typography.letterSpacing.x30,
    color: Colors.primary.shade125,
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
    ...Typography.header.x60,
    color: Colors.text.primary,
    textAlign: "center",
  },
  nameText: {
    ...Typography.header.x60,
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: Spacing.huge,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
})

export default Welcome
