import React, { FunctionComponent } from "react"
import {
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from "react-native"
import { useTranslation } from "react-i18next"
import { showMessage } from "react-native-flash-message"

import { useOnboardingContext } from "../OnboardingContext"
import { useProductAnalyticsContext } from "../ProductAnalytics/Context"
import { useSymptomHistoryContext } from "../SymptomHistory/SymptomHistoryContext"
import { useConfigurationContext } from "../ConfigurationContext"
import { useApplicationName } from "../Device/useApplicationInfo"
import { resetUserLocale } from "../locales/languages"

import { OperationResponse } from "../OperationResponse"
import * as Storage from "../utils/storage"
import { useStatusBarEffect } from "../navigation"
import { Text } from "../components"

import { Spacing, Buttons, Typography, Colors, Affordances } from "../styles"

const DeleteConfirmation: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const { resetOnboarding } = useOnboardingContext()
  const { resetUserConsent } = useProductAnalyticsContext()
  const { deleteAllEntries } = useSymptomHistoryContext()
  const { applicationName } = useApplicationName()
  const {
    displaySymptomHistory,
    enableProductAnalytics,
  } = useConfigurationContext()
  const {
    successFlashMessageOptions,
    errorFlashMessageOptions,
  } = Affordances.useFlashMessageOptions()

  const deleteAllData = async (): Promise<OperationResponse> => {
    resetOnboarding()
    resetUserConsent()
    resetUserLocale()
    Storage.removeAll()
    const deleteAllEntriesResult = await deleteAllEntries()
    return deleteAllEntriesResult
  }

  const showAlert = () => {
    Alert.alert(
      t("settings.delete_data_are_you_sure"),
      t("settings.delete_data_this_action", { applicationName }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.confirm"),
          onPress: () => handleOnPressConfirmDeleteData(),
          style: "destructive",
        },
      ],
    )
  }

  const handleOnPressConfirmDeleteData = async () => {
    const result = await deleteAllData()
    if (result.kind === "success") {
      showMessage({
        message: t("settings.data_deleted"),
        ...successFlashMessageOptions,
      })
    } else {
      showMessage({
        message: t("settings.errors.deleting_data"),
        ...errorFlashMessageOptions,
      })
    }
  }

  const handleOnPressDeleteAllData = () => {
    showAlert()
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.secondary.shade10} />
      <View style={style.container}>
        <ScrollView
          contentContainerStyle={style.contentContainer}
          alwaysBounceVertical={false}
        >
          <Text style={style.headerText}>{t("settings.delete_my_data")}</Text>
          <Text style={style.bodyText}>
            {t("settings.delete_data_disclosure1", { applicationName })}
          </Text>
          <View style={style.bulletsContainer}>
            <Text style={style.bulletText}>
              • {t("settings.delete_data_language_token")}
            </Text>
            <Text style={style.bulletText}>
              • {t("settings.delete_data_onboarding_token")}
            </Text>
            {enableProductAnalytics && (
              <Text style={style.bulletText}>
                • {t("settings.delete_data_product_analytics")}
              </Text>
            )}
            {displaySymptomHistory && (
              <Text style={style.bulletText}>
                • {t("settings.delete_data_symptom_history")}
              </Text>
            )}
          </View>
          <Text style={style.subheaderText}>
            {`${t("settings.delete_data_note")}:`}
          </Text>
          <Text style={style.bodyText}>
            {t("settings.delete_data_disclosure2")}
          </Text>
        </ScrollView>
        <TouchableOpacity
          onPress={handleOnPressDeleteAllData}
          accessibilityLabel={t("settings.delete_my_data")}
          accessibilityRole="button"
          style={style.buttonContainer}
        >
          <Text style={style.buttonText}>{t("settings.delete_my_data")}</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingTop: Spacing.small,
    paddingBottom: Spacing.medium,
    paddingHorizontal: Spacing.medium,
  },
  headerText: {
    ...Typography.header.x50,
    ...Typography.style.semibold,
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.body.x30,
    marginBottom: Spacing.small,
  },
  bulletsContainer: {
    marginBottom: Spacing.small,
  },
  bulletText: {
    ...Typography.body.x30,
    marginBottom: Spacing.xSmall,
  },
  subheaderText: {
    ...Typography.header.x30,
    marginBottom: Spacing.xxSmall,
  },
  buttonContainer: {
    ...Buttons.fixedBottom.base,
    backgroundColor: Colors.accent.danger100,
  },
  buttonText: {
    ...Typography.button.fixedBottom,
  },
})

export default DeleteConfirmation
