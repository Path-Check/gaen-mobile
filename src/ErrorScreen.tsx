import React, { FunctionComponent } from "react"
import { SafeAreaView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { Text, Button } from "./components"

import { Colors, Spacing, Typography } from "./styles"

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
          <Button label={t("errors.reload")} onPress={resetError} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary125,
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
    color: Colors.white,
    marginBottom: Spacing.small,
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.white,
    marginBottom: Spacing.xxSmall,
  },
  error: {
    ...Typography.body1,
    color: Colors.white,
  },
})
