import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native"

import { Text } from "../components"
import { useStatusBarEffect } from "../navigation"
import { useCallbackFormContext } from "./CallbackFormContext"
import { useCustomCopy } from "../configuration/useCustomCopy"

import { Images } from "../assets"
import { Buttons, Typography, Spacing, Colors } from "../styles"

const Success: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const { callBackRequestCompleted } = useCallbackFormContext()
  const { healthAuthorityName } = useCustomCopy()

  const successMessage = t("callback.success_body", { healthAuthorityName })

  const handleOnPressGotIt = () => {
    callBackRequestCompleted()
  }

  return (
    <ScrollView
      style={style.container}
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
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.background.primaryLight,
    justifyContent: "center",
  },
  header: {
    ...Typography.header.x50,
    marginBottom: Spacing.medium,
  },
  body: {
    ...Typography.body.x30,
    marginBottom: Spacing.large,
  },
  image: {
    width: "97%",
    height: 220,
    marginBottom: Spacing.huge,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
  },
})

export default Success
