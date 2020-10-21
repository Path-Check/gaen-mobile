import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Text } from "../components"
import { useStatusBarEffect } from "../navigation"
import { useCallbackFormContext } from "./CallbackFormContext"
import {
  loadAuthorityCopy,
  authorityCopyTranslation,
} from "../configuration/authorityCopy"
import { useConfigurationContext } from "../ConfigurationContext"

import { Images } from "../assets"
import { Buttons, Typography, Spacing, Colors } from "../styles"

const Success: FunctionComponent = () => {
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const { callBackRequestCompleted } = useCallbackFormContext()
  const navigation = useNavigation()
  useStatusBarEffect("light-content", Colors.headerBackground)
  const { healthAuthorityName } = useConfigurationContext()

  const successMessage = authorityCopyTranslation(
    loadAuthorityCopy("callback_success"),
    localeCode,
    t("callback.success_body", { healthAuthorityName }),
  )

  navigation.setOptions({
    headerLeft: null,
    title: t("callback.success_requested"),
  })

  const handleOnPressGotIt = () => {
    callBackRequestCompleted()
  }

  return (
    <ScrollView
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <Image
        source={Images.HowItWorksValueProposition}
        style={style.image}
        accessible
        accessibilityLabel={t("onboarding.welcome_image_label")}
      />
      <Text style={style.header}>{t("callback.success_header")}</Text>
      <Text style={style.body}>{successMessage}</Text>
      <TouchableOpacity
        onPress={handleOnPressGotIt}
        style={style.button}
        accessibilityLabel={t("callback.success_got_it")}
      >
        <Text style={style.buttonText}>{t("callback.success_got_it")}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Spacing.large,
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    ...Typography.header2,
    marginBottom: Spacing.medium,
  },
  body: {
    ...Typography.body1,
    marginBottom: Spacing.large,
  },
  image: {
    width: "97%",
    height: 220,
    marginBottom: Spacing.huge,
  },
  button: {
    ...Buttons.primary,
    width: "100%",
  },
  buttonText: {
    ...Typography.buttonPrimary,
  },
})

export default Success
