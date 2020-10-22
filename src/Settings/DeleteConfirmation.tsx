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

import {
  Outlines,
  Spacing,
  Buttons,
  Typography,
  Layout,
  Colors,
  Affordances,
} from "../styles"

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
        <ScrollView>
          <View style={style.headerContainer}>
            <Text style={style.headerText}>{t("settings.delete_my_data")}</Text>
          </View>
          <View style={style.bodyContainer}>
            <Text style={style.bodyText}>
              {t("settings.delete_data_disclosure1")}
            </Text>
            <Text style={style.subheaderText}>{"Note"}</Text>
            <Text style={style.bodyText}>
              {t("settings.delete_data_disclosure2")}
            </Text>
          </View>
        </ScrollView>
        <View style={style.bottomActionsContainer}>
          <TouchableOpacity
            onPress={handleOnPressDeleteAllData}
            accessibilityLabel={t("settings.delete_my_data")}
            accessibilityRole="button"
            style={style.buttonContainer}
          >
            <Text style={style.buttonText}>{t("settings.delete_my_data")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
    backgroundColor: Colors.background.primaryLight,
  },
  headerContainer: {
    marginTop: Spacing.xSmall,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    zIndex: Layout.zLevel1,
  },
  headerText: {
    flex: 10,
    ...Typography.header2,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xLarge,
    color: Colors.primary.shade150,
  },
  bodyContainer: {
    paddingHorizontal: Spacing.large,
    flex: 1,
    paddingTop: Spacing.medium,
  },
  bodyText: {
    ...Typography.body1,
    paddingBottom: Spacing.xxxLarge,
  },
  subheaderText: {
    ...Typography.header4,
    paddingBottom: Spacing.xxSmall,
  },
  closeIconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: Spacing.medium,
  },
  bottomActionsContainer: {
    alignItems: "center",
    borderTopWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade10,
    backgroundColor: Colors.secondary.shade10,
    paddingTop: Spacing.small,
    paddingBottom: Spacing.small,
    paddingHorizontal: Spacing.small,
  },
  buttonContainer: {
    ...Buttons.primary,
    ...Buttons.medium,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    paddingHorizontal: Spacing.xLarge,
    borderRadius: Outlines.borderRadiusMax,
    backgroundColor: Colors.accent.danger100,
  },
  buttonText: {
    ...Typography.buttonPrimary,
    flexGrow: 1,
    textAlign: "center",
  },
})

export default DeleteConfirmation
