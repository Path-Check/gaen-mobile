import React, { FunctionComponent } from "react"
import { SafeAreaView, View, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"

import { Text } from "./components"

import { Buttons, Colors, Spacing, Typography } from "./styles"

interface ErrorScreenProps {
  error: Error | string
  resetError: () => void
}

export const ErrorScreen: FunctionComponent<ErrorScreenProps> = ({
  error,
  resetError,
}) => {
  const { t } = useTranslation()
  const parseError = error.toString()

  return (
    <SafeAreaView style={style.container}>
      <View style={style.content}>
        <View style={style.textContainer}>
          <Text style={style.title}>{t("errors.title")}</Text>
          <Text style={style.subtitle}>{t("errors.description")}</Text>
          <Text style={style.error}>{parseError}</Text>
        </View>
        <View style={style.buttonContainer}>
          <TouchableOpacity
            onPress={resetError}
            accessibilityLabel={t("errors.reload")}
            style={style.button}
          >
            <Text style={style.buttonText}>{t("errors.reload")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    marginHorizontal: Spacing.small,
  },
  textContainer: {
    paddingTop: Spacing.large,
  },
  buttonContainer: {
    paddingBottom: Spacing.large,
  },
  title: {
    ...Typography.header1,
    marginBottom: Spacing.small,
  },
  subtitle: {
    ...Typography.body1,
    marginBottom: Spacing.xxSmall,
  },
  error: {
    ...Typography.error,
  },
  button: {
    ...Buttons.primary,
  },
  buttonText: {
    ...Typography.buttonPrimary,
    textAlign: "center",
  },
})
