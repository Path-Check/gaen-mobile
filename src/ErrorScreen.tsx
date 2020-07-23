import React, { FunctionComponent } from "react"
import { SafeAreaView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { Button } from "./components/Button"
import { RTLEnabledText } from "./components/RTLEnabledText"

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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <RTLEnabledText style={styles.title}>
            {t("errors.title")}
          </RTLEnabledText>
          <RTLEnabledText style={styles.subtitle}>
            {t("errors.description")}
          </RTLEnabledText>
          <RTLEnabledText style={styles.error}>{parseError}</RTLEnabledText>
        </View>
        <View style={styles.buttonContainer}>
          <Button label={t("errors.reload")} onPress={resetError} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.red,
    flex: 1,
  },
  content: {
    marginHorizontal: Spacing.small,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textContainer: {
    paddingTop: Spacing.large,
  },
  buttonContainer: {
    paddingBottom: Spacing.large,
  },
  title: {
    color: Colors.white,
    fontSize: Typography.huge,
    paddingBottom: Spacing.small,
  },
  subtitle: {
    color: Colors.white,
    fontSize: Typography.largest,
  },
  error: {
    color: Colors.white,
    paddingVertical: Spacing.small,
  },
})
