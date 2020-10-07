import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import {
  DAYS_AFTER_LOG_IS_CONSIDERED_STALE,
  useSymptomLogContext,
} from "./SymptomLogContext"
import { SymptomLogEntry } from "./symptoms"
import { Text, StatusBar, Button } from "../components"
import { useStatusBarEffect, MyHealthStackScreens } from "../navigation"
import SymptomLogListItem from "./SymptomLogListItem"

import { Buttons, Typography, Colors, Outlines, Spacing } from "../styles"

const SymptomLog: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const { symptomLogEntries } = useSymptomLogContext()
  const navigation = useNavigation()

  const hasSymptomHistory = symptomLogEntries.length > 0

  const handleOnPressLogSymptoms = () => {
    navigation.navigate(MyHealthStackScreens.SelectSymptoms)
  }

  const NoSymptomHistory = () => {
    return (
      <Text style={style.noSymptomHistoryText}>
        {t("symptom_checker.no_symptom_history")}
      </Text>
    )
  }

  const SymptomHistory = () => {
    return (
      <View>
        {symptomLogEntries.map((logEntry: SymptomLogEntry) => {
          return <SymptomLogListItem key={logEntry.date} logEntry={logEntry} />
        })}
      </View>
    )
  }

  return (
    <View style={style.outerContainer}>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <Text style={style.headerText}>{t("symptom_checker.symptom_log")}</Text>
        <Text style={style.subHeaderText}>
          {t("symptom_checker.to_protect_your_privacy", {
            days: DAYS_AFTER_LOG_IS_CONSIDERED_STALE,
          })}
        </Text>

        {hasSymptomHistory ? <SymptomHistory /> : <NoSymptomHistory />}
      </ScrollView>
      <View style={style.bottomActionsContainer}>
        <Button
          onPress={handleOnPressLogSymptoms}
          label={t("symptom_checker.log_symptoms")}
          customButtonStyle={style.button}
          customButtonInnerStyle={style.buttonInner}
          hasPlusIcon
        />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.medium,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.xxxSmall,
  },
  subHeaderText: {
    ...Typography.body3,
    marginBottom: Spacing.large,
  },
  noSymptomHistoryText: {
    ...Typography.body1,
  },
  bottomActionsContainer: {
    alignItems: "center",
    borderTopWidth: Outlines.hairline,
    borderColor: Colors.neutral10,
    backgroundColor: Colors.secondary10,
    paddingTop: Spacing.small,
    paddingBottom: Spacing.medium,
    paddingHorizontal: Spacing.medium,
  },
  button: {
    width: "100%",
  },
  buttonInner: {
    ...Buttons.medium,
    width: "100%",
  },
})

export default SymptomLog
