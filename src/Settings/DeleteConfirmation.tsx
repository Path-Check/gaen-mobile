import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { StatusBar, StyleSheet, View, ScrollView } from "react-native"
import { showMessage } from "react-native-flash-message"

import { useOnboardingContext } from "../OnboardingContext"
import { useSymptomHistoryContext } from "../SymptomHistory/SymptomHistoryContext"

import { Text } from "../components"
import { TouchableOpacity } from "react-native"
import { useStatusBarEffect } from "../navigation"
import { SUCCESS_RESPONSE } from "../OperationResponse"

import { Spacing, Buttons, Typography, Colors, Affordances } from "../styles"

const DeleteConfirmation: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const { resetOnboarding } = useOnboardingContext()
  const { deleteAllEntries } = useSymptomHistoryContext()

  const { t } = useTranslation()
  const handleOnPressDeleteAllData = async () => {
    const deleteLogEntriesResult = await deleteAllEntries()
    if (deleteLogEntriesResult === SUCCESS_RESPONSE) {
      resetOnboarding()
      showMessage({
        message: t("settings.data_deleted"),
        ...Affordances.successFlashMessageOptions,
      })
    } else {
      showMessage({
        message: t("settings.errors.deleting_data"),
        ...Affordances.errorFlashMessageOptions,
      })
    }
  }
  return (
    <>
      <StatusBar backgroundColor={Colors.secondary.shade10} />
      <View style={style.container}>
        <ScrollView
          style={style.scrollContentContainer}
          alwaysBounceVertical={false}
        >
          <Text style={style.headerText}>{t("settings.delete_my_data")}</Text>
          <Text style={style.bodyText}>
            {t("settings.delete_data_disclosure1")}
          </Text>
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
  scrollContentContainer: {
    paddingTop: Spacing.small,
    paddingHorizontal: Spacing.large,
  },
  headerText: {
    ...Typography.header2,
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.body1,
    marginBottom: Spacing.xxxLarge,
  },
  subheaderText: {
    ...Typography.header4,
    marginBottom: Spacing.xxSmall,
  },
  buttonContainer: {
    ...Buttons.fixedBottom,
    backgroundColor: Colors.accent.danger100,
  },
  buttonText: {
    ...Typography.buttonFixedBottom,
  },
})

export default DeleteConfirmation
