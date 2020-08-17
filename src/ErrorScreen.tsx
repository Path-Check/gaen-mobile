import React, { FunctionComponent } from "react"
import { SafeAreaView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { GlobalText } from "./components/GlobalText"
import { Button } from "./components/Button"

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
          <GlobalText style={style.title}>{t("errors.title")}</GlobalText>
          <GlobalText style={style.subtitle}>
            {t("errors.description")}
          </GlobalText>
          <GlobalText style={style.error}>{parseError}</GlobalText>
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
    ...Typography.header2,
    color: Colors.white,
    marginBottom: Spacing.small,
  },
  subtitle: {
    ...Typography.mainContent,
    color: Colors.white,
    marginBottom: Spacing.xxSmall,
  },
  error: {
    ...Typography.tertiaryContent,
    color: Colors.white,
  },
})
