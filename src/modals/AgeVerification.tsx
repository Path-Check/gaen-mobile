import React, { FunctionComponent } from "react"
import { TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useConfigurationContext } from "../ConfigurationContext"
import { useApplicationInfo } from "../hooks/useApplicationInfo"
import { Stacks, useStatusBarEffect } from "../navigation"
import { Text } from "../components"

import { Buttons, Colors, Spacing, Typography } from "../styles"

const AgeVerification: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.secondaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { applicationName } = useApplicationInfo()
  const { minimumAge } = useConfigurationContext()

  const handleOnPressConfirm = () => {
    navigation.navigate(Stacks.HowItWorks)
  }

  const handleOnPressNo = () => {
    navigation.goBack()
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <Text style={style.headerText}>{t("onboarding.verify_your_age")}</Text>
      <Text style={style.subheaderText}>
        {t("onboarding.you_must_be", { applicationName, minimumAge })}
      </Text>
      <TouchableOpacity onPress={handleOnPressConfirm} style={style.button}>
        <Text style={style.buttonText}>
          {t("onboarding.i_am_over", { minimumAge })}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleOnPressNo} style={style.buttonSecondary}>
        <Text style={style.buttonSecondaryText}>
          {t("onboarding.no_take_me")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background.secondaryLight,
    paddingVertical: Spacing.huge,
    paddingHorizontal: Spacing.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    ...Typography.header2,
    textAlign: "center",
    marginBottom: Spacing.medium,
  },
  subheaderText: {
    ...Typography.body1,
    textAlign: "center",
    marginBottom: Spacing.huge,
  },
  button: {
    ...Buttons.primary.base,
    marginBottom: Spacing.xSmall,
  },
  buttonText: {
    ...Typography.buttonPrimary,
  },
  buttonSecondary: {
    ...Buttons.secondary.base,
  },
  buttonSecondaryText: {
    ...Typography.buttonSecondary,
  },
})

export default AgeVerification
